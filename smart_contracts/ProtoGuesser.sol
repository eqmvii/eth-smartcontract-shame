pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

// ProtoGuesser - a rudimentary, insecure "guess the number" smart contract

import "hardhat/console.sol";

contract ProtoGuesser {
  uint secretNumber; // TODO: private?
  address winner;

  constructor(uint targetNumber) {
    secretNumber = targetNumber;
  }

  function attempt(uint guess) payable public {
    // TODO: require minimum message value for a guess?
    if (guess == secretNumber) {
      console.log("The number was guessed!");
      winner = msg.sender;
    } else {
      console.log("WRONG NUMBER GUESSED");
    }
  }

  function claim_riches() public payable {
    // do something but only if the number was guessed
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
