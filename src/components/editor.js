import React, { useEffect, useRef, useState } from "react";

import * as monaco from 'monaco-editor';
import { Editor as MonacoEditor } from "@monaco-editor/react";

import { initEditor } from '../assets/mermaidTheme.js';

import './style.css';

const Editor = (props) => {
    
    const { handleChangeCode, handleDownload, handleChangeMode, handleChangeConfig, code, config } = props;
    
    const editorRef = useRef(null);
    
    const [state, setState] = useState({
        tabActive: 0,
    })

    const options = {
        readOnly: false,
        minimap: {
            enabled: false
        },
        fontWeight: '600',
        fontSize: '14px',
        overviewRulerLanes: 0,
        quickSuggestions: false,
        scrollBeyondLastLine: false,
    }
    
    useEffect(() => {
        if (state.tabActive === 0) {
            handleChangeMode('mermaid');
        } else {
            handleChangeMode('config');
            return;
        }
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
            scrollBeyondLastLine: false,
            value: code || '',
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
    },[state.tabActive])

    return (
        <div id="editor" className="editor">
            <div className="editor-top">
                <div 
                    className={`icon-left ${state.tabActive === 0 ? 'tab-active' : ''}`} 
                    onClick={() => setState(prev => ({...prev, tabActive: 0}))}
                    >
                    Code
                </div>
                <div 
                    className={`icon-right ${state.tabActive === 1 ? 'tab-active' : ''}`} 
                    onClick={() => setState(prev => ({...prev, tabActive: 1}))}
                >
                    Config
                </div>
            </div>
            {state.tabActive === 0 && (
                <div id="monaco-mermaid" style={{height: '100%'}}></div>
            )}
            {state.tabActive === 1 && (
                <MonacoEditor 
                    defaultLanguage="json"
                    className="w-full h-full"
                    onChange={handleChangeConfig}
                    options={options}
                    value={config}
                />
            )}
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