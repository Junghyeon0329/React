const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;  // 기본 URL

const API_URLS = {
  LOGIN: `${API_BASE_URL}/login/`,
  USER: `${API_BASE_URL}/user/`,
  FILE : `${API_BASE_URL}/file/`,
  RESET_PASSWORD: `${API_BASE_URL}/password-reset/`,
  NOTICE : `${API_BASE_URL}/notice/`,
  REFRESH: `${API_BASE_URL}/api/token/refresh/`,
};

export default API_URLS;
