// SPDX-License-Identifier: GPL-3.0

// https://docs.soliditylang.org/en/v0.8.11/control-structures.html#creating-contracts-via-new
// example from the docs, modified slightly to eximaine on local hardhat chain
import "hardhat/console.sol";

pragma solidity >=0.7.0 <0.9.0;
contract ChildContract {
    uint public x;
    constructor(uint a) payable {
        x = a;
        console.log("Child has been built with", a);
    }
}

contract ContractCreator {
    ChildContract d = new ChildContract(4); // will be executed as part of C's constructor

    function createChildContract(uint arg) public {
        console.log("createChildContract called");
        ChildContract newCC = new ChildContract(arg);
        newCC.x();
    }

    function createAndEndowChildContract(uint arg, uint amount) public payable {
        // Send ether along with the creation
        ChildContract newCC = new ChildContract{value: amount}(arg);
        newCC.x();
    }
}
