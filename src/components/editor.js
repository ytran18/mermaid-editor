import React, { useEffect, useRef } from "react";

import * as monaco from 'monaco-editor';

import { initEditor } from '../assets/mermaidTheme.js';

import './style.css';

const Editor = (props) => {

    const { className, handleChangeCode, handleDownload } = props;
    // comment

    const editorRef = useRef(null);

    useEffect(() => {
        const editorContainer = document.getElementById('monaco-mermaid');
        const monacoEditor = monaco.editor.create(editorContainer, {
            language: 'mermaid',
            minimap: {
                enabled: false
            },
            fontWeight: '600',
            fontSize: '14px',
            overviewRulerLanes: 0,
            quickSuggestions: false,
        });

        let isChangePending = false;

        monacoEditor.onDidChangeModelContent(() => {
            if (!isChangePending) {
                isChangePending = true;
                setTimeout(() => {
                    const newValue = monacoEditor.getValue();
                    handleChangeCode(newValue);
                    isChangePending = false;
                }, 0);
            }
        });

        monaco.editor.setTheme('mermaid')
        initEditor(monaco);
    },[])

    return (
        <div id="editor" ref={editorRef} className="editor">
            <div className="editor-top">
                <div className="icon">Code</div>
            </div>
            <div id="monaco-mermaid" style={{height: '100%'}}></div>
            <div className={`editor-bottom`}>
                <div className="png-button" onClick={() => handleDownload('svg')}>
                    Save as SVG
                </div>
                <div className="png-button" onClick={() => handleDownload('png')}>
                    Save as PNG
                </div>
                <div className="png-button" onClick={() => handleDownload('clipboard')}>
                    Copy to clipboard
                </div>
            </div>
        </div>
    );
};

export default Editor;