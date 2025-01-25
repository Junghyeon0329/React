import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import './Chating.css';

function Chat() {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);
    const [chatType, setChatType] = useState('all'); // "all", "team", or "direct"

    useEffect(() => {
        if (!user) return;

        // WebSocket 연결 설정
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('WebSocket 연결이 열렸습니다.');
        };

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        ws.onclose = () => {
            console.log('WebSocket 연결이 닫혔습니다.');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [user]);

    const handleSendMessage = () => {
        if (!user) {
            alert('로그인 후 사용 가능한 기능입니다.');
            return;
        }

        if (inputValue.trim() === '') {
            return;
        }

        const newMessage = {
            id: Date.now(),
            user: user.name,
            text: inputValue,
            timestamp: new Date().toLocaleTimeString(),
            chatType: chatType, // 현재 채팅 타입 추가
        };

        // WebSocket을 통해 메시지 전송
        if (socket) {
            socket.send(JSON.stringify(newMessage));
        }

        setInputValue('');
    };

    const handleChatTypeChange = (type) => {
        setChatType(type);
        setMessages([]); // 채팅 유형 변경 시 메시지 초기화
    };

    return (
        <div className="grid-item Chating">
            <div className="chat-container">
                <div className="chat-sidebar">
                    <button
                        className={`chat-type-button ${chatType === 'all' ? 'active' : ''}`}
                        onClick={() => handleChatTypeChange('all')}
                    >
                        전체 채팅
                    </button>
                    <button
                        className={`chat-type-button ${chatType === 'team' ? 'active' : ''}`}
                        onClick={() => handleChatTypeChange('team')}
                    >
                        팀 채팅
                    </button>
                    <button
                        className={`chat-type-button ${chatType === 'direct' ? 'active' : ''}`}
                        onClick={() => handleChatTypeChange('direct')}
                    >
                        특정인 채팅
                    </button>
                </div>
                <div className="chat-main">
                    <div className="chat-window">
                        <div className="message-list">
                            {messages
                                .filter((message) => message.chatType === chatType)
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