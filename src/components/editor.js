import React, { useEffect, useRef } from "react";
import { Editor as Monaco } from '@monaco-editor/react'


import './style.css';

const Editor = (props) => {

    const { className, handleChangeCode, handleDownload } = props;

    const editorRef = useRef(null);

    useEffect(() => {
        console.log(editorRef.current.offsetWidth);
    },[editorRef.current])

    const options = {
        readOnly: false,
        minimap: {
            enabled: false
        },
        fontWeight: '600',
        fontSize: '14px',
        quickSuggestions: false,
        theme: 'mermaid',
        overviewRulerLanes: 0
    }

    return (
        <div id="editor" ref={editorRef} className="editor">
            <div className="editor-top">
                <div className="icon">Code</div>
            </div>
            <Monaco 
                className={className}
                defaultLanguage="graphql"
                onChange={handleChangeCode}
                options={options}
            />
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