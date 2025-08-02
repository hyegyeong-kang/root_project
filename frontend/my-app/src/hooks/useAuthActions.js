import { useAuth } from "react-oidc-context";

const useAuthActions = () => {
  const auth = useAuth();

  const handleSignOut = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_USER_POOL_DOMAIN; // User Pool 도메인 사용
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    auth.removeUser(); // 로컬 세션에서도 사용자 정보 제거
  };

  return { handleSignOut };
};

export default useAuthActions;