import React, { useState, useRef, useEffect } from 'react';

import Mermaid from './components/mermaid';
import Editor from './components/editor';
import Message from './components/Message';

import './App.css';

function App() {

    const [state, setState] = useState({
        code: ``,
        mode: 'mermaid',
        config: `{\n \t"theme": "default" \n}`,
        isAutoSave: false,
        isClose: false,
        isSave: false,
        isSaveChange: false,
        isCloseChange: false,
        stateConnect: false,
        fileName: '',
        isVisibleMessage: false,
        savedCode: ``,
        saveConfig: ``,
    });

    const diagramRef = useRef();

    const handleChangeCode = (newCode) => {
        setState(prev => ({...prev, code: newCode}));
    };

    const handleChangeMode = (mode) => {
        setState(prev => ({...prev, mode: mode}));
    };

    const handleChangeConfig = (config) => {
        setState(prev => ({...prev, config: config}));
    };
    

    const dataURItoBlob = (dataURI) => {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var uint8Array = new Uint8Array(arrayBuffer);
      
        for (var i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
      
        return new Blob([arrayBuffer], { type: mimeString });
    }

    // handle download mermaid
    const handleDownload = (type) => {
        if (type === 'svg') {
            const svg = diagramRef.current.innerHTML;
            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'mermaid.svg';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            return;
        };

        if (type === 'png' || type === 'clipboard') {
            const svgContainer = document.querySelector('svg[id^="mermaid-"]');
            const canvas = document.createElement('canvas');

            const viewBox = svgContainer.getAttribute('viewBox').split(' ');
            const w = parseFloat(viewBox[2]);
            const h = parseFloat(viewBox[3]);

            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d');

            const image = new Image();
            image.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgContainer));
            image.onload = function () {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imgData = canvas.toDataURL('image/png');

                if (type === 'png') {
                    const a = document.createElement('a');
                    a.href = imgData;
                    a.download = 'mermaid.png';
                    document.body.appendChild(a);
                    a.click();
                }

                if (type === 'clipboard') {
                    let clipboardData = new ClipboardItem({ 'image/png': new Blob([dataURItoBlob(imgData)], { type: 'image/png' }) });
    
                    navigator.clipboard.write([clipboardData]).then(function() {
                        alert('Copied to clipboard!');
                    });
                }
            }
            return;
        }

    }

    // handle contact from pms to mermaid 
    const handleSave = () => {
        setState(prev => ({
            ...prev, 
            isSave: true, 
            isSaveChange: 
            !prev.isSaveChange,
            savedCode: state.code,
            saveConfig: state.config,
        }));
    };

    const handleExit = () => {
        if ((state.code === state.savedCode && state.config === state.saveConfig) || state.isAutoSave) {
            setState(prev => ({...prev, isClose: true, isCloseChange: !prev.isCloseChange, isVisibleMessage: false}));
            return;
        } 
        setState(prev => ({...prev, isVisibleMessage: true}));
    };

    const handleCLoseBtn = () => {
        setState(prev => ({...prev, isClose: true, isCloseChange: !prev.isCloseChange, isVisibleMessage: false}));
    }

    const handleDiscardChanges = () => {
        setState(prev => ({...prev, isClose: true, isCloseChange: !prev.isCloseChange, isVisibleMessage: false}));
    }

    const handleCancel = () => {
        setState(prev => ({...prev, isVisibleMessage: false}));
    };

    const handleAutoSave = (event) => {
        setState(prev => ({...prev, isAutoSave: event.target.checked}));
    };

    const handleMessage = () => {
        const data = {
            type: 'mermaid',
            isClose: state.isClose,
            isSave: state.isSave,
            code: state.code,
            config: state.config,
            isAutoSave: state.isAutoSave,
            state: state.stateConnect ? 'CONNECTED' : 'CONNECTING',
        }

        window.parent.postMessage(JSON.stringify(data), "*");
    };

    useEffect(() => {
        handleMessage();
    },[state.isSaveChange, state.isCloseChange, state.stateConnect]);

    useEffect(() => {
        if (state.isAutoSave) {
            const interval = setInterval(() => {
                handleMessage();
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    },[state.isAutoSave])

    useEffect(() => {
        const handleIframeMessage = (event) => {
            let parentData;
            let content;
            if (event.origin !== window.location.origin) {
                parentData = JSON.parse(event?.data);
                if (parentData?.data?.content) {
                    content = JSON.parse(parentData?.data?.content);
                }
                setState(prev => ({
                    ...prev, 
                    fileName: parentData?.data?.name, 
                    stateConnect: true,
                    code: content?.data, 
                    config: content?.config || `{\n \t"theme": "default" \n}`,
                    savedCode: content?.data,
                    saveConfig: content?.config || `{\n \t"theme": "default" \n}`,
                }));
            };
        };
      
        window.addEventListener('message', handleIframeMessage);
      
        return () => {
            window.removeEventListener('message', handleIframeMessage);
        };
    },[])

    useEffect(() => {
        const resizer = document.getElementById('resizeHandler');
        const element = document.getElementById('ace-editor');
        if (!resizer || !element) {
            return;
        }

        const resize = (e) => {
            const newWidth = e.pageX - element.getBoundingClientRect().left;
            if (newWidth > 50) {
                element.style.width = `${newWidth}px`;
            }
        };
        const stopResize = () => {
            window.removeEventListener('mousemove', resize);
        };

        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        });
    }, []);

    return (
        <div className="App">
            <div id='ace-editor' className='left-panel'>
                <Editor 
                    handleChangeCode={handleChangeCode}
                    handleDownload={handleDownload}
                    handleChangeMode={handleChangeMode}
                    handleChangeConfig={handleChangeConfig}
                    code={state.code}
                    config={state.config}
                />
            </div>
            <div id="resizeHandler" className='resize-handler' />
            <div className='right-panel'>
                <Mermaid 
                    mode={state.mode}
                    code={state.code} 
                    config={state.config}
                    ref={diagramRef}
                    handleSave={handleSave}
                    handleExit={handleExit}
                    handleAutoSave={handleAutoSave}
                    isAutoSave={state.isAutoSave}
                    fileName={state.fileName}
                    hasChanged={state.hasChanged}
                    handleCLoseBtn={handleCLoseBtn}
                />
            </div>
            {state.isVisibleMessage  && (
                <Message 
                    handleDiscardChanges={handleDiscardChanges}
                    handleCancel={handleCancel}
                />
            )}
        </div>
    );
}

export default App;
