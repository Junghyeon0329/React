import React from 'react';
import Announce from './Announce';
import Login from './Login';
import Chating from './Chating'
import Calendar from './Calendar';
import DownloadPaper from './DownloadPaper';
import ClockTimer from './ClockTimer';
import ErrorBoundary from '../ErrorBoundary';
import './MainPage.css';

function MainPage() {
  return (
    <div className="Page-Container">
      <header className="Header">
        <h1>One-Que</h1>
      </header>

      <ErrorBoundary>
        <Announce />
        <Login />
        <Chating />
        <Calendar />
        <DownloadPaper />
        <ClockTimer />
      </ErrorBoundary>

      <footer className="Footer">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}

export default MainPage;
