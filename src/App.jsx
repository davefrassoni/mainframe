import React, { useState, useEffect } from 'react'
import Terminal from './components/Terminal'
import Login from './components/Login'

function App() {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootMessages, setBootMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userid, setUserid] = useState('');

  useEffect(() => {
    // Check if already logged in from previous session
    const savedUser = localStorage.getItem('mainframe_user');
    if (savedUser) {
      setUserid(savedUser);
      setLoggedIn(true);
      setBootSequence(false);
      return;
    }

    // Simulated z/OS IPL Messages
    const messages = [
      'IEA000I 00, 01, 10, 11 ONLINE',
      'IEA007I STOP/RESET KEY PRESSED',
      'IEA202I ENQ RESOURCES COULD NOT BE RETRIEVED',
      'IEE305I LOGON START 1',
      'IEE306I ALLOCATE   STARTED',
      'IEE202I DISPLAY  OPERATOR',
      'IEF403I JES2     STARTED - TIME=12.00.00',
      'IEF403I TSO      STARTED - TIME=12.00.01',
      'IEA101A SPECIFY SYSTEM PARAMETERS FOR RELEASE 02.04.00',
      'IEE318I SYSTEM INITIALIZATION COMPLETE',
      ' ',
      'z/OS V2.5 MOUNTING ROOT FILESYSTEM...',
      'IST097I DISPLAY  ACCEPTED',
      'IST000I VTAM     START',
      'IST093I VTAM     ACTIVE',
      ' ',
      ' *** WELCOME TO z/OS ***',
      ''
    ];

    let delay = 0;
    messages.forEach((msg, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setBootMessages(prev => [...prev, msg]);
        if (index === messages.length - 1) {
          setTimeout(() => setBootSequence(false), 1500);
        }
      }, delay);
    });
  }, []);

  const handleLogin = (user) => {
    setUserid(user);
    setLoggedIn(true);
    localStorage.setItem('mainframe_user', user);
  };

  const handleLogoff = () => {
    setLoggedIn(false);
    setUserid('');
    localStorage.removeItem('mainframe_user');
  };

  if (bootSequence) {
    return (
      <div className="terminal-container">
        <div className="scanlines"></div>
        {bootMessages.map((msg, i) => (
          <div key={i} className="output-line" style={{ color: msg.includes('ACTION') ? '#ff0000' : 'inherit' }}>{msg}</div>
        ))}
        <div className="cursor-block"></div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <>
        <div className="scanlines"></div>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <div className="scanlines"></div>
      <Terminal userid={userid} onLogoff={handleLogoff} />
    </>
  );
}

export default App
