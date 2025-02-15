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
    const messagesEndRef = useRef(null); // 마지막 메시지 div를 가리킬 ref 생성
    const messageListRef = useRef(null); // message-list를 참조하는 ref 생성

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };
    
    // 채팅창 제일 마지막으로 위치
    useEffect(() => {
        
        if (messagesEndRef.current) {            
            // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [state.messages]);

    useEffect(() => {
        if (!user) {
            updateState('employees', []);
            updateState('selectedEmail', null);
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

    const connectSocket = (email) => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${localStorage.getItem("authToken")}`);

        // ws.onopen = () => {
        //     console.log('WebSocket 연결이 열렸습니다.');
        // };
        // ws.onclose = () => {
        //     console.log('WebSocket 연결이 닫혔습니다. 다시 시도합니다.');
        // };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data).message;
                console.log("받은 메시지2:", message);

                console.log(message.receiver_email) //받는 사람(admin)
                console.log(message.sender_email) //보내는 사람(test)

                console.log(user.email) //나(admin)
                console.log(state.selectedEmail) //선택한 채팅방(test2)
                
                if(message.sender_email === user.email){
                    console.log("(1)")
                    setState((prev) => ({
                        ...prev,
                        messages: [...prev.messages, message],
                    }));
                }
                
                else if (message.receiver_email === user.email && state.selectedEmail !== message.sender_email) {
                    console.log("(2)")
                    setState((prev) => ({
                        ...prev,
                        unreadMessages: {
                            ...prev.unreadMessages,
                            [message.sender_email]: (prev.unreadMessages[message.sender_email] || 0) + 1,
                        },
                    }));
                }
                
                else if (message.receiver_email === user.email && message.sender_email === user.email) {                            
                    console.log("(3)")
                    setState((prev) => ({
                        ...prev,
                        messages: [...prev.messages, message],
                    }));
                }

            } catch (error) {
                console.log("WebSocket 메시지 처리 중 오류 발생:", error);
            }
        };
        socketRef.current = ws;
    };

    const handleEmailClick = async (email) => {
        updateState('selectedEmail', email); // 선택한 이메일 주소
        updateState('unreadMessages', { ...state.unreadMessages, [email]: 0 }); // 선택된 이메일의 알림 수 초기화
    
        try {
            const response = await axiosInstance.post(`${API_URLS.CHAT}`, {
                myEmail: user.email,
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
                                             <td>
                                                {employee.email}
                                                {state.unreadMessages[employee.email] > 0 && (
                                                    <span className="notification-badge">
                                                        {state.unreadMessages[employee.email]}
                                                    </span>
                                                )}
                                            </td>
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
                <div className="selected-email">
                    {state.selectedEmail ? <h3>{state.selectedEmail}</h3> : <h3>채팅방을 선택하세요</h3>}
                </div>
                    <div className="chat-window">
                        <div className="message-list" ref={messageListRef}>
                            {Array.isArray(state.messages) && state.messages.length > 0 ? (
                                state.messages.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className={`message-item ${message.sender_email === user?.email ? 'my-message' : 'other-message'}`}
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
                            <div ref={messagesEndRef} />
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
