import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import styles from './UnifiedChat.module.css';
import beopkaLogo from '../assets/beopka1.png';
import ReactMarkdown from 'react-markdown';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

function UnifiedChat({ closeChat }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [fullTypingText, setFullTypingText] = useState('');

  const [state, setState] = useState({
    step: 'ask_location_method',
    location: null,
    food_type: null,
    ambience: null,
    use_current_location: false,
    latitude: null,
    longitude: null,
  });

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    if (!fullTypingText) return;

    let index = 0;
    setTypingMessage('');

    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + fullTypingText[index]);
      index++;
      if (index >= fullTypingText.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { sender: 'bot', text: fullTypingText }]);
        setTypingMessage('');
        setFullTypingText('');
        setIsLoading(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [fullTypingText]);

  const handleLocationMethodSelection = (useCurrentLocation) => {
    setState((prev) => ({ ...prev, use_current_location: useCurrentLocation, step: 'location_input' }));
    if (useCurrentLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setState((prev) => ({
              ...prev,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }));
            appendBotMessage('현재 위치를 확인했어요! 어떤 종류의 음식을 원하시나요?');
          },
          (err) => {
            appendBotMessage('위치 권한을 허용하지 않으셨습니다. 직접 지역명을 입력해주세요.');
          }
        );
      } else {
        appendBotMessage('현재 위치 기능을 지원하지 않는 브라우저입니다. 직접 지역명을 입력해주세요.');
      }
    } else {
      appendBotMessage('지역명을 입력해주세요. 예) 강남역, 종로구');
    }
  };

  const appendBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: 'bot', text }]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMsg = inputMessage.trim();
    if (!trimmedMsg || isLoading || fullTypingText) return;

    if (state.step === 'ask_location_method') {
      appendBotMessage('먼저 위치 검색 방식을 선택해주세요.');
      setInputMessage('');
      return;
    }

    setMessages((prev) => [...prev, { sender: 'user', text: trimmedMsg }]);
    setInputMessage('');
    setIsLoading(true);

    if (state.use_current_location && state.latitude && state.longitude) {
      await callApi(trimmedMsg, state.latitude, state.longitude, true);
    } else {
      await callApi(trimmedMsg, null, null, false);
    }
  };

  const callApi = async (query, latitude = null, longitude = null, useCurrentLocation = false) => {
    try {
      const body = {
        query,
        state: {
          ...state,
          use_current_location: useCurrentLocation,
          latitude,
          longitude,
        },
        last_location: state.location,
        last_food_type: state.food_type,
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('[서버 응답]', data);

      let botText = '죄송합니다. 오류가 발생했습니다.';

      if (response.ok) {
        if (data.body) {
          try {
            const parsedBody = JSON.parse(data.body);
            botText = parsedBody.message || botText;
            if (parsedBody.state) {
              setState(parsedBody.state);
            }
          } catch (e) {
            console.error('body JSON 파싱 오류', e);
          }
        } else {
          botText = data.message || botText;
          if (data.state) {
            setState(data.state);
          }
        }
      } else {
        botText = data.message || `서버 오류: ${response.status}`;
      }

      botText = botText.replace(/\\n/g, '\n');
      setFullTypingText(botText);
    } catch (error) {
      console.error('[네트워크 오류]', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: `네트워크 오류: ${error.message}` }]);
      setIsLoading(false);
    }
  };

  const [showLocationMethodModal, setShowLocationMethodModal] = useState(true);
  const onModalSelect = (useCurrentLoc) => {
    setShowLocationMethodModal(false);
    handleLocationMethodSelection(useCurrentLoc);
  };

  return (
    <Container className={styles.chatContainer}>
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
        <img src={beopkaLogo} alt="Beopka Flex Logo" style={{ height: '40px' }} />
        <Button variant="light" size="sm" onClick={closeChat}>X</Button>
      </div>

      <div className={styles.messagesDisplay}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.messageBubble} ${styles[msg.sender]}`}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                p: ({ node, ...props }) => <p style={{ marginBottom: '0.2em' }} {...props} />,
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
        {typingMessage && (
          <div className={`${styles.messageBubble} ${styles.bot}`}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                p: ({ node, ...props }) => <p style={{ marginBottom: '0.2em' }} {...props} />,
              }}
            >
              {typingMessage}
            </ReactMarkdown>
          </div>
        )}
        {isLoading && !typingMessage && (
          <div className={`${styles.messageBubble} ${styles.bot}`}>
            <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <Modal show={showLocationMethodModal} onHide={() => setShowLocationMethodModal(false)} centered style={{ zIndex: 9999 }}>
        <Modal.Header closeButton>
          <Modal.Title>위치 검색 방식 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>회식 장소 검색 시 위치 기반으로 찾으시겠습니까?</p>
          <div className="d-flex justify-content-around mt-3">
            <Button variant="primary" onClick={() => onModalSelect(true)}>현재 위치로 검색</Button>
            <Button variant="secondary" onClick={() => onModalSelect(false)}>지역 직접 입력</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Form onSubmit={handleSendMessage} className={styles.messageInputForm}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={
              state.step === 'ask_location_method'
                ? '위치 검색 방식을 선택해주세요'
                : '질문을 입력하세요...'
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={styles.messageInput}
            disabled={isLoading || !!fullTypingText || state.step === 'ask_location_method'}
            autoFocus={state.step !== 'ask_location_method'}
          />
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || !!fullTypingText || state.step === 'ask_location_method'}
          >
            {isLoading ? '답변 생성 중...' : '전송'}
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
}

export default UnifiedChat;
