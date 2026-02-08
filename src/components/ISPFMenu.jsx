import React, { useState, useEffect, useRef } from 'react';
import ISPFUtilities from './ISPFUtilities';
import ISPFView from './ISPFView';

const ISPFMenu = ({ userid, onExit }) => {
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

            if (opt === 'X') {
                onExit();
            } else if (opt === '0') {
                const versionInfo = [
                    'z/OS SYSTEM INFORMATION',
                    '',
                    'Product Name:     z/OS',
                    'Version:          02.05.00',
                    'Release:          z/OS V2R5',
                    'License:          z/OS',
                    'Owner:            IBM CORP',
                    'System Name:      MAINFRAME',
                    'SMPE FMID:        HBB77C0',
                    'Install Date:     2024/01/15',
                    '',
                    'Press ENTER to continue...'
                ].join('\n');
                alert(versionInfo);
            } else if (opt === '1') {
                setCurrentPanel('view');
                setOption('');
                return;
            } else if (opt === '2') {
                alert('ISPF EDIT\n\nCreate or change source data:\n- Edit sequential datasets\n- Edit PDS members\n- Line commands (I, D, C, M, R)\n- Primary commands (FIND, CHANGE, SAVE)\n\nUse TSO EDIT command for full editing capabilities.');
            } else if (opt === '3') {
                setCurrentPanel('utilities');
                setOption('');
                return;
            } else if (opt === '4') {
                alert('FOREGROUND PROCESSING\n\nInteractive language processing:\n- Compile programs\n- Link-edit\n- Execute programs\n- Debug\n\nSupported languages:\n- COBOL\n- PL/I\n- Assembler\n- C/C++\n\nSpecify language and options.');
            } else if (opt === '5') {
                alert('BATCH PROCESSING\n\nSubmit jobs for background processing:\n- Compile jobs\n- Link-edit jobs\n- Execute jobs\n\nJCL will be generated based on:\n- Language selected\n- Compile options\n- Dataset names\n\nJob will be submitted to JES2.');
            } else if (opt === '6') {
                alert('COMMAND SHELL\n\nEnter TSO or Workstation commands:\n- TSO commands\n- REXX procedures\n- CLIST procedures\n- Unix System Services commands\n\nType EXIT to return to ISPF.\n\nNote: You can use TSO commands directly from the main terminal.');
            } else if (opt === '7') {
                alert('DIALOG TEST\n\nTest ISPF dialog applications:\n- Test panels\n- Test messages\n- Test skeletons\n- Test tables\n- Trace dialog flow\n\nEnter dialog ID or panel name.');
            } else if (opt === '8') {
                alert('LIBRARY MANAGEMENT FACILITY\n\nLibrary administrator functions:\n- Create libraries\n- Manage library access\n- Library statistics\n- Library compression\n- Member management\n\nEnter library name to manage.');
            } else if (opt === '9') {
                alert('IBM PROGRAM PRODUCTS\n\nAccess IBM development tools:\n- Debug Tool\n- File Manager\n- Fault Analyzer\n- Application Performance Analyzer\n- COBOL Interactive Debug\n\nSelect product from list.');
            } else if (opt === '10') {
                alert('SCLM - SOFTWARE CONFIGURATION\nAND LIBRARY MANAGER\n\nManage software development:\n- Version control\n- Build management\n- Promote code\n- Track changes\n- Migration control\n\nEnter project name.');
            } else if (opt === 'C') {
                alert('CHANGES FOR THIS RELEASE\n\nISPF Version 7 Release 5\n\nEnhancements:\n- Enhanced EDIT/VIEW performance\n- New search capabilities\n- Improved ISPF statistics\n- z/OS V2R5 support\n- Enhanced Unicode support\n- Improved panel display\n- New utility functions');
            } else if (opt === 'T') {
                alert('ISPF TUTORIAL\n\nTopics available:\n- Getting Started\n- EDIT/VIEW functions\n- Utilities\n- Dialog development\n- File tailoring\n- Table services\n- Variable services\n- Message services\n\nSelect topic for detailed information.');
            }

            setOption('');
        }
    };

    if (currentPanel === 'utilities') {
        return <ISPFUtilities onBack={() => setCurrentPanel('main')} />;
    }

    if (currentPanel === 'view') {
        return <ISPFView onBack={() => setCurrentPanel('main')} />;
    }

    return (
        <div className="terminal-container ispf-panel">
            <div className="output-line" style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                ----------------------------- ISPF PRIMARY OPTION MENU -----------------------------
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
            <div className="output-line">   0  SETTINGS       Terminal and user parameters</div>
            <div className="output-line">   1  VIEW           Display source data or listings</div>
            <div className="output-line">   2  EDIT           Create or change source data</div>
            <div className="output-line">   3  UTILITIES      Perform utility functions</div>
            <div className="output-line">   4  FOREGROUND     Interactive language processing</div>
            <div className="output-line">   5  BATCH          Submit job for language processing</div>
            <div className="output-line">   6  COMMAND        Enter TSO or Workstation commands</div>
            <div className="output-line">   7  DIALOG TEST    Perform dialog testing</div>
            <div className="output-line">   8  LM FACILITY    Library administrator functions</div>
            <div className="output-line">   9  IBM PRODUCTS   IBM program development products</div>
            <div className="output-line">   10 SCLM           Software Configuration and Library Manager</div>
            <div className="output-line">   C  CHANGES        Display summary of changes for this release</div>
            <div className="output-line">   T  TUTORIAL       Display information about ISPF functions</div>
            <div className="output-line">   X  EXIT           Terminate ISPF using log and list defaults</div>

            <div className="output-line"><br /></div>
            <div className="output-line">
                Enter END command to terminate ISPF.
            </div>

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">ISPF {userid}</span>
                    <span className="status-item">PRIMARY MENU</span>
                </div>
                <div className="status-right">
                    <span className="status-item">z/OS 2.5</span>
                    <span className="status-item">ISPF 7.5</span>
                </div>
            </div>
        </div>
    );
};

export default ISPFMenu;
