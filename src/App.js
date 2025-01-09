import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; 
import MainPage from './components/MainPage/MainPage'; 
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
