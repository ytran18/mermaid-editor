import React from "react";
import AceEditor from 'react-ace';

import { ReactComponent as IconCode } from '../assets/icons/iconCode.svg';

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/ext-language_tools';

import './style.css';

const Editor = (props) => {

    const { className, handleChangeCode, handleDownload } = props;

    return (
        <div className="editor">
            <div className="editor-top">
                <div className="">Mermaid</div>
                <div className="icon"> <IconCode /> <span className="span-text">Code</span></div>
                <div className=""></div>
            </div>
            <AceEditor 
                mode='typescript'
                theme='cloud9_day'
                onChange={handleChangeCode}
                name='ace-editor'
                fontSize={14}
                tabSize={4}
                className={className}
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