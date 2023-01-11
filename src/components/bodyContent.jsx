import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';

const BodyContent =  forwardRef((props, ref) => {
    const menuContent = document.createElement('div');
        menuContent.classList.add('custom-select-menu-block');

    useImperativeHandle(ref, () =>({
        ele: menuContent
    }));

    
    return (
        ReactDOM.createPortal(props.children, document.body)
    );
});



export default BodyContent;