import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import snippets from './snippets.json';
import ResultsGraph from './components/ResultsGraph';
import './App.css';

const languages = Object.keys(snippets);
const DISPLAY_WINDOW_CHARS = 80;
const CURSOR_OFFSET = 30;

const App = () => {
    const [language, setLanguage] = useState(languages[0]);
    const [sourceText, setSourceText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [testStatus, setTestStatus] = useState('pending'); 
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, errors: 0 });
    const [startTime, setStartTime] = useState(null);
    const [wpmHistory, setWpmHistory] = useState([]);
    const [errorHistory, setErrorHistory] = useState([]);
    const [finalStats, setFinalStats] = useState(null);
    
    const inputRef = useRef(null);
    const lastGraphPointTime = useRef(0);
    const errorCountRef = useRef(0);

    useEffect(() => {
        if (testStatus === 'active') {
            inputRef.current?.focus();
        }
    }, [testStatus]);

    useEffect(() => {
        let timer;
        if (testStatus === 'active' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && testStatus === 'active') {
            endTest();
        }
        return () => clearInterval(timer);
    }, [testStatus, timeLeft]);

    useEffect(() => {
        if (!startTime) return;

        const elapsedTime = (Date.now() - startTime) / 1000;
        if (elapsedTime === 0) return;

        let correctChars = 0;
        const typedSource = sourceText.substring(0, userInput.length);
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === typedSource[i]) {
                correctChars++;
            }
        }
        
        const wpm = Math.round((correctChars / 5) / (elapsedTime / 60));
        const accuracy = (userInput.length > 0 ? (correctChars / userInput.length) * 100 : 0);

        setStats({ wpm, accuracy: accuracy.toFixed(1), errors: errorCountRef.current });
        
        const now = Date.now();
        if (now - lastGraphPointTime.current > 2000 && userInput.length > 0) {
            setWpmHistory(prev => [...prev, wpm]);
            setErrorHistory(prev => [...prev, errorCountRef.current]);
            lastGraphPointTime.current = now;
        }

    }, [userInput, sourceText, startTime]);

    const startTest = () => {
        const snippetBank = snippets[language];
        const randomIndex = Math.floor(Math.random() * snippetBank.length);
        const snippet = snippetBank[randomIndex].code;

        setSourceText(snippet);
        setUserInput('');
        setStats({ wpm: 0, accuracy: 0, errors: 0 });
        setTimeLeft(60);
        setWpmHistory([]);
        setErrorHistory([]);
        setFinalStats(null);
        errorCountRef.current = 0;
        lastGraphPointTime.current = Date.now();
        setTestStatus('active');
        setStartTime(Date.now());
    };

    const endTest = () => {
        setTestStatus('finished');
        
        const totalChars = userInput.length;
        let correctChars = 0;
        for (let i = 0; i < totalChars; i++) {
            if (userInput[i] === sourceText[i]) {
                correctChars++;
            }
        }

        const elapsedTime = (Date.now() - startTime) / 1000;
        const rawWpm = Math.round((totalChars / 5) / (elapsedTime / 60));
        
        setFinalStats({
            wpm: stats.wpm,
            rawWpm: rawWpm,
            accuracy: stats.accuracy,
            correctChars: correctChars,
            incorrectChars: errorCountRef.current,
            language: language,
            duration: 60,
        });
    };
    
    const tryAgain = () => {
        setTestStatus('pending');
    };

    const handleKeyDown = (e) => {
        if (testStatus !== 'active') return;

        e.preventDefault();
        const { key } = e;

        if (key === 'Backspace') {
            setUserInput((prev) => prev.slice(0, -1));
            return;
        }
        
        if (key.length === 1) {
            if (key !== sourceText[userInput.length]) {
                errorCountRef.current += 1;
            }
            setUserInput((prev) => {
                if (prev.length + 1 === sourceText.length) {
                    endTest();
                }
                return prev + key;
            });
        }
    };

    const characterDisplay = useMemo(() => {
        const displayWindowStart = Math.max(0, userInput.length - CURSOR_OFFSET);
        const displayWindowEnd = displayWindowStart + DISPLAY_WINDOW_CHARS;
        const textWindow = sourceText.slice(displayWindowStart, displayWindowEnd);

        return textWindow.split('').map((char, index) => {
            const globalIndex = displayWindowStart + index;
            let charClass = '';

            if (globalIndex < userInput.length) {
                charClass = char === userInput[globalIndex] ? 'correct' : 'incorrect';
            } else if (globalIndex === userInput.length) {
                charClass = 'cursor';
            } else {
                charClass = 'untyped';
            }
            
            if (char === ' ') return <span key={globalIndex} className={charClass}>&nbsp;</span>;
            if (char === '\n') return <span key={globalIndex} className={`${charClass} newline-char`}>↵</span>;

            return <span key={globalIndex} className={charClass}>{char}</span>;
        });
    }, [userInput, sourceText]);

    const handleAreaClick = () => {
        if (testStatus === 'active') {
            inputRef.current?.focus();
        }
    }

    return (
        <div className="app-container">
            <header>
                <h1>codetyp</h1>
                <p>Test your coding speed and accuracy</p>
            </header>

            {testStatus === 'active' && (
                <div className="stats-bar">
                    <div className="stat"><span>WPM:</span> {stats.wpm}</div>
                    <div className="stat"><span>Time:</span> {timeLeft}s</div>
                    <div className="stat"><span>Acc:</span> {stats.accuracy}%</div>
                </div>
            )}

            <main className="typing-area">
                {testStatus === 'pending' && (
                    <div className="setup-panel">
                        <div className="language-selector">
                            <span>Language:</span>
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    className={language === lang ? 'active' : ''}
                                    onClick={() => setLanguage(lang)}
                                    disabled={testStatus === 'active'}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <button className="start-button" onClick={startTest}>Start Typing</button>
                    </div>
                )}

                {testStatus === 'active' && (
                    <div className="code-display-wrapper" onClick={handleAreaClick}>
                        <div className="code-display">{characterDisplay}</div>
                        <textarea
                            className="code-input"
                            ref={inputRef}
                            onKeyDown={handleKeyDown}
                            value=""
                            readOnly
                        />
                    </div>
                )}

                {testStatus === 'finished' && finalStats && (
                    <div className="results-overlay">
                        <div className="results-card">
                            <div className="results-primary-stats">
                                <div className="stat-group">
                                    <div className="stat-label">wpm</div>
                                    <div className="stat-value">{finalStats.wpm}</div>
                                </div>
                                <div className="stat-group">
                                    <div className="stat-label">acc</div>
                                    <div className="stat-value">{finalStats.accuracy}%</div>
                                </div>
                            </div>
                            <div className="results-graph-container">
                                <ResultsGraph wpmHistory={wpmHistory} errorHistory={errorHistory} />
                            </div>
                            <div className="results-secondary-stats">
                                <div className="stat-group-small">
                                    <div className="stat-label-small">test type</div>
                                    <div className="stat-value-small">{finalStats.language} {finalStats.duration}s</div>
                                </div>
                                <div className="stat-group-small">
                                    <div className="stat-label-small">raw</div>
                                    <div className="stat-value-small">{finalStats.rawWpm}</div>
                                </div>
                                <div className="stat-group-small">
                                    <div className="stat-label-small">characters</div>
                                    <div className="stat-value-small">{finalStats.correctChars}/{finalStats.incorrectChars}</div>
                                </div>
                                <div className="stat-group-small">
                                    <div className="stat-label-small">time</div>
                                    <div className="stat-value-small">{finalStats.duration}s</div>
                                </div>
                            </div>
                             <div className="results-actions">
                                <button className="start-button" onClick={tryAgain}>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {testStatus === 'pending' && (<footer>
                <p>Created by <a href="https://github.com/manasvihow" target="_blank" rel="noopener noreferrer">Manasvi</a></p>
            </footer>)}
        </div>
    );
};

export default App;
