/* checkLetter: takes in a letter and its corresponding index
    * if it matches a letter in POOP at the same index, it returns true
    * otherwise, it returns false
    * i.e (word is PORT, checkLetter("P", 0) will return true)
*/

export const checkLetter = (letter: string, index: number) => {
    switch (index) {
        case 0:
            if (letter === "P") {
                return true;
            }

            return false;
        case 1: case 2:
            if (letter === "O") {
                return true;
            }

            return false;
        case 3:
            if (letter === "P") {
                return true;
            }

            return false;
        default:
            console.log("invalid index")
    }
}

/*  isOneAway: checks if two words are within one letter
        * if there is more than one difference, it returns false
        * otherwise returns true
*/
export const isOneAway = (start: string, guess: string) => {
    let differences = 0;
    
    for (let i = 0; i < start.length; i++) {
        if (start[i] !== guess[i]) {
            differences++;
        }

        if (differences > 1) {
            return false
        }
    }

    return true;
}