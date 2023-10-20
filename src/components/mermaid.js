import React, { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import mermaid from 'mermaid'

import { ReactComponent as IconClose } from '../assets/icons/iconClose.svg';

import './style.css';

mermaid.initialize({
    startOnLoad: true,
});

const Mermaid = React.forwardRef((props, ref) => {

    const { code, handleSave, handleExit, mode, config, isAutoSave, handleAutoSave, fileName, handleCLoseBtn } = props;

    const [state, setState] = useState({
        errMessage: '',
        isErr: false,
        errArray: [],
        codeNotErr: ``,
        errMode: false,
    });

    const onCheckError = async (value) => {
        let syntaxTree;
        try {
            syntaxTree = await mermaid.parse(value);
            return syntaxTree
        } catch(error) {
            return false;
        }
    }

    const counterRef = useRef(0);

    // handle mermaid
    useEffect(() => {
        const onHandleMermaidData = async (value) => {
            const mermaidChart = document.getElementById("mermaid-chart");
            
            if (mermaidChart && mode === 'mermaid') {
                const isValidContent = await onCheckError(value);
                if(isValidContent) {
                    counterRef.current = 0;
                    ref.current.innerHTML = value;
                    setState(prev => ({...prev, diagramCode: value, isErr: false}));
                } else {
                    counterRef.current = counterRef.current + 1;
                    setState(prev => ({...prev, isErr: true}));
                    if(counterRef.current > 2) return;
                    ref.current.innerHTML = state.diagramCode;
                }
            }

            mermaid.parseError = (err) => {
                if (code === '') return;
                setState(prev => ({...prev, errMessage: err?.message}));
            }

            mermaid.contentLoaded();
            mermaidChart.removeAttribute("data-processed");
            
        }
        onHandleMermaidData(code);
    },[code, state.isErr, config]);

    useEffect(() => {
        const mermaidChart = document.getElementById("mermaid-chart");
        let jsonConfig;

        if (config && typeof config === 'string' && config.trim() !== '') {
            try {
                jsonConfig = JSON.parse(config);
            } catch (err) {
                console.log("Parse Err");
            }
        };

        if (mode === 'config' || config) {
            try {
                mermaid.initialize(jsonConfig);
                ref.current.innerHTML = code;
            } catch (err) {
                ref.current.innerHTML = code;
            }
        }

        mermaid.contentLoaded();
        mermaidChart.removeAttribute("data-processed");
    },[config])

    useEffect(() => {
        const lines = state.errMessage.split('\n');
        setState(prev => ({...prev, errArray: lines}));
    },[state.errMessage]);

    return (
        <div className="content">
            <div className="content-top">
                <div className="content-text">{fileName}</div>
                <div 
                    className="content-btn"
                >
                    <div className="content-text auto-save">
                        <input type="checkbox" value={isAutoSave} onChange={handleAutoSave} />
                        <span className="save-text">Auto save</span>
                    </div>
                    <div 
                        className={`content-text btn-save ${isAutoSave ? 'hidden' : ''}`}
                        onClick={handleSave}
                    >
                        Save
                    </div>
                    <div 
                        className="content-text btn-exit"
                        onClick={handleExit}
                    >
                        Exit
                    </div>
                </div>
                <div className="close-btn">
                    <IconClose onClick={handleCLoseBtn}/>
                </div>
            </div>
            <TransformWrapper>
                <TransformComponent>
                    <div ref={ref} id="mermaid-chart" className={`mermaid ${state.isErr ? 'opacity': ''}`}></div>
                    <div className="err-wrapper">
                        { state.isErr && (
                            state.errArray?.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className="err-message">{item}</div>
                                        {index !== state.errArray.length - 1 && <br />}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
});

export default Mermaid;