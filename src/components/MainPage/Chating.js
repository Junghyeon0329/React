import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/UserContext';
import axiosInstance from '../../api/axiosInstance';
import API_URLS from '../../api/apiURLS';
import './Chating.css';

function Chat() {
    const { user } = useUser();
    const [state, setState] = useState({
        messages: [],
        inputValue: '',
        socket: null,
        employees: [],        
        selectedEmail: null,
        unreadMessages: {},
    });

    const socketRef = useRef(null);

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };
    

    useEffect(() => {
        if (!user) {
            updateState('employees', []);
            return;
        }

        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get(API_URLS.USER);
                const filteredEmployees = response.data.data.filter(employee => employee.email !== user.email);
                updateState('employees', filteredEmployees);
            } catch (error) {
                console.error('사원 정보를 불러오는 데 실패했습니다:', error);
            }
        };
    
        fetchEmployees();
    }, [user]);

    useEffect(() => { // 로그아웃을 진행했을때
        if (!user) {
            updateState('messages', []);
        }
    }, [user]);

    useEffect(() => {
        console.log("messages 상태가 변경되었습니다:", state.messages);
    }, [state.messages]);

    useEffect(() => {
        if (!user) return;
    
        if (socketRef.current) {
            socketRef.current.close();
        }
    
        const token = localStorage.getItem("authToken");
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${token}`);
    
        ws.onopen = () => {
            console.log('WebSocket 연결이 열렸습니다.');
        };
        ws.onerror = (error) => {
            console.error('webSocket 오류 발생:', error);
        };
    
        ws.onmessage = (event) => {
            console.log("onmessage 이벤트 실행됨");
            try {
                const message = JSON.parse(event.data).message;
                console.log("받은 메시지:", message);
        
                // 메시지 처리
                if (message.receiver_email === user.email || message.sender_email === user.email) {
                    setState((prev) => ({
                        ...prev,
                        messages: [...prev.messages, message],
                    }));
                }
            } catch (error) {
                console.error("WebSocket 메시지 처리 중 오류 발생:", error);
            }
        };        
    
        ws.onclose = (event) => {
            console.log("🔴 WebSocket 연결이 닫혔습니다.", event);
        };
    
        socketRef.current = ws;
    
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [user]);

    const connectSocket = (email) => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        const token = localStorage.getItem("authToken");
        console.log("token:", token)
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${token}`);
        // const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/`);

        ws.onopen = () => {
            console.log('WebSocket 연결이 열렸습니다.');
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data).message;        
                if (message.receiver_email === user.email || message.sender_email === user.email) {                            
                    setState((prev) => ({
                        ...prev,
                        messages: [...prev.messages, message],
                    }));
                }
            } catch (error) {
                console.log("WebSocket 메시지 처리 중 오류 발생:", error);
            }
        };
        
        ws.onclose = () => {
            console.log('WebSocket 연결이 닫혔습니다. 다시 시도합니다.');
        };

        socketRef.current = ws;
    };

    const handleEmailClick = async (email) => {
        updateState('selectedEmail', email); // 선택한 이메일 주소
    
        const myEmail = user.email; // 로그인한 사용자의 이메일 주소
    
        try {
            const response = await axiosInstance.post(`${API_URLS.CHAT}`, {
                myEmail: myEmail,
                otherEmail: email,
            });
            updateState('messages', response.data.messages);
            connectSocket(email);
        } catch (error) {
            console.error('대화 내용을 불러오는 데 실패했습니다:', error);
        }
    };

    const handleSendMessage = () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (state.inputValue.trim() === '') return;

        const message = {
            user: user.name,
            text: state.inputValue,
            timestamp: new Date().toLocaleTimeString(),
            receiver_email: state.selectedEmail,
            sender_email: user.email,
        };

        if (socketRef.current) {
            socketRef.current.send(JSON.stringify(message));
        }

        updateState('inputValue', ''); // 메시지 전송 후 입력창 초기화
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줌
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="grid-item Chating">
            <div className="chat-container">
                <div className="chat-sidebar">
                    <div className="employee-list">
                        {state.employees.length > 0 ? (
                            <table className="employee-table">
                                <thead>
                                    <tr>
                                        <th>이메일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.employees.map((employee) => (
                                        <tr
                                            key={employee.email} // username 대신 email 사용
                                            onClick={() => handleEmailClick(employee.email)}
                                            className={state.selectedEmail === employee.email ? 'selected' : ''}
                                        >
                                            <td>{employee.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>로그인이 필요한 기능입니다.</p>
                        )}
                    </div>
                </div>

                <div className="chat-main">
                    <div className="chat-window">
                        <div className="message-list">
                            {Array.isArray(state.messages) && state.messages.length > 0 ? (
                                state.messages.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className={`message-item ${message.sender_email === user.email ? 'my-message' : 'other-message'}`}
                                    >
                                        <span className="message-user">{message.sender_email}:</span>
                                        <span className="message-text">{message.text}</span>
                                        <span className="message-timestamp">
                                            {message.timestamp ? formatTimestamp(message.timestamp) : '시간 없음'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>{user ? '메시지가 없습니다.' : '로그인 후 메시지를 확인할 수 있습니다.'}</p>
                            )}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="메시지를 입력하세요..."
                                value={state.inputValue}
                                onChange={(e) => updateState('inputValue', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>전송</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
