import './MainPage.css';
import React from 'react';
import Login from './Login';
import Announce from './Announce';
import Chating from './Chating'
import Calendar from './Calendar';
import DownloadPaper from './DownloadPaper';
import ClockTimer from './ClockTimer';
import ErrorBoundary from '../ErrorBoundary';

function MainPage() {
  return (
    <div className="Page-Container">
      <header className="Header">
        <h1>One-Que</h1>
      </header>

      <ErrorBoundary>
        <div className="grid-container">
            <Announce />
            <Login />
            <Chating />
            <Calendar />
            <DownloadPaper />
            <ClockTimer />
            
        </div>
      </ErrorBoundary>

      <footer className="Footer">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}

export default MainPage;
