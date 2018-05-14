const { createConnection, Node } = require('./index');

const client = createConnection({
  host: "HOST_ADDRESS",
  port: 9332, // default litecoind port
  user: "USER_NAME",
  pass: "USER_PASS",
  timeout: 30000,
  ssl: false
});

const senderPK = "1ST_ACCOUNT_PRIVATE_KEY"; 
const senderAddress = "1ST_ACCOUNT_ADDRESS"; 
const alternativeSenderPK = "2ND_ACCOUNT_PRIVATE_KEY"; 
const destinationAddress = "2ND_ACCOUNT_ADDRESS"; 

const fee = 0.007; 
const amount = 0.02;

const node = new Node(client, senderPK);
node.sendTransaction(senderAddress, destinationAddress, amount, fee)
.then(txid => console.log('Transaction id:', txid));

// ------------------------------- OLD ----------------------------------

// const litecoin = require('litecoin');

// const client = new litecoin.Client({
//   host: "HOST_ADDRESS",
//   port: 9332, // default litecoind port
//   user: "USER_NAME",
//   pass: "USER_PASS",
//   timeout: 30000,
//   ssl: false
// });

// MAIN NET
// private keys
// const account1privkey = "1ST_ACCOUNT_PRIVATE_KEY"; 
// const account2privkey = "2ND_ACCOUNT_PRIVATE_KEY"; 

// address
// const account1 = "1ST_ACCOUNT_ADDRESS"; 
// const account2 = "2ND_ACCOUNT_ADDRESS"; 
// -----

// const fee = 0.007; 
// const amount = 0.02; // amount to be sent

// sendTransaction(account2, amount, account1, account1privkey, fee);

// function sendTransaction(recipient, amount, sender, senderPrivateKey) {
// 	const promise = new Promise(function(resolve, reject) {
// 		//checking balance
// 		client.listReceivedByAddress((err, accounts)=>{
// 		    if (err) {
// 		        reject(err);
// 		    }

// 			let hasBalance = false;
// 			let balance = 0;
// 		    for (i = 0; i < accounts.length; i++) {
// 		    	if (accounts[i].address == sender && (accounts[i].amount >= amount + fee)) {
// 					balance = accounts[i].amount;
// 		    		hasBalance = true;
// 		    	}
// 		    } 

// 		    if (hasBalance) {
// 		    	resolve(balance);
// 		    } else {
// 				reject("not enought funds");
// 			}		    
// 		});            
// 	});
	
// 	promise.then((balance) => new Promise(function(resolve, reject) {
//     	//gathering unspent transactions
// 		client.listUnspent((err, ret) => {
// 			if (err) {
// 				reject(err);
// 			}
// 			console.log("listUnspent", ret);
// 			let txUnspent = [];
// 			let unspentAmount = 0;
// 			for (i = 0; i < ret.length; i++) {
// 				txUnspent.push({ txid: ret[i].txid, vout: ret[i].vout })
// 				unspentAmount += ret[i].amount;
// 				if (unspentAmount > amount + fee) {
// 					break;
// 				}	
// 			}

// 			const rawChange = unspentAmount - amount - fee;
// 			const change = parseFloat(rawChange.toFixed(8));

// 			console.log(unspentAmount, balance, amount, fee, change);

// 			resolve([txUnspent, change]);
// 		});
//     }))
//     .then((txid_vOut) => new Promise(function(resolve, reject) {
// 		console.log('txid_vOut', txid_vOut);
// 		//crafting the raw transaction
// 		client.createRawTransaction(txid_vOut[0], { [recipient]: amount, [sender]: txid_vOut[1] }, (err, ret) => {
// 			if (err) {
// 				reject(err);
// 			}	 
// 			console.log('createRawTransaction', ret);
// 			client.decodeRawTransaction(ret, function(err, ret) {
// 				if (err) {
// 					return console.log('err', err);
// 				}
// 				console.log("tx decode", ret);
// 			});
// 			resolve(ret);
// 		});
//     }))
//     .then((rawTransaction) => new Promise(function(resolve, reject) {
// 		// signing the raw transaction
// 		client.importPrivKey(senderPrivateKey);
// 		client.signRawTransaction(rawTransaction, (err, ret) => {
// 			if (err) {
// 				reject(err);
// 			}
			
// 			console.log('signRawTransaction', ret);
// 			resolve(ret);
// 		});
// 	}))
// 	.then((signedRawTransaction) => new Promise( function(resolve, reject) {
// 			console.log('signedRawTransaction', signedRawTransaction);
// 			// submiting the signed transaction
// 			client.sendRawTransaction(signedRawTransaction.hex, (err, ret) => {
// 		        if (err) {
// 		            reject(err);
// 		        }
// 		        console.log('sendRawTransaction', ret);
// 		        resolve(ret);
// 		    });
// 	}))
// 	.then(txid => console.log("final txid", txid));
// }
