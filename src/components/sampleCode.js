import React from "react";

import sampleCode from "../assets/samplecode";

const SampleCode = (props) => {

    const { isToggle, handleChangeCode, handleChangeSample } = props;

    const sample = [
        { label: 'Flow', code: 'flow' },
        { label: 'Sequence', code: 'sequence' },
        { label: 'Class', code: 'class' },
        { label: 'State', code: 'state' },
        { label: 'ER', code: 'er' },
        { label: 'User Journey', code: 'journey' },
        { label: 'Gantt', code: 'gantt' },
        { label: 'Pie', code: 'pie' },
        { label: 'Quadrant Chart', code: 'quadrant' },
        { label: 'Requirement', code: 'requirement' },
        { label: 'Git', code: 'git' },
        { label: 'C4', code: 'c4' },
        { label: 'Mindmap', code: 'mindmap' },
        { label: 'Timeline', code: 'timeline' },
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