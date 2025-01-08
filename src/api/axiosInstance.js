import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '/',  // 기본 URL 설정
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    
    const accessToken = localStorage.getItem('authToken');
    
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status === 401) {
      // 401 에러 발생 시, 토큰이 만료된 경우
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // refresh token을 사용해 새로운 access token을 요청
        const refreshResponse = await axios.post('/api/token/refresh/', { refresh: refreshToken });

        const newAccessToken = refreshResponse.data.access;
        
        // 새로 발급된 access token을 localStorage에 저장
        localStorage.setItem('authToken', newAccessToken);

        // 요청을 새 access token으로 재시도
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);  // 재요청
      } catch (refreshError) {
        navigate('/login')
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
