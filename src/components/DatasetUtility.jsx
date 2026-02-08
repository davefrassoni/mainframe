import React, { useState, useEffect, useRef } from 'react';
import { writeFile, deletePath, listDir } from '../utils/fileSystem';

const DatasetUtility = ({ onBack }) => {
    const [dsname, setDsname] = useState('');
    const [option, setOption] = useState('');
    const [volser, setVolser] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [resultMessage, setResultMessage] = useState([]);
    const [focusField, setFocusField] = useState('option');

    const optionRef = useRef(null);
    const dsnameRef = useRef(null);
    const volserRef = useRef(null);

    useEffect(() => {
        if (focusField === 'option') optionRef.current?.focus();
        else if (focusField === 'dsname') dsnameRef.current?.focus();
        else if (focusField === 'volser') volserRef.current?.focus();
    }, [focusField]);

    const handleProcess = () => {
        if (!dsname.trim()) {
            alert('Please enter a dataset name');
            setFocusField('dsname');
            return;
        }

        const opt = option.trim().toUpperCase();
        const path = dsname.startsWith('/') ? dsname : `/${dsname}`;

        let messages = [];

        switch (opt) {
            case 'A': // Allocate
                const success = writeFile(path, '');
                if (success) {
                    messages = [
                        'DATASET ALLOCATION SUCCESSFUL',
                        '',
                        `Dataset Name:    ${dsname}`,
                        `Organization:    PS (Physical Sequential)`,
                        `Record Format:   FB (Fixed Blocked)`,
                        `Record Length:   80`,
                        `Block Size:      27920`,
                        `Space Units:     TRACKS`,
                        `Primary Qty:     10`,
                        `Secondary Qty:   5`,
                        `Volume Serial:   ${volser || 'SYS001'}`,
                        '',
                        'Dataset has been allocated and cataloged.'
                    ];
                } else {
                    messages = [
                        'DATASET ALLOCATION FAILED',
                        '',
                        'Possible reasons:',
                        '- Dataset already exists',
                        '- Invalid dataset name',
                        '- Insufficient storage'
                    ];
                }
                break;

            case 'R': // Rename
                messages = [
                    'RENAME FUNCTION',
                    '',
                    'Enter new dataset name:',
                    '',
                    '(This function requires additional input)',
                    'In a full implementation, you would specify:',
                    '- New dataset name',
                    '- Catalog options',
                    '',
                    'Press ENTER to continue'
                ];
                break;

            case 'D': // Delete
                const deleted = deletePath(path);
                if (deleted) {
                    messages = [
                        'DATASET DELETED SUCCESSFULLY',
                        '',
                        `Dataset Name:    ${dsname}`,
                        `Volume Serial:   ${volser || 'SYS001'}`,
                        '',
                        'Dataset has been deleted and uncataloged.',
                        '',
                        'CAUTION: This action cannot be undone.'
                    ];
                } else {
                    messages = [
                        'DATASET DELETE FAILED',
                        '',
                        `Dataset Name:    ${dsname}`,
                        '',
                        'Possible reasons:',
                        '- Dataset not found',
                        '- Dataset in use',
                        '- Insufficient authority'
                    ];
                }
                break;

            case 'C': // Catalog
                messages = [
                    'CATALOG FUNCTION',
                    '',
                    `Dataset Name:    ${dsname}`,
                    `Volume Serial:   ${volser || 'SYS001'}`,
                    '',
                    'Dataset has been cataloged in the master catalog.',
                    '',
                    'Catalog Entry Type: NONVSAM'
                ];
                break;

            case 'U': // Uncatalog
                messages = [
                    'UNCATALOG FUNCTION',
                    '',
                    `Dataset Name:    ${dsname}`,
                    '',
                    'Dataset has been removed from the catalog.',
                    '',
                    'Note: The dataset still exists on the volume.',
                    'Use volume serial to access: ' + (volser || 'SYS001')
                ];
                break;

            case 'I': // Information
                const dirPath = path.substring(0, path.lastIndexOf('/')) || '/';
                const exists = listDir(dirPath) !== null;
                if (exists) {
                    messages = [
                        'DATASET INFORMATION',
                        '',
                        `Dataset Name:        ${dsname}`,
                        `Organization:        PS (Physical Sequential)`,
                        `Record Format:       FB`,
                        `Logical Rec Length:  80`,
                        `Block Size:          27920`,
                        `Volume Serial:       ${volser || 'SYS001'}`,
                        `Device Type:         3390`,
                        `Creation Date:       2024/01/15`,
                        `Expiration Date:     ***None***`,
                        `Catalog Status:      CATALOGED`,
                        `SMS Managed:         NO`,
                        `Data Class:          ***None***`,
                        `Storage Class:       ***None***`,
                        `Management Class:    ***None***`,
                        '',
                        'Space Information:',
                        `  Allocated Tracks:  10`,
                        `  Used Tracks:       2`,
                        `  % Used:            20`
                    ];
                } else {
                    messages = [
                        'DATASET NOT FOUND',
                        '',
                        `Dataset Name:    ${dsname}`,
                        '',
                        'The dataset is not cataloged.',
                        'Specify volume serial if dataset exists.'
                    ];
                }
                break;

            default:
                messages = [
                    'INVALID OPTION',
                    '',
                    'Valid options are:',
                    '  A - Allocate',
                    '  R - Rename',
                    '  D - Delete',
                    '  C - Catalog',
                    '  U - Uncatalog',
                    '  I - Information',
                    '',
                    'Press ENTER to continue'
                ];
        }

        setResultMessage(messages);
        setShowResult(true);
    };

    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            if (showResult) {
                // Return to main form
                setShowResult(false);
                setResultMessage([]);
                setDsname('');
                setOption('');
                setVolser('');
                setFocusField('option');
                return;
            }

            // Tab through fields or process
            if (field === 'option' && option.trim()) {
                setFocusField('dsname');
            } else if (field === 'dsname' && dsname.trim()) {
                // Process the request
                handleProcess();
            } else if (field === 'volser') {
                handleProcess();
            }
        } else if (e.key === 'Escape' || e.key === 'F3') {
            if (showResult) {
                setShowResult(false);
                setResultMessage([]);
                setDsname('');
                setOption('');
                setVolser('');
                setFocusField('option');
            } else {
                onBack();
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (field === 'option') setFocusField('dsname');
            else if (field === 'dsname') setFocusField('volser');
            else if (field === 'volser') setFocusField('option');
        }
    };

    if (showResult) {
        return (
            <div className="terminal-container ispf-panel">
                <div className="output-line" style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                    --------------------------- DATASET UTILITY - RESULT ---------------------------
                </div>
                <div className="output-line"><br /></div>

                {resultMessage.map((line, i) => (
                    <div key={i} className="output-line">{line}</div>
                ))}

                <div className="output-line"><br /></div>
                <div className="output-line">Press ENTER to continue, F3 to exit</div>

                <input
                    ref={optionRef}
                    type="text"
                    className="real-input"
                    onKeyDown={(e) => handleKeyDown(e, 'result')}
                    autoFocus
                />

                <div className="status-bar">
                    <div className="status-left">
                        <span className="status-item">DATASET UTILITY</span>
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
                ---------------------------- DATASET UTILITY ----------------------------------
            </div>
            <div className="output-line"><br /></div>

            <div className="output-line">
                OPTION  ===&gt; <input
                    ref={optionRef}
                    type="text"
                    maxLength={1}
                    value={option}
                    onChange={e => setOption(e.target.value.toUpperCase())}
                    onKeyDown={(e) => handleKeyDown(e, 'option')}
                    className="field-input"
                    style={{ width: '3ch' }}
                />
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">   A  - Allocate new data set</div>
            <div className="output-line">   R  - Rename entire data set</div>
            <div className="output-line">   D  - Delete entire data set</div>
            <div className="output-line">   C  - Catalog data set</div>
            <div className="output-line">   U  - Uncatalog data set</div>
            <div className="output-line">   I  - Data set information</div>

            <div className="output-line"><br /></div>
            <div className="output-line">ISPF LIBRARY:</div>
            <div className="output-line">
                PROJECT  ===&gt;
            </div>
            <div className="output-line">
                GROUP    ===&gt;
            </div>
            <div className="output-line">
                TYPE     ===&gt;
            </div>
            <div className="output-line">
                MEMBER   ===&gt;            (If option "C" or "I" is selected)
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">OTHER PARTITIONED, SEQUENTIAL OR VSAM DATA SET:</div>
            <div className="output-line">
                DATA SET NAME  ===&gt; <input
                    ref={dsnameRef}
                    type="text"
                    maxLength={44}
                    value={dsname}
                    onChange={e => setDsname(e.target.value.toUpperCase())}
                    onKeyDown={(e) => handleKeyDown(e, 'dsname')}
                    className="field-input"
                    style={{ width: '30ch' }}
                    placeholder="USER/ADMIN/filename"
                />
            </div>
            <div className="output-line">
                VOLUME SERIAL  ===&gt; <input
                    ref={volserRef}
                    type="text"
                    maxLength={6}
                    value={volser}
                    onChange={e => setVolser(e.target.value.toUpperCase())}
                    onKeyDown={(e) => handleKeyDown(e, 'volser')}
                    className="field-input"
                    style={{ width: '8ch' }}
                    placeholder="SYS001"
                />   (If not cataloged)
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">
                Press ENTER to process, TAB to move between fields, F3 or ESC to return
            </div>

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">DATASET UTILITY</span>
                </div>
                <div className="status-right">
                    <span className="status-item">ISPF 7.5</span>
                </div>
            </div>
        </div>
    );
};

export default DatasetUtility;
