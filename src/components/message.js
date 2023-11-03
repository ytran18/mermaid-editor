import React from "react";

const Message = (props) => {

    const { status } = props;

    const color = status ? { color: '#138D75 ' } : { color: '#E74C3C' };

    return (
        <div className="message">
            <div className="message-wrapper">
                <div className="" style={{color}}>{status ? `Copy successfully !` : `Copy failed !`}</div>
            </div>
        </div>
    );
};

export default Message;