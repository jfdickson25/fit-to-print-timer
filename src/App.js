import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './app.css';

function App() {
    const [time, setTime] = useState(240); // 5 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [activeType, setActiveType] = useState('standard');
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current === null) {
            audioRef.current = new Audio('/fit-to-print-timer/mp3/ringing_old_phone.mp3');
            audioRef.current.load();
        }
    }, []);

    const handleStart = () => {
        setIsRunning(true);
        // Optional: unlock audio for iOS Safari
        audioRef.current.play().then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }).catch(() => {});
    };

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

    // 🔹 EFFECT 1: Watch for time === 0 → play sound
    useEffect(() => {
        if (time !== 0) return;

        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(err => console.log("Audio blocked:", err));
        }

        // Stop ringing after 5s
        setTimeout(() => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }, 5000);

    }, [time]);

    // 🔹 EFFECT 2: Reset timer *after* zero logic fires
    useEffect(() => {
        if (time !== 0) return;

        // Reset after zero logic finishes
        if (activeType === 'frantic') {
            setTime(180);
        } else if (activeType === 'standard') {
            setTime(240);
        } else if (activeType === 'relaxed') {
            setTime(300);
        }

        setIsRunning(false);

    }, [time, activeType]);

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
                                handleStart();
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
                        setTime(180);
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