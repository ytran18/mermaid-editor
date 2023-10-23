import React, { useEffect, useRef, useState } from "react";

import * as monaco from 'monaco-editor';
import { Editor as MonacoEditor } from "@monaco-editor/react";

import Actions from "./actions.js";

import { initEditor } from '../assets/mermaidTheme.js';

import './style.css';

const Editor = (props) => {
    
    const { handleChangeCode, handleDownload, handleChangeMode, handleChangeConfig, code, config } = props;
    
    const editorRef = useRef(null);
    
    const [state, setState] = useState({
        tabActive: 0,
        count: 0,
        showActions: false,
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

        editorRef.current.onDidChangeModelContent(({ isFlush, changes }) => {
            if (isFlush) return;
            const newValue = editorRef.current.getValue();
            handleChangeCode(newValue);
        });

        monaco.editor.setTheme('mermaid')
        initEditor(monaco);

        return () => {
            editorRef.current.dispose();
        }
    },[state.tabActive]);

    useEffect(() => {
        if (state.count < 3) {
            editorRef.current.setValue(code || '');
            const model = editorRef.current.getModel();
            const position = model.getPositionAt(model.getValueLength());
            editorRef.current.setPosition(position);
            setState(prev => ({...prev, count: prev.count + 1}));
        };
    },[code])

    return (
        <div id="editor" className="editor">
            <div className="editor-top">
                <div className="top-left">
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
                <div className="more">
                    <svg xmlns="http://www.w3.org/2000/svg" width='22' height='22' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" onClick={() => setState(prev => ({...prev, showActions: !prev.showActions}))}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    {state.showActions && (
                        <Actions handleDownload={handleDownload}/>
                    )}
                </div>
                <div className="top-right">
                    <div className="png-button" onClick={() => handleDownload('svg')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width='18' height='18' viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" style={{marginRight: '3px'}}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        PNG
                    </div>
                    <div className="png-button" onClick={() => handleDownload('svg')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width='18' height='18' viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" style={{marginRight: '3px'}}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        SVG
                    </div>
                    <div className="png-button" style={{marginRight: '20px'}} onClick={() => handleDownload('clipboard')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='18' height='18' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                    </div>
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
        </div>
    );
};

export default Editor;