// src/services/authService.js
import axios from 'axios';
import API_URLS from './api'; // API URL을 이곳에서 가져옵니다.

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  try {
    const response = await axios.post(API_URLS.REFRESH, { refresh: refreshToken });
    const { access } = response.data;
    if (access) {
      localStorage.setItem('access_token', access);
    }
    return access;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

export { refreshToken };
