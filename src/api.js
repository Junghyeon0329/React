
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;  // 기본 URL

const API_URLS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REFRESH: `${API_BASE_URL}/api/token/refresh/`,
  USER: `${API_BASE_URL}/user/`,
  RESET_PASSWORD: `${API_BASE_URL}/password-reset/`,
  
  // BOARD: `${API_BASE_URL}/board/`,
  // CREATE_POST: `${API_BASE_URL}/board/create/`,
  // DELETE_POST: `${API_BASE_URL}/board/delete/`,  
  // CHAT: `${API_BASE_URL}/chat/`,
  // SEND_MESSAGE: `${API_BASE_URL}/chat/send/`
};

export default API_URLS;
