pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

// CursedWord - public hald of the "Guess the 5 letter word" Blockchain Game

import "hardhat/console.sol";

// TODO: What is the gas implication of saving this on-chain in the smart contract. Are the emitted events sufficient?
struct GuessInfo {
  address guesser;
  bytes guess;
  // TODO: time of guess
}

contract CursedWordV1 {
  // TODO game reset mechanics?
  bytes32 secretWordHash; // TODO: private?
  GuessInfo[] public guessList; // TODO: way too expensive to store all guesses in an array?
  address winner;
  bool gameIsActive;

  // adding indexed here to maybe fix logging
  event GuessReceived(address guesser, bytes wordGuessed);
  event GuessResult(address guesser, bytes wordGuessed, uint16 result);

  // TODO: Remove word from constructor
  // bytes, not string, for simpler access to hashing
  constructor(bytes memory firstWord) {
    // TODO: Don't store the hash of the word, since that is probably brute forceable
    secretWordHash = keccak256(firstWord);

    gameIsActive = true;
  }

  function attempt(bytes memory guess) payable public {
    require(gameIsActive == true, "Game has ended. Winner has won. Stop playing.");
    // TODO: require minimum message value for a guess?
    // TODO just record the guess and emit the event.

    // Hash the guess, to avoid the issue with comparing a memory and storage string
    // if (keccak256(guess) == secretWordHash) {
    //   console.log("The word was guessed!");
    //   winner = msg.sender;
    // } else {
    //   console.log("WRONG WROD GUESSED");
    // }

    guessList.push(GuessInfo(msg.sender, guess));

    console.log("Number of Guesses: ", guessList.length);

    emit GuessReceived(msg.sender, guess);
  }

  // TODO function for Wordoracle to call
  function respond_to_guess(address guesser, bytes memory wordGuessed, uint16 response) public {
    // TODO: Restrict to Wordoracle address

    console.log("Response received: ", response);

    if (response == 33333) {
      winner = guesser;
      console.log("The word was guessed!");
      gameIsActive = false;
    }

    // event GuessResult(address guesser, bytes wordGuessed, uint8 result);

    emit GuessResult(guesser, wordGuessed, response);
  }

  function claim_riches() public payable {
    // do something but only if the word was guessed
    if (msg.sender == winner) {
      // TODO better send method
      bool sent = payable(msg.sender).send(address(this).balance);
      require(sent, "Failed to send Ether");
      console.log("Was it sent?", sent);
    } else {
      console.log("You are not the winner and you cannot have all the money.");
    }
  }

  // TODO: More complex, but recommended, method of sending?
  //   function sendViaCall(address payable _to) public payable {
  //     // Call returns a boolean value indicating success or failure.
  //     // This is the current recommended method to use.
  //     (bool sent, bytes memory data) = _to.call{value: msg.value}("");
  //     require(sent, "Failed to send Ether");
  // }
}
