import React, { useState, useEffect, useRef } from 'react';
import { readFile, listDir } from '../utils/fileSystem';

const ISPFView = ({ onBack }) => {
    const [dsname, setDsname] = useState('');
    const [viewing, setViewing] = useState(false);
    const [content, setContent] = useState('');
    const [currentFile, setCurrentFile] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!viewing) {
                // Try to view the file
                const path = dsname.startsWith('/') ? dsname : `/${dsname}`;
                const fileContent = readFile(path);

                if (fileContent !== null) {
                    setContent(fileContent);
                    setCurrentFile(dsname);
                    setViewing(true);
                } else {
                    alert(`DATASET NOT FOUND: ${dsname}`);
                }
            }
        } else if (e.key === 'Escape' || e.key === 'F3') {
            if (viewing) {
                setViewing(false);
                setContent('');
                setCurrentFile('');
                setDsname('');
            } else {
                onBack();
            }
        }
    };

    if (viewing) {
        const lines = content.split('\n');
        return (
            <div className="terminal-container ispf-panel">
                <div className="output-line" style={{ borderBottom: '1px solid' }}>
                    VIEW      {currentFile.padEnd(50)} LINE 1 COL 1
                </div>
                <div className="output-line">COMMAND ===&gt;</div>
                <div className="output-line" style={{ borderTop: '1px solid', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                    ****** ***************************** TOP OF DATA ******************************
                </div>

                {lines.map((line, i) => (
                    <div key={i} className="output-line">
                        {String(i + 1).padStart(6, '0')}  {line}
                    </div>
                ))}

                <div className="output-line">
                    ****** **************************** BOTTOM OF DATA ****************************
                </div>

                <div className="output-line"><br /></div>
                <div className="output-line">Press F3 or ESC to return</div>

                <input
                    ref={inputRef}
                    type="text"
                    className="real-input"
                    onKeyDown={handleKeyDown}
                    autoFocus
                />

                <div className="status-bar">
                    <div className="status-left">
                        <span className="status-item">VIEW</span>
                        <span className="status-item">{currentFile}</span>
                    </div>
                    <div className="status-right">
                        <span className="status-item">COLS 1-80</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="terminal-container ispf-panel">
            <div className="output-line" style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                --------------------------------- ISPF VIEW -----------------------------------
            </div>
            <div className="output-line"><br /></div>

            <div className="output-line">
                Enter dataset name to view:
            </div>
            <div className="output-line"><br /></div>

            <div className="output-line">
                ISPF LIBRARY:
            </div>
            <div className="output-line">
                PROJECT ===&gt; <input
                    ref={inputRef}
                    type="text"
                    maxLength={44}
                    value={dsname}
                    onChange={e => setDsname(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="field-input"
                    style={{ width: '30ch' }}
                    placeholder="USER/ADMIN/filename"
                />
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">OTHER PARTITIONED OR SEQUENTIAL DATA SET:</div>
            <div className="output-line">
                DATA SET NAME ===&gt;
            </div>
            <div className="output-line">
                VOLUME SERIAL  ===&gt; <span className="field-static">(If not cataloged)</span>
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">DATA SET PASSWORD ===&gt; <span className="field-static">(If password protected)</span></div>

            <div className="output-line"><br /></div>
            <div className="output-line">MIXED MODE     ===&gt; <span className="field-static">NO</span>    (YES or NO)</div>
            <div className="output-line">FORMAT NAME    ===&gt;</div>

            <div className="output-line"><br /></div>
            <div className="output-line">
                Press ENTER to view, F3 or ESC to return
            </div>

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">VIEW ENTRY</span>
                </div>
                <div className="status-right">
                    <span className="status-item">ISPF 7.5</span>
                </div>
            </div>
        </div>
    );
};

export default ISPFView;
