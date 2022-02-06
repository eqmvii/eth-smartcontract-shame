pragma solidity >=0.8.0 <0.9.0;

// It's basic, but it really works!

import "hardhat/console.sol";

contract ExampleCoin {
   address public minter;

   mapping (address => uint) public balances;

   event Sent(address from, address to, uint amount);

   constructor() public {
      console.log(msg.sender);
      minter = msg.sender;
      }

   function mint(address receiver, uint amount) public {
      // require(msg.sender == minter);
      console.log("Receiving Address for mint: ", receiver);
      console.log("Amount minted: ", amount);

      balances[receiver] += amount;
   }

   function send(address receiver, uint amount) public {
      require(amount <= balances[msg.sender], "Insufficient balance.");
      balances[msg.sender] -= amount;
      balances[receiver] += amount;
      emit Sent(msg.sender, receiver, amount);
   }
}
