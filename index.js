const Web3 = require('web3');
const CursedWordV1 = require('./build/contracts/CursedWordV1.json');
const secrets = require('./the_poop.json');

const THE_SECRET_WORD = "smile";
const SEND_DEBUG_GUESS = false;


// ==== TEST public keys
// Fresh account address: 0xcbc4efe8CCf05a9435089e2F8F68622abBb7642e
// ==== END test keys

const init = async () => {
  // crash@!
  if (SEND_DEBUG_GUESS) { setTimeout(() => {throw new Error('no more pls');}, 4 * 1000); }

  console.log('Initializing connection to Ethereum blockchain...\n');
  // givenProvider would be metamask etc. in a browser
  const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8545");
  const THE_SECRET_WORD_HEX = web3.utils.utf8ToHex(THE_SECRET_WORD);

  // create a new account to interact with the contract
  const freshAccount = web3.eth.accounts.privateKeyToAccount(secrets.privateKey);
  web3.eth.accounts.wallet.add(freshAccount.privateKey);
  // Can send eth to this address via the local faucet
  console.log(`Private Key: ${freshAccount.privateKey}\nAddress: ${freshAccount.address}`);

  // list local accounts on this chain
  // const accounts = await web3.eth.getAccounts();
  // console.dir(accounts);

  const connectedContract = new web3.eth.Contract(
    CursedWordV1.abi,
    // Must update each time contract is deployed!
    '0x5FbDB2315678afecb367f032d93F642f64180aa3' // the deployed contract's address
  );

  console.log(connectedContract.methods);
  // console.log(connectedContract.events);


  connectedContract.events.GuessReceived()
    .on("connected", function(subscriptionId){
      console.log('\nConnected to event listener', subscriptionId);
    })
    .on('data', function(event){
      // console.log('DATA CALLBACK: ', event); // same results as the optional callback above
      // TODO: ensure is correct event
      const guessedWord = web3.utils.hexToUtf8(event.returnValues.wordGuessed);
      console.log('data callback ', event.returnValues.wordGuessed);
      console.log(`is ${guessedWord} the secret word? ${guessedWord == THE_SECRET_WORD}`);
      const responseCode = cursedWordGuessResponse(guessedWord);

      // Send guess data back to the contract

      connectedContract.methods.respond_to_guess(event.returnValues.guesser, event.returnValues.wordGuessed, responseCode).send({
        from: freshAccount.address,
        // gasPrice (optional - gas price in wei),
        // gas (optional - max gas limit)
        gas: 250_000, // TODO make sane idk
        value: 0, // value to xfer in wei
        // nonce (optional)
      });


      // returnValues: Result {
      //   '0': '0xcbc4efe8CCf05a9435089e2F8F68622abBb7642e',
      //   '1': '0x626c7565',
      //   guesser: '0xcbc4efe8CCf05a9435089e2F8F68622abBb7642e',
      //   wordGuessed: '0x626c7565'
      // },
    })
    .on('changed', function(event){
      console.log('?changed?');
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
     console.log('Event On Error');
    });


  setInterval(() => {
    console.log(`Current Balance `);
    web3.eth.getBalance(freshAccount.address).then(console.log);
  }, 1 * 5000);

  const accounts = await web3.eth.getAccounts();
  console.dir(accounts);

  if (SEND_DEBUG_GUESS) {
    // 1 second in, guess "belly"
    setTimeout(() => {
      const realString = "belly";
      const hexedString = web3.utils.utf8ToHex(realString);
      // TODO: bytes v bytes32 vs bytes1?
      const param = web3.eth.abi.encodeParameter('bytes32', hexedString);

      console.log(`Guessing ${realString}... aka... ${hexedString}... aka ${param}`);
      // Guess '43' as the number

      // const encoded = connectedContract.methods.attempt([hexedString]).encodeABI()

      // Set the data field on web3.eth.sendTransaction options as the encodeABI() result and it is the same as calling the contract method with contract.myMethod.send().

      connectedContract.methods.attempt(hexedString).send({
        from: freshAccount.address,
        // gasPrice (optional - gas price in wei),
        // gas (optional - max gas limit)
        gas: 250_000,
        value: 100, // value to xfer in wei
        // nonce (optional)
      });
      // myContract.methods.myMethod([param1[, param2[, ...]]]).send(options[, callback])
    }, 1 * 1000);
  }
};


init();

// TODO: Write unit tests!

// cursedWordGuessResponse('yljjl');

// End process and return terminal control in ~2 seconds
//

function cursedWordGuessResponse(guess) {
  console.log("Correct answer is " + THE_SECRET_WORD);
  let logMap = {
    "1": "_ ",
    "2": "Y ",
    "3": "G "
  };

  let responseArray = [];
  let remainingLetters = [];

  // record exact matches and remaining letters
  for(let i = 0; i < THE_SECRET_WORD.length; i++) {
    if (guess[i] === THE_SECRET_WORD[i]) {
      responseArray.push("3");
    } else {
      responseArray.push("1");
      remainingLetters.push(THE_SECRET_WORD[i]);
    }
  }

  // record "2" for letters in the word but in the wrong place
  for (let i = 0; i < guess.length; i++) {
    console.log(`i: ${i} -- ${remainingLetters.join("")}`);
    if (responseArray[i] !== "3" && remainingLetters.indexOf(guess[i]) >= 0) {
      console.log('A hit at index ' + remainingLetters.indexOf(guess[i]));
      responseArray[i] = "2";
      // remove this letter from the remaining letters array
      // splice(start, deleteCount)
      remainingLetters.splice(remainingLetters.indexOf(guess[i]), 1);
    }
  }

  console.log(guess + ": " + responseArray.join(" "));

  return parseInt(responseArray.join(""), 10);
}


