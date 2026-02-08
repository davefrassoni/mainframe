import React, { useState, useEffect, useRef } from 'react';
import DSList from './DSList';
import DatasetUtility from './DatasetUtility';

const ISPFUtilities = ({ onBack }) => {
    const [option, setOption] = useState('');
    const [currentPanel, setCurrentPanel] = useState('main');
    const inputRef = useRef(null);

    useEffect(() => {
        if (currentPanel === 'main') {
            inputRef.current?.focus();
        }
    }, [currentPanel]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const opt = option.trim().toUpperCase();

            if (opt === 'X' || opt === '=X') {
                onBack();
            } else if (opt === '1') {
                alert('LIBRARY UTILITY\n\nFunctions:\n- Compress PDS\n- Print members\n- Rename members\n- Delete members\n- Browse members\n\nEnter dataset name and select function.');
            } else if (opt === '2') {
                setCurrentPanel('dataset');
                setOption('');
                return;
            } else if (opt === '3') {
                alert('MOVE/COPY UTILITY\n\nFunctions:\n- Copy datasets\n- Move datasets\n- Copy members\n- Move members\n- Promote members\n\nSpecify source and target datasets.');
            } else if (opt === '4') {
                setCurrentPanel('dslist');
                setOption('');
                return;
            } else if (opt === '5') {
                alert('RESET STATISTICS\n\nReset ISPF statistics for library members:\n- Creation date\n- Modification date\n- Version number\n- Modification level\n- User ID\n\nEnter library name to reset.');
            } else if (opt === '6') {
                alert('HARDCOPY UTILITY\n\nPrint datasets to:\n- Local printer\n- Network printer\n- Held output queue\n\nSpecify dataset and printer destination.');
            } else if (opt === '8') {
                alert('OUTLIST UTILITY\n\nManage held job output:\n- Display output\n- Print output\n- Delete output\n- Purge output\n\nEnter job name or job ID.');
            } else if (opt === '9') {
                alert('COMMAND TABLE UTILITY\n\nCreate/modify application command tables:\n- Add commands\n- Change commands\n- Delete commands\n- Display commands\n\nEnter command table name.');
            } else if (opt === '10') {
                alert('RESERVED\n\nThis option is reserved for future IBM use.');
            } else if (opt === '11') {
                alert('FORMAT UTILITY\n\nDefine formats for Edit/Browse:\n- Create format definitions\n- Modify format definitions\n- Delete format definitions\n\nEnter format name.');
            } else if (opt === '12') {
                alert('SUPERC - COMPARE UTILITY\n\nCompare datasets or members:\n- Line-by-line comparison\n- Show differences\n- Generate update deck\n\nSpecify OLD and NEW datasets.');
            } else if (opt === '13') {
                alert('SUPERCE - EXTENDED COMPARE\n\nExtended comparison features:\n- Word comparison\n- Byte comparison\n- Process statements\n\nSpecify datasets to compare.');
            } else if (opt === '14') {
                alert('SEARCH-FOR UTILITY\n\nSearch datasets for strings:\n- Search single dataset\n- Search multiple datasets\n- Search PDS members\n- Case sensitive/insensitive\n\nEnter search string and dataset list.');
            }

            setOption('');
        }
    };

    if (currentPanel === 'dslist') {
        return <DSList onBack={() => setCurrentPanel('main')} />;
    }

    if (currentPanel === 'dataset') {
        return <DatasetUtility onBack={() => setCurrentPanel('main')} />;
    }

    return (
        <div className="terminal-container ispf-panel">
            <div className="output-line" style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                ----------------------------- UTILITY SELECTION MENU ------------------------------
            </div>
            <div className="output-line"><br /></div>

            <div className="output-line">
                OPTION  ===&gt; <input
                    ref={inputRef}
                    type="text"
                    maxLength={8}
                    value={option}
                    onChange={e => setOption(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="field-input"
                    style={{ width: '10ch' }}
                />
            </div>

            <div className="output-line"><br /></div>
            <div className="output-line">   1  LIBRARY       Compress or print data set. Print index listing.</div>
            <div className="output-line">                    Print, rename, delete, browse, or edit members</div>
            <div className="output-line">   2  DATASET       Allocate, rename, delete, catalog, uncatalog, or</div>
            <div className="output-line">                    display information of an entire data set</div>
            <div className="output-line">   3  MOVE/COPY     Move, copy, or promote members or data sets</div>
            <div className="output-line">   4  DSLIST        Print or display (to process) list of data set names</div>
            <div className="output-line">                    Print or display VTOC information</div>
            <div className="output-line">   5  RESET         Reset statistics for members of ISPF library</div>
            <div className="output-line">   6  HARDCOPY      Initiate hardcopy output</div>
            <div className="output-line">   8  OUTLIST       Display, delete, or print held job output</div>
            <div className="output-line">   9  COMMANDS      Create/change an application command table</div>
            <div className="output-line">   10 RESERVED      Reserved for future use</div>
            <div className="output-line">   11 FORMAT        Format definition for formatted data Edit/Browse</div>
            <div className="output-line">   12 SUPERC        Compare data sets (Standard dialog)</div>
            <div className="output-line">   13 SUPERCE       Compare data sets (Extended dialog)</div>
            <div className="output-line">   14 SEARCH-FOR    Search data sets for strings of data</div>

            <div className="output-line"><br /></div>
            <div className="output-line">
                Enter =X to return to Primary Option Menu
            </div>

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">ISPF UTILITIES</span>
                </div>
                <div className="status-right">
                    <span className="status-item">z/OS 2.5</span>
                    <span className="status-item">ISPF 7.5</span>
                </div>
            </div>
        </div>
    );
};

export default ISPFUtilities;
