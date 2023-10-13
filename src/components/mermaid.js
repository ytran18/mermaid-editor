import React, { useEffect, Component } from "react";
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import mermaid from 'mermaid'

import './style.css';

mermaid.initialize({
    startOnLoad: true
});

const Mermaid = React.forwardRef((props, ref) => {

    const { code, hanleMessage, handleExit } = props;

    useEffect(() => {
        const mermaidChart = document.getElementById("mermaid-chart");

        if (mermaidChart) {
            mermaidChart.removeAttribute("data-processed");
            mermaid.contentLoaded();
        }
    },[code]);

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
                    <div ref={ref} id="mermaid-chart" className="mermaid" dangerouslySetInnerHTML={{ __html: code }}></div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
});

export default Mermaid;