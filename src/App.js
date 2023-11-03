import React, { useState, useRef, useEffect } from 'react';

import Mermaid from './components/mermaid';
import Editor from './components/editor';
import Message from './components/message';

import './App.css';

function App() {

    const [state, setState] = useState({
        code: ``,
        mode: 'mermaid',
        config: `{\n \t"theme": "default" \n}`,
        stateConnect: false,
        fileName: '',
        lang: 'en',
        isMobile: false,
        type: '',
        isShowCopyMessage: false,
        statusCopy: false,
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

    const handleTypeMermaid = (value) => {
        setState(prev => ({...prev, type: value}));
    };
    
    const handleCopyToClipboard = (isCopied) => {
        const status = isCopied === 'SUCCESS' ? true : false;
        setState(prev => ({...prev, isShowCopyMessage: true, statusCopy: status}));
    }

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
    const handleDownload = (type, notDownload) => {
        if (type === 'svg') {
            const svg = diagramRef.current.innerHTML;
            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            if(notDownload) return svg;
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
                    try {
                        let clipboardData = new ClipboardItem({ 'image/png': new Blob([dataURItoBlob(imgData)], { type: 'image/png' }) });
        
                        navigator.clipboard.write([clipboardData]).then(function() {
                            handleCopyToClipboard('SUCCESS');
                        });
                    } catch (err) {
                        handleCopyToClipboard('FAILED');
                    }
                }
            }
            return;
        }
    }

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

    useEffect(() => {
        if (state.isShowCopyMessage) {
            setTimeout(() => {
                setState(prev => ({...prev, isShowCopyMessage: false}));
            },1500);
        }
    },[state.isShowCopyMessage]);

    return (
        <>
            <div className="App">
                <div id='ace-editor' className='left-panel'>
                    <Editor
                        handleChangeCode={handleChangeCode}
                        handleDownload={handleDownload}
                        handleChangeMode={handleChangeMode}
                        handleChangeConfig={handleChangeConfig}
                        code={state.code}
                        config={state.config}
                        lang={state.lang}
                        handleTypeMermaid={handleTypeMermaid}
                    />
                </div>
                <div id="resizeHandler" className='resize-handler' />
                <div className='right-panel'>
                    <Mermaid
                        mode={state.mode}
                        code={state.code}
                        config={state.config}
                        ref={diagramRef}
                        fileName={state.fileName}
                        isMobile={state.isMobile}
                        type={state.type}
                    />
                </div>
            </div>
            {state.isShowCopyMessage && (
                <Message status={state.statusCopy}/>
            )}
        </>
    );
}

export default App;
