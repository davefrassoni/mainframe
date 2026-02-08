import React, { useState, useEffect, useRef } from 'react';

const Editor = ({ filename, initialContent, onSave, onExit }) => {
    const [content, setContent] = useState(initialContent || '');
    const textareaRef = useRef(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            onSave(content);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onExit();
        }
    };

    return (
        <div className="editor-overlay">
            <div className="editor-header">
                <span>EDITING: {filename}</span>
                <span className="editor-controls">
                    [CTRL+S] SAVE  [ESC] EXIT
                </span>
            </div>
            <textarea
                ref={textareaRef}
                className="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
            />
        </div>
    );
};

export default Editor;
