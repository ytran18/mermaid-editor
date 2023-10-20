import React from "react";

const Message = (props) => {

    const { handleDiscardChanges, handleCancel } = props;

    return (
        <div className="message">
            <div className="message-wrapper">
                <div className="">All changes will be lost !</div>
                <div className="btn">
                    <div 
                        className="btn-discard"
                        onClick={handleDiscardChanges}
                    >
                        Discard Changes
                    </div>
                    <div 
                        className="btn-cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;