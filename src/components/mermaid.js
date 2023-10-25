import React, { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import mermaid from 'mermaid'

import './style.css';

mermaid.initialize({
    startOnLoad: true,
});

const Mermaid = React.forwardRef((props, ref) => {

    const { code, mode, config, fileName } = props;

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
            </div>
            <TransformWrapper minScale={0.5}>
                {
                    ({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <React.Fragment>
                            <div className="zoom-action">
                                <div 
                                    className="zoom-btn zoom-in" 
                                    onClick={() => zoomIn()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width='22' height='22' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div 
                                    className="zoom-btn reset" 
                                    onClick={() => resetTransform()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width='22' height='22' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                    </svg>

                                </div>
                                <div 
                                    className="zoom-btn zoom-out" 
                                    onClick={() => zoomOut()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width='22' height='22' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
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
                        </React.Fragment>
                    )
                }
            </TransformWrapper>
        </div>
    );
});

export default Mermaid;