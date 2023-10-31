import React from "react";

import sampleCode from "../assets/samplecode";

const SampleCode = (props) => {

    const { isToggle, handleChangeCode, handleChangeSample } = props;

    const sample = [
        { label: 'C4', code: 'c4' },
        { label: 'Git', code: 'git' },
        { label: 'User Journey', code: 'journey' },
        { label: 'Gantt', code: 'gantt' },
        { label: 'Mindmap', code: 'mindmap' },
        { label: 'Flow', code: 'flow' },
        { label: 'Quadrant Chart', code: 'quadrant' },
        { label: 'State', code: 'state' },
        { label: 'Timeline', code: 'timeline' },
        { label: 'Class', code: 'class' },
        { label: 'ER', code: 'er' },
        { label: 'Pie', code: 'pie' },
        { label: 'Sequence', code: 'sequence' },
        { label: 'Requirement', code: 'requirement' },
        { label: 'Sankey', code: 'sankey' }
    ];

    const handleClick = (code) => {
        handleChangeCode(sampleCode[code]);
        handleChangeSample(code);
    };

    return (
        <div className={`sample-code ${isToggle ? 'test' : ''}`}>
            {sample.map((item, index) => {
                return (
                    <div 
                        key={index} 
                        className="sample-btn"
                        onClick={() => handleClick(item.code)}
                    >
                        {item.label}
                    </div>
                )
            })}
        </div>
    );
};

export default SampleCode;