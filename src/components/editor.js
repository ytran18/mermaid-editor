import React, { useEffect, useRef } from "react";

import * as monaco from 'monaco-editor';

import { initEditor } from '../assets/mermaidTheme.js';

import './style.css';

const Editor = (props) => {

    const { handleChangeCode, handleDownload } = props;
    // comment

    const editorRef = useRef(null);

    useEffect(() => {
        const editorContainer = document.getElementById('monaco-mermaid');
        editorRef.current = monaco.editor.create(editorContainer, {
            language: 'mermaid',
            minimap: {
                enabled: false
            },
            fontWeight: '600',
            fontSize: '14px',
            overviewRulerLanes: 0,
            quickSuggestions: false,
        });

        editorRef.current.onDidChangeModelContent(() => {
            const newValue = editorRef.current.getValue();
            handleChangeCode(newValue);
        });

        monaco.editor.setTheme('mermaid')
        initEditor(monaco);

        return () => {
            editorRef.current.dispose();
        }
    },[])

    return (
        <div id="editor" className="editor">
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