import React, { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import mermaid from 'mermaid'

import './style.css';

mermaid.initialize({
    startOnLoad: true,
});

const Mermaid = React.forwardRef((props, ref) => {

    const { code, hanleMessage, handleExit, mode, config } = props;

    const [state, setState] = useState({
        errMessage: '',
        isErr: false,
        errArray: [],
        codeNotErr: ``,
        errMode: false,
    });

    // handle mermaid
    useEffect(() => {
        const mermaidChart = document.getElementById("mermaid-chart");
        if (mode !== 'mermaid') return;

        if (mermaidChart && mode === 'mermaid') {
            mermaidChart.removeAttribute("data-processed");
            mermaid.contentLoaded();
        }

        let jsonConfig;
        if (config && typeof config === 'string' && config.trim() !== '') {
            try {
                jsonConfig = JSON.parse(config);
            } catch (err) {
                console.log("Parse Err");
            }
        };

        let isErr = false;

        mermaid.parseError = (err) => {
            if (code === '') return;
            isErr = true;
            setState(prev => ({...prev, errMessage: err?.message, isErr: true }));
        }

        setTimeout(() => {
            if (isErr === false) {
                setState(prev => ({ ...prev, isErr: false, codeNotErr: code, errMode: false }));
            }
        }, 0);

        if (config && typeof config === 'string' && config.trim() !== '') {
            mermaid.initialize(jsonConfig);
        }

    },[code, config]);

    // split err message
    useEffect(() => {
        const lines = state.errMessage.split('\n');
        setState(prev => ({...prev, errArray: lines}));
    },[state.errMessage]);


    return (
        <div className="content">
            <div className="content-top">
                <div className="content-text">Diagram</div>
                <div 
                    className="content-btn"
                >
                    <div 
                        className="content-text btn-save"
                        onClick={hanleMessage}
                    >
                        Save
                    </div>
                    <div 
                        className="content-text btn-save"
                        onClick={handleExit}
                    >
                        Exit
                    </div>
                </div>
            </div>
            <TransformWrapper>
                <TransformComponent>
                    <div ref={ref} id="mermaid-chart" className={`mermaid ${state.isErr ? 'opacity': ''}`} dangerouslySetInnerHTML={{ __html: code }}></div>
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