import { useState, useEffect, Fragment, useRef} from "react";
import { checkLetter, isOneAway } from "../utils/Utils";
import { Keyboard } from '../Keyboard/Keyboard'
import { type Key } from "../types/Key";

import validAnswers from "../data/answers.json";

import "./GuessArea.css";

const VALID_SET = new Set(validAnswers);

export const GuessArea = ({onUserWin, startWord}: {onUserWin: (results: string[]) => void, startWord: string }) => {
    const [board, setBoard] = useState([] as string[]); // all guesses
    const [guess, setGuess] = useState(""); // current guess
    const [guessed, setGuessed] = useState(false); // boolean to determine if user got to POOP
    const [atTop, setAtTop] = useState(true); // see below
    const [atBottom, setAtBottom] = useState(false); // see below

    const boardRef = useRef<HTMLDivElement>(null);

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
                            onUserWin([...board, guess]); // pass results back to app
                        }
                    }
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
                                onUserWin([...board, guess]);
                            }
                        }
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


    return (
        <div className="game-area">
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



