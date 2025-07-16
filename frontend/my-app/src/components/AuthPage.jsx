import React, { useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import styles from './AuthPage.module.css';

function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  // 로그인 성공 시 URL 정리 및 UI 표시
  useEffect(() => {
    // URL에서 토큰 관련 파라미터를 제거하는 함수
    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    };

    if (auth.isAuthenticated) {
      cleanUrl();
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading) {
    return (
      <Container className={`${styles.container} ${styles.loadingCard} bg-light`}>
        <p>Loading...</p>
      </Container>
    );
  }

  if (auth.error) {
    return (
      <Container className={`${styles.container} ${styles.errorCard} bg-light text-danger`}>
        <p>Error: {auth.error.message}</p>
        <Button variant="danger" onClick={() => auth.signinRedirect()}>
          다시 로그인
        </Button>
      </Container>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <Container className={`${styles.container} ${styles.successCard} bg-success-subtle`}>
        <Card className={`${styles.card} text-center p-4 shadow-lg`}>
          <Card.Body>
            <Card.Title as="h1" className="text-success mb-3">로그인 성공!</Card.Title>
            <Card.Text className="fs-4 mb-4">
              환영합니다, <strong>{auth.user?.profile.email}</strong>님!
            </Card.Text>
            <Button variant="primary" size="lg" onClick={() => navigate('/home')}>
              홈으로 이동
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className={`${styles.container} bg-light`}>
      <Card className={`${styles.card} text-center p-4 shadow-lg`}>
        <Card.Body>
          <Card.Title as="h1" className="text-primary mb-3">서비스에 오신 것을 환영합니다!</Card.Title>
          <Card.Text className="fs-5 mb-4">로그인하여 모든 기능을 이용해보세요.</Card.Text>
          <Button variant="primary" size="lg" onClick={() => auth.signinRedirect()}>
            로그인
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuthPage;