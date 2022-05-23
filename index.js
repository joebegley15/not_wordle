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
  addColoredGuess(guess) {
    const answerArr = this.answer.split("");
    const coloredGuess = guess.split("").map((letter, i) => {
      const upperCaseLetter = letter.toUpperCase();
      if (upperCaseLetter === answerArr[i]) {
        return [upperCaseLetter, "green"];
      } else if (answerArr.includes(letter)) {
        return [upperCaseLetter, "yellow"];
      }
      return [upperCaseLetter, "grey"];
    });
    this.coloredGuesses.push(coloredGuess);
  }
  getColoredGuesses() {
    return this.coloredGuesses;
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
      newGame.addColoredGuess(guess);
      newGame.setGuess(guess.toLowerCase());
    } else if (guess.length !== 5) {
      console.log(chalk.red("Word should be five letters long."));
    } else {
      console.log(chalk.red("invalid word. please try again."));
    }
    newGame.getColoredGuesses().forEach((guess) => {
      const line = guess.reduce((str, element) => {
        if (element[1] === "yellow") {
          return str + chalk.yellow(element[0]);
        } else if (element[1] === "green") {
          return str + chalk.green(element[0]);
        } else {
          return str + element[0];
        }
      }, "");
      console.log(line);
    });
  }
}

playGame();
