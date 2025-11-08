import React from 'react';
import { useState, useEffect } from 'react';
import './app.css';

function App() {
    const [time, setTime] = useState(240); // 5 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [activeType, setActiveType] = useState('standard');

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer); // Cleanup on unmount
    }, [isRunning, time]);

    // Audio logic
    useEffect(() => {
        let audio;
        let timeout;
        if (time === 0) {
            audio = new Audio();
            audio.src = '/fit-to-print-timer/mp3/ringing_old_phone.mp3';
            audio.play();

            setIsRunning(false);
            if (activeType === 'frantic') {
                setTime(5); // Reset to 10 seconds for frantic
            } else if (activeType === 'standard') {
                setTime(240); // Reset to 4 minutes for standard
            } else if (activeType === 'relaxed') {
                setTime(300); // Reset to 5 minutes for relaxed
            }

            timeout = setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 5000);
        }
    }, [time]);

    return (
        <div id="app">
            <div id="title" style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: "#45AD68" }}>Fit</span>
                <span style={{ color: "#EB6618" }}>To</span>
                <span style={{ color: "#3B9438" }}>Print</span>
            </div>
            <div id="timer">
                <span id="time">{Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}</span>
            </div>
            <div id="control">
                {
                    isRunning ? (
                        <button
                            className='time-control sink-on-press'
                            id="pause"
                            onClick={e => {
                                let target = e.currentTarget;
                                target.classList.add('sinking');
                                setTimeout(() => target.classList.remove('sinking'), 1000);
                                setIsRunning(false);
                            }}
                        >PAUSE</button>
                    ) : (
                        <button
                            className='time-control sink-on-press'
                            id="start"
                            onClick={e => {
                                let target = e.currentTarget;
                                target.classList.add('sinking');
                                setTimeout(() => target.classList.remove('sinking'), 1000);
                                setIsRunning(true);
                            }}
                        >START</button>
                    )
                }
            </div>
            <div id="options">
                <button
                    className='option sink-on-press'
                    id='frantic'
                    onClick={e => {
                        let target = e.currentTarget;
                        target.classList.add('sinking');
                        setTimeout(() => target.classList.remove('sinking'), 1000);
                        setTime(5);
                        setActiveType('frantic');
                    }}
                    disabled={isRunning}
                >FRANTIC</button>
                <button
                    className='option sink-on-press'
                    id='standard'
                    onClick={e => {
                        let target = e.currentTarget;
                        target.classList.add('sinking');
                        setTimeout(() => target.classList.remove('sinking'), 1000);
                        setTime(240);
                        setActiveType('standard');
                    }}
                    disabled={isRunning}
                >STANDARD</button>
                <button
                    className='option sink-on-press'
                    id='relaxed'
                    onClick={e => {
                        let target = e.currentTarget;
                        target.classList.add('sinking');
                        setTimeout(() => target.classList.remove('sinking'), 1000);
                        setTime(300);
                        setActiveType('relaxed');
                    }}
                    disabled={isRunning}
                >RELAXED</button>
            </div>
        </div>
    );
}

export default App;