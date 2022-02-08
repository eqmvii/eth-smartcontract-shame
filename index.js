const Web3 = require('web3');
const ProtoGuesser = require('./build/contracts/ProtoGuesser.json');
const secrets = require('./the_poop.json');

// ==== TEST public keys
// Fresh account address: 0xcbc4efe8CCf05a9435089e2F8F68622abBb7642e
// ==== END test keys

const init = async () => {
  console.log('Initializing connection to Ethereum blockchain...\n');
  // givenProvider would be metamask etc. in a browser
  const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8545");
  // be more explicity about websocket??
  web3.setProvider(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));

  // create a new account to interact with the contract
  // const freshAccount = web3.eth.accounts.create();
  const freshAccount = web3.eth.accounts.privateKeyToAccount(secrets.privateKey);
  // Can send eth to this address via the local faucet
  console.log(`Private Key: ${freshAccount.privateKey}\nAddress: ${freshAccount.address}`);
  console.log(freshAccount);

  // need to do this to make the chain aware of the account, or... something?
  web3.eth.accounts.wallet.add(freshAccount.privateKey);

  // list local accounts on this chain
  // const accounts = await web3.eth.getAccounts();
  // console.dir(accounts);

  const networkId = await web3.eth.net.getId(); // 31337 locally

  // maybe required for events to work?
  // web3.eth.Contract.setProvider("ws://localhost:8545")

  const connectedContract = new web3.eth.Contract(
    ProtoGuesser.abi,
    // Must update each time contract is deployed!
    '0x5fbdb2315678afecb367f032d93f642f64180aa3' // the deployed contract's address
  );

  console.log(connectedContract.methods);
  console.log(connectedContract.events);

  // connectedContract.events.GuessReceived()
  connectedContract.events.allEvents((e) => { console.log('called back!') })
    // .on("connected", function(subscriptionId){
    //   console.log('connected to event listener', subscriptionId);
    // })
    // .on('data', function(event){
    //   console.log('DATA CALLBACK: ', event); // same results as the optional callback above
    // })
    // .on('changed', function(event){
    //   console.log('?changed?');
    // })
    // .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    //  console.log('on error');
    // });



  setInterval(() => {
    console.log(`Current Balance `);
    web3.eth.getBalance(freshAccount.address).then(console.log);
    // console.log('past events ');
    // getting past events seems to work here:
    // connectedContract.getPastEvents('allEvents').then(function(events){ console.log(events) // same results as the optional callback above
    //  });
  }, 1 * 5000);

  const accounts = await web3.eth.getAccounts();
  console.dir(accounts);

  // 15 seconds in, guess!
  setTimeout(() => {
    console.log('Guessing 43... ');
    // Guess '43' as the number
    connectedContract.methods.attempt([43]).send({
      from: freshAccount.address,
      // gasPrice (optional - gas price in wei),
      // gas (optional - max gas limit)
      gas: 250_000,
      value: 456, // value to xfer in wei
      // nonce (optional)
    });
    // myContract.methods.myMethod([param1[, param2[, ...]]]).send(options[, callback])
  }, 12 * 1000);
};


init();

// End process and return terminal control in ~2 seconds
setTimeout(() => {throw new Error('no more pls');}, 22 * 1000)


