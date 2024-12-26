const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;  // 기본 URL

const API_URLS = {
  LOGIN: `${API_BASE_URL}/login/`,  // 로그인 URL
  REFRESH: `${API_BASE_URL}/api/token/refresh/`,  // refresh 토큰
  USER : `${API_BASE_URL}/user/`,
  RESET_PASSWORD : `${API_BASE_URL}/password-reset/`
};

export default API_URLS;
