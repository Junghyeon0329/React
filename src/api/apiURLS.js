const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;  // 기본 URL

const API_URLS = {
  LOGIN: `${API_BASE_URL}/login/`,
  USER: `${API_BASE_URL}/user/`,
  // RESET_PASSWORD: `${API_BASE_URL}/password-reset/`,
  NOTICE : `${API_BASE_URL}/notice/`,
  // REFRESH: `${API_BASE_URL}/api/token/refresh/`,
  CHAT: `${API_BASE_URL}/chat/`,
};

export default API_URLS;
