import React from "react";
import AceEditor from 'react-ace';
import { Editor as Monaco } from '@monaco-editor/react'

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/ext-language_tools';

import './style.css';

const Editor = (props) => {

    const { className, handleChangeCode, handleDownload } = props;

    const options = {
        readOnly: false,
        minimap: {
            enabled: false
        },
        fontWeight: '600',
        fontSize: '14px',
        quickSuggestions: false,
    }

    return (
        <div className="editor">
            <div className="editor-top">
                <div className="icon">Code</div>
            </div>
            <Monaco 
                className={className}
                defaultLanguage="graphql"
                onChange={handleChangeCode}
                options={options}
            />
            <div className="editor-bottom">
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