
import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import chatbotIcon from '../assets/Card.png';
import { ArrowUpCircleFill } from 'react-bootstrap-icons'; // 화살표 아이콘 추가

const Chatbot = ({ isOpen, setIsOpen, onStructuredDataReceived, recommendedPlaces }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const chatBodyRef = useRef(null); // chat-body에 대한 ref 생성
    const initialOpenRef = useRef(true); // Tracks if the very first open has occurred
    const [hasInteracted, setHasInteracted] = useState(false); // New state to track if first interaction happened

    // 메시지가 업데이트될 때마다 스크롤을 최하단으로 이동
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    // Set initialOpenRef to false after the first open has been rendered
    useEffect(() => {
        if (isOpen && initialOpenRef.current) {
            initialOpenRef.current = false;
            console.log("initialOpenRef set to false. isOpen:", isOpen);
        }
    }, [isOpen]); // Only depend on isOpen

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLocationLoading(false);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    setLocationLoading(false);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
            setLocationLoading(false);
        }
    }, []);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const userMessage = { text: inputValue, sender: 'user' };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');

        const apiEndpoint = 'https://fetmcaywjl.execute-api.us-east-1.amazonaws.com/default/orchestrator_lambda';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    location: location,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setHasInteracted(true); // Set hasInteracted to true after successful response

            if (data.type === 'places_recommendation' || data.type === 'review_analysis_result') {
                if (onStructuredDataReceived) {
                    onStructuredDataReceived(data);
                }
                setMessages(prev => [...prev, { text: data.content || '요청하신 정보를 화면에 표시했습니다.', sender: 'bot' }]);
            } else {
                setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
            }

        } catch (error) {
            console.error('Error fetching data from Bedrock:', error);
            const errorResponse = { text: '죄송합니다, 답변을 가져오는 중 오류가 발생했습니다.', sender: 'bot' };
            setMessages(prev => [...prev, errorResponse]);
        }
    };

    // 동적으로 컨테이너 클래스 결정
    const getContainerClassName = () => {
        let className;
        if (!isOpen) {
            if (initialOpenRef.current) { // If it's closed and hasn't been opened yet
                className = 'chatbot-initial-center'; // Initial state: large character in center
            } else {
                className = 'chatbot-closed-bottom-center'; // Subsequent closed state: small icon at bottom center
            }
        } else { // isOpen is true
            if (!hasInteracted) { // If it's open, but no interaction has happened yet
                className = 'chatbot-first-open-center'; // First open: chat window in center
            } else {
                className = 'chatbot-container-bottom-right'; // Subsequent opens: chat window at bottom right
            }
        }
        console.log(`getContainerClassName: isOpen=${isOpen}, initialOpenRef.current=${initialOpenRef.current}, hasInteracted=${hasInteracted}, className=${className}`);
        return className;
    };

    // Render based on isOpen and initialOpenRef.current
    if (!isOpen) {
        if (initialOpenRef.current) {
            // Initial state: large character in center
            return (
                <div className={getContainerClassName()} onClick={() => {
                    console.log("Character clicked! Attempting to open chatbot.");
                    setIsOpen(true);
                    // initialOpenRef.current will be set to false in the useEffect after this render
                }}>
                    <img src={chatbotIcon} alt="Start Chat" className="chatbot-character-image-large" />
                    <p className="chatbot-prompt-text-large">무엇을 도와드릴까요?</p>
                    <p className="chatbot-prompt-text-small">캐릭터를 클릭해서 대화를 시작하세요!</p>
                </div>
            );
        } else {
            // Subsequent closed state: small icon at bottom center
            return (
                <div className={getContainerClassName()} onClick={() => setIsOpen(true)}>
                    <div className="chatbot-closed-content">
                        <img src={chatbotIcon} alt="Chatbot Icon" className="chatbot-closed-image" />
                        <ArrowUpCircleFill className="chatbot-open-button" />
                    </div>
                </div>
            );
        }
    }

    // Chatbot is open: render chat window
    return (
        <div className={getContainerClassName()}>
            <div className="chat-window open">
                <div className="chat-header">
                    <span>챗봇</span>
                    <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
                </div>
                <div className="chat-body" ref={chatBodyRef}> {/* ref 연결 */}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="메시지를 입력하세요..."
                    />
                    <button onClick={handleSendMessage} className="chat-send-btn">전송</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
