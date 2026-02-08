import React, { useState, useEffect, useRef } from 'react';

const Login = ({ onLogin }) => {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [proc, setProc] = useState('IKJACCNT');
    const [acct, setAcct] = useState('ACCT#');
    const [size, setSize] = useState('4096');
    const [focusedField, setFocusedField] = useState('userid');
    const [error, setError] = useState('');

    const useridRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        useridRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (userid && password) {
                if (userid.toUpperCase() === 'IBMUSER' && password.toUpperCase() === 'SYS1') {
                    onLogin(userid.toUpperCase());
                } else {
                    setError('IKJ56420I USERID OR PASSWORD INVALID');
                    setPassword('');
                    setFocusedField('userid');
                    useridRef.current?.focus();
                }
            } else {
                // Move focus
                if (!userid) { setFocusedField('userid'); useridRef.current?.focus(); }
                else if (!password) { setFocusedField('password'); passwordRef.current?.focus(); }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            setFocusedField(prev => prev === 'userid' ? 'password' : 'userid');
        }
    };

    // Effect to manage focus
    useEffect(() => {
        if (focusedField === 'userid') useridRef.current?.focus();
        if (focusedField === 'password') passwordRef.current?.focus();
    }, [focusedField]);

    return (
        <div className="terminal-container" style={{ display: 'block' }}>
            <div className="output-line" style={{ textAlign: 'center', color: 'cyan' }}>
                -------------------------------- TSO/E LOGON ---------------------------------
            </div>
            <div className="output-line"><br /></div>

            <div className="login-form">
                <div className="output-line">
                    ENTER LOGON PARAMETERS BELOW:                   <span style={{ color: 'red' }}>{error}</span>
                </div>
                <div className="output-line"><br /></div>

                <div className="output-line">
                    USERID    ===&gt; <input
                        ref={useridRef}
                        type="text"
                        maxLength={8}
                        value={userid}
                        onChange={e => setUserid(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        className="field-input"
                        onFocus={() => setFocusedField('userid')}
                    />
                </div>

                <div className="output-line">
                    PASSWORD  ===&gt; <input
                        ref={passwordRef}
                        type="password"
                        maxLength={8}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="field-input hidden-text"
                        onFocus={() => setFocusedField('password')}
                    />
                </div>

                <div className="output-line">
                    PROCEDURE ===&gt; <span className="field-static">{proc}</span>
                </div>

                <div className="output-line">
                    ACCT NM   ===&gt; <span className="field-static">{acct}</span>
                </div>

                <div className="output-line">
                    SIZE      ===&gt; <span className="field-static">{size}</span>
                </div>

                <div className="output-line"><br /></div>
                <div className="output-line">
                    COMMAND   ===&gt;
                </div>

                <div className="output-line"><br /></div>
                <div className="output-line" style={{ color: 'yellow' }}>
                    ENTER AN 'S' BEFORE EACH OPTION DESIRED BELOW:
                </div>
                <div className="output-line">
                    - NOMAIL         - NONOTICE        - RECONNECT        - OID
                </div>
            </div>

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">LOGON</span>
                </div>
                <div className="status-right">
                    <span className="status-item">System: Z/OS 2.5</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
