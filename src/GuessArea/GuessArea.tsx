import { useState, useEffect, Fragment, useRef} from "react";
import { checkLetter, isOneAway } from "../utils/Utils";
import { Keyboard } from '../Keyboard/Keyboard'
import { type Key } from "../types/Key";

import validAnswers from "../data/answers.json";

import "./GuessArea.css";

const VALID_SET = new Set(validAnswers);
const STORAGE_PREFIX = "poople";

const getStorageKey = (word: string) => `${STORAGE_PREFIX}-${word}`;

const loadSavedState = (word: string): { board: string[]; guessed: boolean } => {
    try {
        const raw = localStorage.getItem(getStorageKey(word));
        if (!raw) return { board: [], guessed: false };
        const parsed = JSON.parse(raw);
        return {
            board: Array.isArray(parsed.board) ? parsed.board : [],
            guessed: Boolean(parsed.guessed),
        };
    } catch {
        return { board: [], guessed: false };
    }
};


export const GuessArea = ({onUserWin, startWord}: {onUserWin: (results: string[]) => void, startWord: string }) => {
    const [board, setBoard] = useState<string[]>(() => loadSavedState(startWord).board);
    const [guess, setGuess] = useState(""); // current guess
    const [guessed, setGuessed] = useState<boolean>(() => loadSavedState(startWord).guessed); // boolean to determine if user got to POOP
    const [atTop, setAtTop] = useState(true); // see below
    const [atBottom, setAtBottom] = useState(false); // see below
    const [popupMsg, setPopupMsg] = useState("");

    const boardRef = useRef<HTMLDivElement>(null);
    const hasNotifiedWin = useRef(false);

    // reload board if word changes while user is solving the word / tab is open
    useEffect(() => {
        const saved = loadSavedState(startWord);
        setBoard(saved.board);
        setGuessed(saved.guessed);
        hasNotifiedWin.current = false;
    }, [startWord]);

    // rewrite storage data whenever board, guessed or startWord changes

    useEffect(() => {
        console.log("Saving:", board, guessed);
        try {
            localStorage.setItem(
                getStorageKey(startWord),
                JSON.stringify({ board, guessed })
            );
        } catch {
        }
    }, [board, guessed, startWord]);

    // notify that solved board has been recalled
    useEffect(() => {
        if (guessed && board.length > 0 && !hasNotifiedWin.current) {
            hasNotifiedWin.current = true;
            onUserWin(board);
        }
    }, [guessed, board, onUserWin]);


    // callback function prop for keyboard interaction
    const handleKeyboardClick = (key: Key) => {
        if (guessed) return;


        if (key.type === "enter") {
            if (guess.length === 4) {
                const previousWord = board[board.length - 1] || startWord;

                // verify it is one letter away (i.e stop to slop versus slot)
                if (guess !== previousWord && isOneAway(previousWord, guess)) {
                    // verify the word is in the list of approved words
                    if (VALID_SET.has(guess)) {
                        setBoard((prev) => [...prev, guess]);
                        
                        setTimeout(() => {
                            boardRef.current?.scrollTo({top: boardRef.current.scrollHeight, behavior: "smooth"});
                        }, 0)

                        if (guess === "POOP") {
                            setGuessed(true);
                            hasNotifiedWin.current = true;
                            onUserWin([...board, guess]); // pass results back to app
                        }
                    } else {
                        setPopupMsg("Invalid word.")
                    }
                } else {
                    setPopupMsg("Not one letter apart.");
                }

                
                // reset the guess regardless of if it's one away or not
                setGuess("");
            }
        } else if (key.type === "backspace") {
            setGuess((prev) => prev.slice(0, -1));
        } else {
            if (guess.length < 4) setGuess((prev) => prev + key.value);
        }
    }

    /* useEffect for handling the fade area for scroll section
        * dynamically sets state variables atTop and atBottom
        * these variables are used to assign CSS variables --at-top, --in-middle, and --at-bottom
        * to set the CSS mask
    */
    useEffect(() => {
        const board = boardRef.current;

        if (!board) return;

        const handleScroll = () => {
            if (board.scrollTop === 0) {
                setAtTop(true);
                setAtBottom(false);
            }
            else if (Math.abs(board.scrollHeight - board.clientHeight - board.scrollTop) < 1) {
                setAtBottom(true)
                setAtTop(false);
            } else {
                setAtBottom(false);
                setAtTop(false);
            }
        }

        board.addEventListener("scroll", handleScroll)

        return () => board.removeEventListener("scroll", handleScroll);
    }, []);

    /*
        * handles user input for guesses
    */
    useEffect(() => {
        const handleInput = (event: KeyboardEvent) => {
            // destructuring
            const {key} = event;
            
            // stop accepting user input
            if (guessed) {
                return;
            }


            if (key === 'Backspace') {
                /* LEARNING NOTES
                    * prev is used because if you were to do setGuess(guess), updates in quick succession
                    * will be overwritten
                */

                setGuess((prev) => prev.slice(0, -1));
            } else if (key === 'Enter') {
                if (guess.length === 4) {
                    const previousWord = board[board.length - 1] || startWord;
                    
                    // verify it is one letter away (i.e stop to slop versus slot)
                    if (guess !== previousWord && isOneAway(previousWord, guess)) {
                        // verify the word is in the list of approved words
                        if (VALID_SET.has(guess)) {
                            setBoard((prev) => [...prev, guess]);
                            
                            setTimeout(() => {
                                boardRef.current?.scrollTo({top: boardRef.current.scrollHeight, behavior: "smooth"});
                            }, 0)

                            if (guess === "POOP") { 
                                setGuessed(true);
                                hasNotifiedWin.current = true;
                                onUserWin([...board, guess]);
                            }
                        } else {
                            setPopupMsg("Invalid word.")
                        }
                    } else {
                        setPopupMsg("Not one letter apart.")
                    }

                    
                    // reset the guess regardless of if it's one away or not
                    setGuess("");
                }
            } else {
                if (/^[a-z]$/i.test(event.key)) {
                    if (guess.length < 4) {
                        setGuess((prev) => prev + key.toUpperCase());
                    }
                }
            }

        };

        window.addEventListener('keydown', handleInput);

        return () => window.removeEventListener('keydown', handleInput);
    }, [guess]);

    // flash the popupMsg for 2s
    useEffect(() => {
        if (popupMsg === "") return;

        const timer = setTimeout(() => {
            setPopupMsg("");
        }, 2000); 

        return () => clearTimeout(timer);
    }, [popupMsg])

    return (
        <div className="game-area">
            <p className="popup">{popupMsg}</p>
            {/*TODO - move this to its own component */}
            <div className="board-container">
                <div ref ={boardRef} className={`board ${(!atTop && !atBottom) ? "in-middle" : atBottom ? "at-bottom" : "at-top"}`}>
                    {/* start with the word of the day */}
                    <>
                        {[...startWord].map((letter, index) => (
                            <div key={index} className={`tile ${checkLetter(letter, index) ? "present" : "absent"}`}>{letter}</div>
                        ))}
                    </>
                    
                    {/* then the previous guesses */}
                    {board.map((word, wordIndex) => (
                        <Fragment key={wordIndex}>
                            {[...word].map((letter, index) => (
                                <div key={index} className={`tile ${checkLetter(letter, index) ? "present" : "absent"}`}>{letter}</div>
                            ))}
                        </Fragment>
                    ))}

                    {/* finally include the current guess */}
                    {!guessed &&
                        <>
                            <div className="tile">{guess[0] || ""}</div>
                            <div className="tile">{guess[1] || ""}</div>
                            <div className="tile">{guess[2] || ""}</div>
                            <div className="tile">{guess[3] || ""}</div>
                        </>
                    }
                </div>
            </div>
            
            <Keyboard onKeyClick={handleKeyboardClick}/>       
        </div>
    )
}



