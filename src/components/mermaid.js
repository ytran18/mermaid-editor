import React, { useEffect } from "react";

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
        <div ref={ref} id="mermaid-chart" className="mermaid" dangerouslySetInnerHTML={{ __html: code }}></div>
    );
});

export default Mermaid;