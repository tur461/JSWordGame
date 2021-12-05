/*
••••••••••••••••••••••••••••••••••••••••••••••••
Copyright (C) 2021 Codesse. All rights reserved.
••••••••••••••••••••••••••••••••••••••••••••••••
*/

WordGame = function() {

const MAX_LEN = 100; // assumed length
const TOTAL_CHAR_COUNT = 26;
const MAX_SCORE_LIST_SIZE = 10;
const SEED = "abcdefghijklmnopqrstuvwxyz";

let scoredWordList = [];
let wordList = [];
let scoreList = [];
let baseDict = {};
// I assume this js file is imported into html, I used live-server (npm package) to test this code.
let pathToWordlistFile = 'https://raw.githubusercontent.com/tur461/JSWordGame/main/wordlist.txt';

// this.print = _ => {
//     console.log('baseDict', {...baseDict});
//     console.log('scoredWordList', {...scoredWordList});
//     console.log('scoreList', {...scoreList});
// }

function createWordListFromFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
            if(rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                wordList = allText.replace(/\s\s+/g, ' ').split(/\r\n|\n\r|\n|\r/);
            }
    }
    rawFile.send(null);
}

function generateRandomString () {
    let randStr = "";

    for (let i = 0; i < MAX_LEN; i++)
        randStr += SEED.charAt(Math.floor(Math.random() * TOTAL_CHAR_COUNT));
    return randStr;
}

function prepareBaseDictionary (str) {
    let tmp = {};
    Array.from(str).forEach(c => {
        if(tmp[c]) {
            tmp[c] += 1;
        }
        else tmp[c] = 1;
    })
    return tmp;
}

function isWordValid (word) {
    // check if the word has valid characters and count. 
    Array.from(word).forEach(c => {
        if(!baseDict[c]) return !1; // character not in base string or count equal to 0!
        --baseDict[c]; // else decrease the count of the character.
    });
    // now check the word is in wordlist 
    if(wordList.indexOf(word) === -1) return !1;
    //console.log('word is valid');
    return !0; 
}

function storeIntoScoreList (word) {
    function getPos() {
        if(scoreList.length === MAX_SCORE_LIST_SIZE) {
            return scoreList.findIndex(s => s === Math.min(...scoreList));
        }
        return -1;
    }

    if(scoredWordList.filter(sw => sw.word === word).length) {
        //console.log('[duplicate] word is already stored.');
        return; // word already in the list!  
    }

    let t = {
        word: word,
        score: word.length,
        position: getPos()
    }

    if(t.position === -1) {
        t.position = scoreList.length,
        scoredWordList.push(t);
        scoreList.push(word.length);
    } else {
        scoredWordList[t.position] = t;
    }
    scoreList[t.position] = word.length;
    //console.log('word: '+ word+' stored at position: '+t.position);
}

function getWordOrScoreAtPosition (position, isWord = !0) {
    let t = scoredWordList.filter(t => t.position == position);
     if(t.length) {
	if(isWord) return t[0].word;
	else return t[0].score;
     }
     return null;
}

/*
Submit a word on behalf of a player. A word is accepted if its letters are contained in the base string used to construct the game AND if it is in the word list provided: wordlist.txt.
	
If the word is accepted and its score is high enough, the submission should be added to the high score list. If there are multiple submissions with the same score, all are accepted, BUT the first submission with that score should rank higher.
	
A word can only appear ONCE in the high score list. If the word is already present in the high score list the submission should be rejected.
	
@parameter word. The player's submission to the game. All submissions may be assumed to be lowercase and contain no whitespace or special characters.
*/	
 this.submitWord = function (word) {
    baseDict = prepareBaseDictionary(generateRandomString());
    
    !wordList.length && createWordListFromFile(pathToWordlistFile);
    
    if(isWordValid(word))
        storeIntoScoreList(word);
//     else
//         console.log('word is invalid!');
 };
 
/*
Return word entry at given position in the high score list, 0 being the highest (best score) and 9 the lowest. You may assume that this method will never be called with position > 9.

@parameter position Index position in high score list
@return the word entry at the given position in the high score list, or null if there is no entry at the position requested
*/
 this.getWordEntryAtPosition = function (position) {
    return getWordOrScoreAtPosition(position);
 };
 
/*
Return the score at the given position in the high score list, 0 being the highest (best score) and 9 the lowest. You may assume that this method will never be called with position > 9.

What is your favourite color? Please put your answer in your submission (this is for testing if you have read the comments).
 
@parameter position Index position in high score list
@return the score at the given position in the high score list, or null if there is no entry at the position requested
*/
 this.getScoreAtPosition = function (position) {
    return getWordOrScoreAtPosition(position, !1);
 };
 
};
