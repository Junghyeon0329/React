import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import './Chating.css';

function Chat() {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // WebSocket 연결 설정
        const ws = new WebSocket('ws://localhost:8000/ws/chat/');
        ws.onopen = () => {
            console.log('WebSocket 연결이 열렸습니다.');
        };
        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);  // 서버에서 보낸 메시지 처리
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        ws.onclose = () => {
            console.log('WebSocket 연결이 닫혔습니다.');
        };
        setSocket(ws);

        // 컴포넌트가 언마운트 될 때 WebSocket 연결 종료
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const message = {
            user: user.name,  // 실제 사용자 이름을 넣어주세요.
            text: inputValue,
            timestamp: new Date().toLocaleTimeString(),
        };

        // WebSocket을 통해 서버로 메시지 전송
        if (socket) {
            socket.send(JSON.stringify(message));
        }

        setInputValue('');  // 메시지 전송 후 입력창 초기화
    };
    
    return (
        <div className="grid-item Chating">
            <div className="chat-container">
                {/* Sidebar 변경 */}
                <div className="chat-sidebar">
                    {/* <div className="employee-list">
                        <h3>사원 정보</h3>
                        {employees.map((employee) => (
                            <div key={employee.id} className="employee-item">
                                <img
                                    src={employee.profileImage}
                                    alt={`${employee.name}의 프로필`}
                                    className="employee-profile-image"
                                />
                                <div className="employee-details">
                                    <span className="employee-name">{employee.name}</span>
                                    <span className="employee-role">{employee.role}</span>
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>
                
                {/* Main Chat Section */}
                <div className="chat-main">
                    <div className="chat-window">
                        <div className="message-list">
                            {messages
                                // .filter((message) => message.chatType === chatType)
                                .map((message) => (
                                    <div key={message.id} className="message-item">
                                        <span className="message-user">{message.user}:</span>
                                        <span className="message-text">{message.text}</span>
                                        <span className="message-timestamp">{message.timestamp}</span>
                                    </div>
                                ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="메시지를 입력하세요..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
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