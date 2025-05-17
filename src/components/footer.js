import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
  <footer>
    <div className="datetimeContainer">
      <div className="dateBlock">
        <img src="/icons/calendar.png" alt="Календарь" className="datetimeIcon" />
        <span>
          {new Date().toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            weekday: 'short'
          })}
        </span>
      </div>
      <div className="timeBlock">
        <img src="/icons/clock.png" alt="Часы" className="datetimeIcon" />
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  </footer>
  );
}