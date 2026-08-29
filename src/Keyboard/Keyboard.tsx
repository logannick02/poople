import "./Keyboard.css";
import { type Key } from "../types/Key";

const keyboard: Key[][] = [
  [
    { value: "Q", type: "letter" },
    { value: "W", type: "letter" },
    { value: "E", type: "letter" },
    { value: "R", type: "letter" },
    { value: "T", type: "letter" },
    { value: "Y", type: "letter" },
    { value: "U", type: "letter" },
    { value: "I", type: "letter" },
    { value: "O", type: "letter" },
    { value: "P", type: "letter" },
  ],
  [
    { value: "A", type: "letter" },
    { value: "S", type: "letter" },
    { value: "D", type: "letter" },
    { value: "F", type: "letter" },
    { value: "G", type: "letter" },
    { value: "H", type: "letter" },
    { value: "J", type: "letter" },
    { value: "K", type: "letter" },
    { value: "L", type: "letter" },
  ],
  [
    { value: "Enter", type: "enter" },
    { value: "Z", type: "letter" },
    { value: "X", type: "letter" },
    { value: "C", type: "letter" },
    { value: "V", type: "letter" },
    { value: "B", type: "letter" },
    { value: "N", type: "letter" },
    { value: "M", type: "letter" },
    { value: "⌫", type: "backspace" },
  ]
];

export const Keyboard = ({ onKeyClick }: { onKeyClick: (key: Key) => void }) => {
    return (
        <div className="keyboard">
            {keyboard.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {row.map((keyObj) => (
                        <button onClick={() => onKeyClick(keyObj)} className={`key ${keyObj.type}`} key={keyObj.value}>{keyObj.value}</button>
                    ))}
                </div>
            ))}
        </div>
    )
}