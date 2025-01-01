import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; 
import MainPage from './components/MainPage/MainPage'; 


// import Login from './components/Login/Login'; 
// import PasswordResetForm from './components/PasswordReset/PasswordReset';
// import MainPage from './components/MainPage/MainPage'; 
// import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <UserProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" />} /> */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:uid/:token" element={<PasswordResetForm />} />
            <Route
              path="/main"
              element={ 
                <ProtectedRoute> <MainPage /> </ProtectedRoute>
              }
            /> */}

            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
