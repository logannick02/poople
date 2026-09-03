import { useState } from 'react'
import { GuessArea } from './GuessArea/GuessArea'
import { checkLetter } from './utils/Utils';
import { Analytics } from "@vercel/analytics/next"
import dailyWord from "./data/dailyWord.json";

import './App.css'

function App() {
  const [results, setResults] = useState([] as string[]); // final board values
  const [startWord] = useState(dailyWord.word);
  const [best] = useState(dailyWord.bestPathLength);
  const [dayCount] = useState(1);
  const [copyText, setCopyText] = useState("");

  const handleResults = (returnValue: string[]) => {
    setResults(returnValue);

    // set the results copy text
    let tmp = `Poople #${dayCount} ${returnValue.length}/${best}`;
    tmp += "\n";

    for (let i = 0; i < startWord.length; i++) {
      if (checkLetter(startWord[i], i)) {
        tmp += "🟫";
      } else {
          tmp += "⬜";
      }
    }

    tmp += "\n";

    for (let i = 0; i < returnValue.length; i++) {
      const word = returnValue[i];

      for (let j = 0; j < word.length; j++) {
        if (checkLetter(word[j], j)) {
          tmp += "🟫";
        } else {
          tmp += "⬜";
        }
      }

      tmp += "\n";
    }

    tmp += "Play at https://lcaraway-poople.vercel.app/"
    tmp += '\n';

    setCopyText(tmp);
  }

  const handleCopy = async () => {
    if (results.length === 0) return;

    try {
      await navigator.clipboard.writeText(copyText);
    } catch (err) {
      console.error("Failed to copy results: ", err);
    }

  };

  return (
    <div className="app-area">
      <Analytics />
      
      <header>
        <h1><span style={{color: "#7A5901"}}>Poop</span>le</h1>
        <span>#{dayCount}: {startWord}</span>
      </header>
      
      <hr/>

      <main>
        <GuessArea startWord={startWord} onUserWin={handleResults}/>
      </main>

      <footer>
          <ul>
            <li onClick={handleCopy}>Copy results</li>
          </ul>
      </footer>
    </div>
  )
}

export default App
