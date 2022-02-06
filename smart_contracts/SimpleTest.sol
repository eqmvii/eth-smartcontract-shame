pragma solidity >=0.8.0 <0.9.0;

contract SimpleTest {

   string public message;

   constructor(string memory initMessage) public {
      message = initMessage;
   }

   function update(string memory newMessage) public {
      message = newMessage;
      }
}
