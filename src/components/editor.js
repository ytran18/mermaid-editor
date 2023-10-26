import React, { useEffect, useRef, useState } from "react";

import * as monaco from 'monaco-editor';
import { Editor as MonacoEditor } from "@monaco-editor/react";

import Actions from "./actions.js";

import { initEditor } from '../assets/mermaidTheme.js';

import './style.css';

const Editor = (props) => {
    
    const { handleChangeCode, handleDownload, handleChangeMode, handleChangeConfig, code, config } = props;
    
    const editorRef = useRef(null);
    const divRef = useRef(null); // get width of editor
    
    const [state, setState] = useState({
        tabActive: 0,
        count: 0,
        showActions: false,
        divWidth: null,
        typeMermaid: '',
        url: 'default'
    });

    const options = {
        readOnly: false,
        minimap: {
            enabled: false
        },
        fontWeight: '600',
        fontSize: '14px',
        overviewRulerLanes: 0,
        quickSuggestions: true,
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
            quickSuggestions: true,
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

        const resizeObserver = new ResizeObserver((entries) => {
            requestAnimationFrame(() => {
                editorRef.current?.layout({
                  height: entries[0].contentRect.height,
                  width: entries[0].contentRect.width
                });
              });
        });

        if (editorContainer) {
            resizeObserver.observe(editorContainer.parentElement);
        };

        window.addEventListener("error", function (e) {
            console.error("MU: ",e.message);
        });

        return () => {
            editorRef.current.dispose();
        }
    },[state.tabActive]);

    useEffect(() => {
        if (state.count < 3) {
            editorRef.current.setValue(code || '');
            const model = editorRef.current.getModel();
            
            // get value of first line
            const firstLineText = model.getValue().split('\n')[0];
            const letters = firstLineText?.split(' ')?.[0]?.replace(/[^a-zA-Z0-9]/g, '')
            const position = model.getPositionAt(model.getValueLength());
            editorRef.current.setPosition(position);
            setState(prev => ({...prev, count: prev.count + 1, url: letters.trim()}));
        };
    },[code]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === divRef.current) {
                    const newWidth = entry.contentRect.width;
                    setState(prev => ({...prev, divWidth: newWidth}));
                }
            }
        });
    
        if (divRef.current) {
            resizeObserver.observe(divRef.current);
        }
    
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        if (state.count > 2) {
            const model = editorRef.current.getModel();
            const firstLineText = model.getValue().split('\n')[0];
            const letters = firstLineText?.split(' ')?.[0]?.replace(/[^a-zA-Z0-9]/g, '')
            setState(prev => ({...prev, count: prev.count + 1, url: letters.trim()}));
        }
    },[code]);

    const handleDocument = () => {
        const openurl = {
            "C4Context": "https://mermaid.js.org/syntax/c4.html",
            "gitGraph": "https://mermaid.js.org/syntax/gitgraph.html",
            "journey": "https://mermaid.js.org/syntax/userJourney.html",
            "gantt": "https://mermaid.js.org/syntax/gantt.html",
            "mindmap": "https://mermaid.js.org/syntax/mindmap.html",
            "graph": "https://mermaid.js.org/syntax/flowchart.html",
            "quadrantChart": "https://mermaid.js.org/syntax/quadrantChart.html",
            "stateDiagram-v2": "https://mermaid.js.org/syntax/stateDiagram.html",
            "stateDiagram": "https://mermaid.js.org/syntax/stateDiagram.html",
            "timeline": "https://mermaid.js.org/syntax/timeline.html",
            "classDiagram": "https://mermaid.js.org/syntax/classDiagram.html",
            "erDiagram": "https://mermaid.js.org/syntax/entityRelationshipDiagram.html",
            "pie": "https://mermaid.js.org/syntax/pie.html",
            "sequenceDiagram": "https://mermaid.js.org/syntax/sequenceDiagram.html",
            "flowchart": "https://mermaid.js.org/syntax/flowchart.html",
        }[state.url] || 'https://mermaid.js.org/';

        window.open(openurl, '_blank');
    };

    return (
        <div id="editor" className="editor" ref={divRef}>
            <div className="editor-top">
                <div className="top-left">
                    <div
                        className={`icon-left ${state.tabActive === 0 ? 'tab-active' : ''}`}
                        onClick={() => setState(prev => ({...prev, tabActive: 0}))}
                        >
                        {localStorage.getItem('zlanguage') === 'vn' ? 'Mã' : 'Code'}
                    </div>
                    <div
                        className={`icon-right ${state.tabActive === 1 ? 'tab-active' : ''}`}
                        onClick={() => setState(prev => ({...prev, tabActive: 1}))}
                    >
                        {localStorage.getItem('zlanguage') === 'vn' ? 'Cấu hình' : 'Config'}
                    </div>
                </div>
                <div className={`more ${state.divWidth < 510 ? 'flex-more' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='22' height='22' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" onClick={() => setState(prev => ({...prev, showActions: !prev.showActions}))}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    {state.showActions && (
                        <Actions handleDownload={handleDownload}/>
                    )}
                </div>
                <div className={`top-right ${state.divWidth < 510 ? 'hidden': ''}`}>
                    <div className="png-button" onClick={() => handleDownload('png')}>
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
                    <div className="png-button" style={{marginRight: '3px'}} onClick={() => handleDownload('clipboard')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='18' height='18' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                    </div>
                    <div className="png-button" style={{marginRight: '20px'}} onClick={handleDocument}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='18' height='18' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        DOC
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