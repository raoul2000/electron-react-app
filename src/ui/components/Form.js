import React from "react";

const Form = () => {
    const handleClick = () => window.sendAsyncMessage('piiing');
    return (
        <div>
            <h1>Hello</h1>
            <button onClick={handleClick}>send message</button>
        </div>
    );
};

export default Form;

