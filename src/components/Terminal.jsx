import React, { useState, useEffect, useRef } from 'react';
import { listDir, readFile, writeFile, createDir, deletePath, initFS } from '../utils/fileSystem';
import Editor from './Editor';
import ISPFMenu from './ISPFMenu';

const COMMANDS = {
    HELP: ['HELP', 'H'],
    CLS: ['CLS', 'CLEAR'],
    LISTCAT: ['LISTCAT', 'LISTC', 'LC', 'DIR', 'LS'],
    EDIT: ['EDIT', 'E', 'OEDIT'],
    ALLOCATE: ['ALLOCATE', 'ALLOC', 'TOUCH', 'MKDIR', 'MD'],
    DELETE: ['DELETE', 'DEL', 'RM'],
    SUBMIT: ['SUBMIT', 'SUB'],
    LOGON: ['LOGON'],
    LOGOFF: ['LOGOFF', 'EXIT', 'LO'],
    TIME: ['TIME', 'T'],
    ISPF: ['ISPF'],
    CD: ['CD', 'CHDIR'],
    WHOAMI: ['WHOAMI', 'ID']
};

const matchCmd = (input, cmdList) => cmdList.includes(input);

const Terminal = ({ userid, onLogoff }) => {
    const [input, setInput] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const [showISPF, setShowISPF] = useState(false);

    const [output, setOutput] = useState(() => {
        const saved = localStorage.getItem('mainframe_output');
        return saved ? JSON.parse(saved) : [
            `IKJ56455I ${userid} LOGON IN PROGRESS AT ${new Date().toLocaleTimeString()} ON TS01`,
            'IKJ56951I SYSTEM AVAILABLE',
            'READY',
        ];
    });

    const [cwd, setCwd] = useState(() => {
        return localStorage.getItem('mainframe_cwd') || '/USER/ADMIN';
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('mainframe_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [historyIndex, setHistoryIndex] = useState(-1);
    const [editingFile, setEditingFile] = useState(null);

    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('mainframe_output', JSON.stringify(output.slice(-100)));
    }, [output]);

    useEffect(() => {
        localStorage.setItem('mainframe_cwd', cwd);
    }, [cwd]);

    useEffect(() => {
        localStorage.setItem('mainframe_history', JSON.stringify(history.slice(-50)));
    }, [history]);

    useEffect(() => {
        const savedColor = localStorage.getItem('mainframe_color');
        if (savedColor) {
            document.body.className = `theme-${savedColor}`;
        }
        initFS();
        createDir('/USER/ADMIN');
        inputRef.current?.focus();
    }, []);

    const resolve = (path) => {
        if (!path) return cwd;

        let cleanPath = path.replace(/'/g, '');

        if (cleanPath.startsWith('/')) {
            const parts = cleanPath.split('/').filter(p => p && p !== '.');
            const resolvedParts = [];
            for (const part of parts) {
                if (part === '..') {
                    if (resolvedParts.length > 0) resolvedParts.pop();
                } else {
                    resolvedParts.push(part);
                }
            }
            return '/' + resolvedParts.join('/');
        }

        let effectivePath = cleanPath;
        if (cleanPath === '..') {
            const parts = cwd.split('/').filter(p => p);
            parts.pop();
            return parts.length ? '/' + parts.join('/') : '/';
        }

        let current = cwd === '/' ? '' : cwd;
        return current + '/' + effectivePath;
    };

    useEffect(() => {
        if (!editingFile && !showISPF) {
            inputRef.current?.focus();
        }
    }, [editingFile, showISPF]);

    useEffect(() => {
        if (!editingFile && !showISPF) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [output, editingFile, showISPF]);

    const execute = (cmdString) => {
        if (!cmdString.trim()) {
            setOutput(prev => [...prev, ' ', 'READY']);
            return;
        }

        const parts = cmdString.trim().split(/\s+/);
        const cmd = parts[0].toUpperCase();
        const args = parts.slice(1);

        let result = [];

        const getTarget = (argList) => {
            const fullArgs = argList.join(' ');
            const daMatch = fullArgs.match(/DA\(['"]?([^)'"]+)['"]?\)/i);
            if (daMatch) return daMatch[1];
            const dsMatch = fullArgs.match(/DSNAME\(['"]?([^)'"]+)['"]?\)/i);
            if (dsMatch) return dsMatch[1];
            return argList[0];
        };

        if (matchCmd(cmd, COMMANDS.HELP)) {
            result = [
                'TSO COMMANDS:',
                '  LISTCAT / LC [ENT]  - LIST DATASET CATALOG (LS)',
                '  ALLOCATE DA(DSN)    - ALLOCATE NEW DATASET/FILE (TOUCH)',
                '                        USE DSORG(PO) OR MKDIR FOR DIRECTORY',
                '  DELETE [DSN]        - DELETE DATASET/MEMBER (RM)',
                '  EDIT [DSN]          - EDIT DATASET MEMBER (E)',
                '  SUBMIT [DSN]        - SUBMIT JOB (RUN SCRIPT)',
                '  ISPF                - START ISPF DIALOG MANAGER',
                '  LOGON [USERID]      - DISPLAY LOGON INFORMATION',
                '  TIME                - DISPLAY SYSTEM TIME',
                '  LOGOFF              - END SESSION',
                '  CD [DSN]            - CHANGE PREFIX (NAVIGATE)',
                '  HELP                - DISPLAY THIS LIST'
            ];
        }
        else if (matchCmd(cmd, COMMANDS.ISPF)) {
            setShowISPF(true);
            return;
        }
        else if (matchCmd(cmd, COMMANDS.CLS)) {
            setOutput([]);
            setTimeout(() => setOutput(['READY']), 10);
            return;
        }
        else if (matchCmd(cmd, COMMANDS.LISTCAT)) {
            const target = args.length > 0 ? resolve(getTarget(args)) : cwd;
            const files = listDir(target);
            if (files === null) {
                result = [`IDC3009I ** VSAM CATALOG RETURN CODE IS 8 - REASON CODE IS IGG0CLX0 **`, `DSNAME NOT FOUND: ${target}`];
            } else {
                result = [`LISTING FROM CATALOG -- ${target}`];
                if (files.length === 0) {
                    result.push('NO ENTRIES FOUND.');
                } else {
                    files.forEach(f => {
                        const type = f.type === 'dir' ? 'ALIAS' : 'NONVSAM';
                        result.push(`${type} --------- ${f.name}`);
                    });
                }
            }
        }
        else if (matchCmd(cmd, COMMANDS.CD)) {
            if (!args[0]) {
                result = [`CURRENT PREFIX: ${cwd}`];
            } else {
                const newDir = resolve(args[0]);
                const check = listDir(newDir);
                if (check !== null) {
                    setCwd(newDir);
                } else {
                    result = [`INVALID DATASET NAME OR PREFIX: ${args[0]}`];
                }
            }
        }
        else if (matchCmd(cmd, COMMANDS.ALLOCATE)) {
            const target = getTarget(args);
            if (!target) {
                result = ['IKJ56701I MISSING DATASET NAME'];
            } else {
                const fPath = resolve(target);
                const isDir = cmdString.toUpperCase().includes('DSORG(PO)') ||
                    paramsHas(args, 'DIR') ||
                    matchCmd(cmd, ['MKDIR', 'MD']) ||
                    target.endsWith('/');

                let success = false;
                if (isDir) {
                    success = createDir(fPath);
                } else {
                    success = writeFile(fPath, '');
                }

                if (!success) {
                    result = ['IKJ56220I DATA SET NOT ALLOCATED, SYSTEM ERROR'];
                }
            }
        }
        else if (matchCmd(cmd, COMMANDS.DELETE)) {
            const target = getTarget(args);
            if (!target) {
                result = ['IKJ56701I MISSING DATASET NAME'];
            } else {
                const fPath = resolve(target);
                const success = deletePath(fPath);
                if (success) {
                    result = [`IDC0550I ENTRY (${target}) DELETED`];
                } else {
                    result = [`IDC3009I ** VSAM CATALOG RETURN CODE IS 8 **`, `ENTRY ${target} NOT FOUND`];
                }
            }
        }
        else if (matchCmd(cmd, COMMANDS.EDIT)) {
            const target = getTarget(args);
            if (!target) {
                result = ['IKJ56701I MISSING DATASET NAME'];
            } else {
                const fPath = resolve(target);
                const content = readFile(fPath);
                if (content === null) {
                    const dirParts = fPath.split('/');
                    dirParts.pop();
                    const dirPath = dirParts.join('/') || '/';
                    if (listDir(dirPath) !== null) {
                        setEditingFile({ path: fPath, content: '' });
                        setOutput(prev => [...prev]);
                        return;
                    } else {
                        result = [`DATASET ${fPath} NOT FOUND`];
                    }
                } else {
                    setEditingFile({ path: fPath, content });
                    return;
                }
            }
        }
        else if (matchCmd(cmd, COMMANDS.SUBMIT)) {
            const target = getTarget(args);
            if (!target) {
                result = ['Usage: SUBMIT \'DATASET.NAME\''];
            } else {
                const fPath = resolve(target);
                const content = readFile(fPath);
                if (content === null) {
                    result = [`DATASET ${target} NOT FOUND`];
                } else {
                    const jobId = 'JOB' + Math.floor(Math.random() * 10000);
                    result = [
                        `IKJ56250I JOB ${jobId} (${userid}) SUBMITTED`,
                        `ICH70001I ${userid} LAST ACCESS AT ${new Date().toLocaleTimeString()}`,
                        `$HASP165 ${jobId} ENDED AT UNIT=SYSDA`
                    ];
                }
            }
        }
        else if (matchCmd(cmd, COMMANDS.TIME)) {
            const d = new Date();
            result = [`IKJ56650I TIME- ${d.toLocaleTimeString()} DATE- ${d.toLocaleDateString()}`];
        }
        else if (matchCmd(cmd, COMMANDS.WHOAMI)) {
            result = [`USERID: ${userid}  PROC: IKJACCNT  TERMINAL: VTAM01`];
        }
        else if (matchCmd(cmd, COMMANDS.LOGON)) {
            if (args.length > 0) {
                const targetUser = args[0].toUpperCase();
                result = [
                    `IKJ56455I ${targetUser} LOGON IN PROGRESS AT ${new Date().toLocaleTimeString()} ON TS01`,
                    `IKJ56700I ${userid} ALREADY LOGGED ON`,
                    `IKJ56702I USE LOGOFF TO END CURRENT SESSION FIRST`
                ];
            } else {
                result = [
                    `IKJ56700I ${userid} ALREADY LOGGED ON`,
                    `LOGON TIME: ${new Date().toLocaleTimeString()}`,
                    `TERMINAL:   VTAM01`,
                    `PROCEDURE:  IKJACCNT`,
                    `REGION:     4096K`,
                    ' ',
                    'USE LOGOFF TO END SESSION'
                ];
            }
        }
        else if (matchCmd(cmd, COMMANDS.LOGOFF)) {
            localStorage.removeItem('mainframe_output');
            localStorage.removeItem('mainframe_cwd');
            localStorage.removeItem('mainframe_history');
            onLogoff();
            return;
        }
        else {
            result = [`IKJ56500I COMMAND ${cmd} NOT FOUND`];
        }

        const newOutput = [
            ...output,
            cmdString,
            ...result,
            'READY'
        ];

        setOutput(newOutput);
    };

    const paramsHas = (args, key) => args.some(a => a.toUpperCase() === key);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cmd = input;
            setHistory(prev => [...prev, cmd]);
            setHistoryIndex(-1);
            setInput('');
            setCursorPos(0);
            execute(cmd);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            const newInput = history[newIndex] || '';
            setInput(newInput);
            setCursorPos(newInput.length);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === -1) return;
            const newIndex = historyIndex + 1;
            if (newIndex >= history.length) {
                setHistoryIndex(-1);
                setInput('');
                setCursorPos(0);
            } else {
                setHistoryIndex(newIndex);
                const newInput = history[newIndex] || '';
                setInput(newInput);
                setCursorPos(newInput.length);
            }
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        setCursorPos(e.target.selectionStart);
    };

    const handleSelect = (e) => {
        setCursorPos(e.target.selectionStart);
    };

    const handleEditorSave = (content) => {
        if (editingFile) {
            writeFile(editingFile.path, content);
            setOutput(prev => [...prev, `EDIT       ${editingFile.path} - 01.00 - SAVED`, 'READY']);
            setEditingFile(null);
        }
    };

    const handleEditorExit = () => {
        setOutput(prev => [...prev, `EDIT       ${editingFile?.path || ''} - CANCELED`, 'READY']);
        setEditingFile(null);
    };

    const handleISPFExit = () => {
        setShowISPF(false);
        setOutput(prev => [...prev, 'ISPF', '***', 'READY']);
    };

    if (showISPF) {
        return <ISPFMenu userid={userid} onExit={handleISPFExit} />;
    }

    if (editingFile) {
        return (
            <Editor
                filename={editingFile.path}
                initialContent={editingFile.content}
                onSave={handleEditorSave}
                onExit={handleEditorExit}
            />
        );
    }

    return (
        <div className="terminal-container" onClick={() => inputRef.current?.focus()}>
            {output.map((line, i) => (
                <div key={i} className="output-line">{line}</div>
            ))}
            <div className="input-area">
                <input
                    ref={inputRef}
                    type="text"
                    className="real-input"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onSelect={handleSelect}
                    onKeyUp={handleSelect}
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                />

                <div className="input-display">
                    <span>{input.slice(0, cursorPos)}</span>
                    <span className="cursor-block">
                        {input[cursorPos] || '\u00A0'}
                    </span>
                    <span>{input.slice(cursorPos + 1)}</span>
                </div>
            </div>
            <div ref={bottomRef} />

            <div className="status-bar">
                <div className="status-left">
                    <span className="status-item">IBM 3270 Model 2</span>
                    <span className="status-item">Online</span>
                    <span className="status-item">User: {userid}</span>
                </div>
                <div className="status-right">
                    <span className="status-item">Row: {output.length + 1} Col: {cursorPos + 1}</span>
                    <span className="status-item">z/OS 2.5</span>
                </div>
            </div>
        </div>
    );
};

export default Terminal;
