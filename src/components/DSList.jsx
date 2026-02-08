import React, { useState, useEffect, useRef } from 'react';
import { listDir } from '../utils/fileSystem';

const DSList = ({ onBack }) => {
    const [dsname, setDsname] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!showResults) {
                // Search for datasets
                const pattern = dsname.trim() || '*';
                const searchPath = pattern.startsWith('/') ? pattern : `/${pattern}`;

                // Search in common locations
                const paths = ['/', '/USER', '/USER/ADMIN', '/SYS1'];
                let found = [];

                paths.forEach(path => {
                    const files = listDir(path);
                    if (files) {
                        files.forEach(f => {
                            const fullPath = path === '/' ? `/${f.name}` : `${path}/${f.name}`;
                            if (pattern === '*' || f.name.includes(pattern.replace('*', ''))) {
                                found.push({
                                    name: fullPath,
                                    type: f.type === 'dir' ? 'PDS' : 'PS',
                                    volser: 'SYS001',
                                    device: '3390'
                                });
                            }
                        });
                    }
                });

                setResults(found);
                setShowResults(true);
            } else {
                // Back to search
                setShowResults(false);
                setDsname('');
                setResults([]);
            }
        } else if (e.key === 'Escape' || (e.key === 'F3')) {
            onBack();
        }
    };

    if (showResults) {
        return (
            <div className="terminal-container ispf-panel">
                <div className="output-line" style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                    --------------------------- DSLIST - DATASET LIST UTILITY -------------------------
                </div>
                <div className="output-line"><br /></div>

                <div className="output-line">COMMAND ===&gt;</div>
                <div className="output-line"><br /></div>

                <div className="output-line" style={{ borderBottom: '1px solid' }}>
                    NAME                                          TYPE    VOLSER   DEVICE
                </div>

                {results.length === 0 ? (
                    <div className="output-line">NO DATASETS FOUND</div>
                ) : (
                    results.map((ds, i) => (
                        <div key={i} className="output-line">
                            {ds.name.padEnd(45)} {ds.type.padEnd(7)} {ds.volser.padEnd(8)} {ds.device}
                        </div>
                    ))
                )}

                <div className="output-line"><br /></div>
                <div className="output-line">
                    {results.length} DATASET(S) FOUND - Press ENTER to return, F3 to exit
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    className="real-input"
                    onKeyDown={handleKeyDown}
                    autoFocus
                />

                <div className="status-bar">
                    <div className="status-left">
                        <span className="status-item">DSLIST</span>
                    </div>
                    <div className="status-right">
                        <span className="status-item">ISPF 7.5</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="terminal-container ispf-panel">
            <div className="output-line" style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                --------------------------- DSLIST - DATASET LIST UTILITY -------------------------
            </div>
            <div className="output-line"><br /></div>

            <div className="output-line">
                Enter dataset name pattern (use * for wildcard):
            </div>
            <div className="output-line"><br /></div>

            <div className="output-line">
                DSNAME LEVEL ===&gt; <input
                    ref={inputRef}
                    type="text"
                    maxLength={44}
                    value={dsname}
                    onChange={e => setDsname(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    className="field-input"
                    style={{ width: '30ch' }}
                />
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">VOLUME SERIAL ===&gt; <span className="field-static">*</span></div>
            <div className="output-line"><br /></div>

            <div className="output-line">OPTIONS:</div>
            <div className="output-line">  Blank - Display dataset list</div>
            <div className="output-line">  V     - Display VTOC information</div>
            <div className="output-line">  S     - Display SMS information</div>

            <div className="output-line"><br /></div>
            <div className="output-line">
                Press ENTER to search, F3 or ESC to return
            </div>

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">DSLIST</span>
                </div>
                <div className="status-right">
                    <span className="status-item">ISPF 7.5</span>
                </div>
            </div>
        </div>
    );
};

export default DSList;
