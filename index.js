#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import inquirer from "inquirer";

class WordleGame {
  constructor() {
    this.answer = "";
    this.coloredGuesses = [];
    this.guesses = [];
    this.validWords = [];
    this.validWordsDict = {};
  }
  configureGuess(guess) {
    const answerArr = this.answer.split("");
    const coloredGuess = guess.split("").map((letter, i) => {
      if (letter === answerArr[i]) {
        return [letter, "green"];
      } else if (answerArr.includes(letter)) {
        return [letter, "yellow"];
      }
      return [letter, "grey"];
    });
    this.coloredGuesses.push(coloredGuess);
  }
  getGuesses() {
    return this.guesses;
  }
  getValidWords() {
    return this.validWords;
  }
  getValidWordsDict() {
    return this.validWordsDict;
  }
  setGuess(word) {
    this.guesses.push(word);
  }
  setValidWords(words) {
    this.validWords = words;
  }
  setValidWordsDict(words) {
    this.validWordsDict = words;
  }
  setAnswer() {
    this.answer =
      this.validWords[Math.floor(Math.random() * this.validWords.length)];
  }
  setGuess(guess) {
    this.guesses.push(guess);
  }
}

async function playGame() {
  const newGame = new WordleGame("START");
  const data = await fs.promises.readFile("./words.txt", "utf8");
  const validWordsDict = {};
  newGame.setValidWords(data.split("\n"));
  newGame.getValidWords().forEach((word) => {
    validWordsDict[word] = true;
  });
  newGame.setValidWordsDict(validWordsDict);
  newGame.setAnswer();
  while (newGame.getGuesses().length < 5) {
    const answer = await inquirer.prompt({
      name: "guess",
      type: "input",
      message: "Make a guess",
    });
    const { guess } = answer;
    if (
      newGame.getValidWordsDict()[guess.toLowerCase()] &&
      !newGame.getGuesses().includes(guess)
    ) {
      newGame.configureGuess(guess);
      newGame.setGuess(guess.toLowerCase());
    } else if (guess.length !== 5) {
      console.log(chalk.red("Word should be five letters long."));
    } else {
      console.log(chalk.red("invalid word. please try again."));
    }
    console.log(newGame.getGuesses());
  }
}

playGame();