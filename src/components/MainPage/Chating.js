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
    });

    const socketRef = useRef(null);

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!user) {
                updateState('employees', []);
                return;
            }

            try {
                const response = await axiosInstance.get(API_URLS.USER);
                updateState('employees', response.data.data);
            } catch (error) {
                console.error('사원 정보를 불러오는 데 실패했습니다:', error);
            }
        };

        fetchEmployees();
    }, [user]); 

    useEffect(() => {
        const connectSocket = () => {
            const ws = new WebSocket(`ws://127.0.0.1:9000/ws/chat/`);

            ws.onopen = () => {
                console.log('WebSocket 연결이 열렸습니다.');
            };

            ws.onmessage = (event) => {
                const newMessage = JSON.parse(event.data);
                updateState('messages', [...state.messages, newMessage]);
            };

            ws.onclose = () => {
                console.log('WebSocket 연결이 닫혔습니다. 다시 시도합니다.');
                setTimeout(connectSocket, 3000);
            };

            socketRef.current = ws;
            updateState('socket', ws);
        };

        if (!socketRef.current) {
            connectSocket();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [state.messages]);

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
        };

        if (socketRef.current) {
            socketRef.current.send(JSON.stringify(message));
        }

        updateState('inputValue', ''); // 메시지 전송 후 입력창 초기화
    };

    return (
        <div className="grid-item Chating">
            <div className="chat-container">
                <div className="chat-sidebar">
                    <div className="employee-list">
                        {/* <h3>사원 정보</h3> */}
                        {state.employees.length > 0 ? (
                            <table className="employee-table">
                                <thead>
                                    <tr>
                                        {/* <th>아이디</th> */}
                                        <th>이메일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.employees.map((employee) => (
                                        <tr key={employee.username}>
                                            {/* <td>{employee.username}</td> */}
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
                
                {/* Main Chat Section */}
                <div className="chat-main">
                    <div className="chat-window">
                        <div className="message-list">
                            {state.messages.map((message) => (
                                <div key={message.id} className="message-item">
                                    <span className="message-user">{message.user}:</span>
                                    <span className="message-text">{message.text}</span>
                                    {/* <span className="message-timestamp">{message.timestamp}</span> */}
                                </div>
                            ))}
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
