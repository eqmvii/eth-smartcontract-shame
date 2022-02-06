pragma solidity >=0.8.0 <0.9.0;

// hahaha this is all so stupid

import "hardhat/console.sol";

contract ExampleCoin {
   address public minter;

   mapping (address => uint) public balances;

   event Sent(address from, address to, uint amount);

   constructor() public {
      minter = msg.sender;
      }

   function mint(address rcvr, uint amount) public {
      // require(msg.sender == minter);
      console.log("Receiving Address for mint: ", rcvr);
      console.log("Amount minted: ", amount);

      balances[rcvr] += amount;
   }

  //  function send(address received, uint amount) public {
  //     require(amount <= balances[msg.sender], "Insufficient balance.");
  //     balances[msg.sender] -= amount;
  //     balances[rcvr] += amount;
  //     emit Sent(msg.sender, rcvr, amount);
  //  }
}
