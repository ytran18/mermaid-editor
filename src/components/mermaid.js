import React, { useEffect, Component } from "react";
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import mermaid from 'mermaid'

import './style.css';

mermaid.initialize({
    startOnLoad: true
});

const Mermaid = React.forwardRef((props, ref) => {

    const { code } = props;

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