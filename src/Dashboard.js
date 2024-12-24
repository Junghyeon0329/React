import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 토큰이 없으면 로그인 페이지로 리디렉션
    if (!token) {
      navigate('/login');
    } else {
      // 토큰을 사용하여 유저 정보나 보호된 데이터를 불러올 수 있음
      // 예시: API에서 유저 정보를 받아오는 로직
      fetch('http://localhost:8000/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(err => {
          console.error('Error fetching protected data', err);
          navigate('/login');
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.name}</p> : <p>Loading...</p>}
    </div>
  );
}

export default Dashboard;
