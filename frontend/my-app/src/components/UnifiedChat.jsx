import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, InputGroup, Button, Card } from 'react-bootstrap';
import styles from './UnifiedChat.module.css';
import beopkaLogo from '../assets/beopka1.png';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

function UnifiedChat({ setRecommendedPlaces, closeChat }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e, keyword) => {
    if (e) e.preventDefault();
    const messageToSend = keyword || inputMessage;
    if (messageToSend.trim() === '') return;

    const newMessage = { sender: 'user', text: messageToSend };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (!keyword) setInputMessage('');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: messageToSend }),
      });

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data) && data.length > 0) {
          const botMessage = {
            sender: 'bot',
            type: 'recommendations',
            payload: data,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          setRecommendedPlaces(data);
        } else {
          const botMessage = { sender: 'bot', text: data.message || '추천할 만한 장소를 찾지 못했습니다.' };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } else {
        const botMessage = { sender: 'bot', text: `서버 오류: ${data.message || '알 수 없는 오류'}` };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      const botMessage = { sender: 'bot', text: `네트워크 오류: ${error.message}` };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    if (restaurant.상세보기URL) {
      window.open(restaurant.상세보기URL, '_blank');
    } else {
      const searchQuery = restaurant.주소?.replace(/\s*\(우\)\s*\d{5}$/, '').replace(/\s+\d{5}$/, '') || restaurant.가게이름;
      const kakaoMapUrl = `https://map.kakao.com/link/search/${searchQuery}`;
      window.open(kakaoMapUrl, '_blank');
    }
  };

  const handleKeywordClick = (keyword) => {
    setInputMessage(keyword);
  };

  const formatAddress = (address) => {
    if (!address) return '주소 정보 없음';
    return address.replace(/\s*\(우\)\s*\d{5}$/, '').replace(/\s+\d{5}$/, '');
  };

  const popularKeywords = [
    '강남구 한식', '강남구 양식', '강서구 한식', '강동구 회식장소', '동대문구', '한식', '분식', '중국식', '경양식', '일식', '식육(숯불구이)', '통닭(치킨)', '호프/통닭',
  ];

  return (
    <Container className={styles.chatContainer} style={{height: '100%'}}>
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
        <img src={beopkaLogo} alt="Beopka Flex Logo" style={{ height: '40px' }} />
        <Button variant="light" size="sm" onClick={closeChat}>X</Button>
      </div>

      <div className={styles.messagesDisplay}>
        {messages.length === 0 && (
            <div className="text-center p-3">
                <p className="text-muted">"강남역 맛집" 또는 "회식 장소 추천"과 같이 질문해보세요!</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.messageBubble} ${styles[msg.sender]}`}>
            {msg.type === 'recommendations' ? (
              <div>
                <p>다음 식당들을 추천합니다:</p>
                {msg.payload.map((restaurant, idx) => (
                  <Card key={idx} className="mb-2" onClick={() => handleRestaurantClick(restaurant)} style={{ cursor: 'pointer' }}>
                    {restaurant.가게이미지URL && (
                      <Card.Img variant="top" src={restaurant.가게이미지URL} style={{ maxHeight: '180px', objectFit: 'cover' }} />
                    )}
                    <Card.Body>
                      <Card.Title>{restaurant.가게이름}</Card.Title>
                      <Card.Text as="div">
                        <strong>업태:</strong> {restaurant.업태}<br/>
                        <strong>주소:</strong> {formatAddress(restaurant.주소)}<br/>
                        <strong>평점:</strong> {restaurant.평점 || 'N/A'}<br/>
                        {restaurant.리뷰요약 && <p><strong>리뷰요약:</strong> {restaurant.리뷰요약}</p>}
                        {restaurant.리뷰키워드 && restaurant.리뷰키워드.length > 0 && (
                          <div>
                            <strong>키워드:</strong>
                            {restaurant.리뷰키워드.map((keyword, kw_idx) => (
                              <Button
                                key={kw_idx}
                                variant="outline-secondary"
                                size="sm"
                                className="ms-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleKeywordClick(keyword);
                                }}
                              >
                                #{keyword}
                              </Button>
                            ))}
                          </div>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.keywordSuggestionContainer}>
        <p className={styles.keywordSuggestionTitle}>추천 키워드</p>
        {popularKeywords.map((keyword, index) => (
          <Button
            key={index}
            size="sm"
            className={`${styles.keywordButton} ${styles.keywordButtonCommon}`}
            onClick={() => handleSendMessage(null, keyword)}
          >
            {keyword}
          </Button>
        ))}
      </div>
      <Form onSubmit={handleSendMessage} className={styles.messageInputForm}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="예: 마포구 한식"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={styles.messageInput}
          />
          <Button variant="primary" type="submit">
            전송
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
}

export default UnifiedChat;