import './MainPage.css';
import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import Login from './Login';
import Announce from './Announce';

function MainPage() {
    const [state, setState] = useState({
        email: '', 
        password: '',
        error: '', 
        showSignUp: false,
        signUpEmail: '', 
        signUpPassword: '', 
        showResetPassword: false, 
        resetEmail: '', 
    });

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="Page-Container">
            <header className="Header">
                <h1>One-Que</h1>
            </header>
            <div className="grid-container">
                <Login />
                <Announce />
            </div>
            <footer className="Footer">
                <p>Footer Content</p>
            </footer>
        </div>
    );
}

export default MainPage;
