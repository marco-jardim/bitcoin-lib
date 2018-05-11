var litecoin = require('litecoin');

var client = new litecoin.Client({
  host: "HOST_ADDRESS",
  port: 9332, // default litecoind port
  user: "USER_NAME",
  pass: "USER_PASS",
  timeout: 30000,
  ssl: false
});


// MAIN NET
// private keys
var account1privkey = "1ST_ACCOUNT_PRIVATE_KEY"; 
var account2privkey = "2ND_ACCOUNT_PRIVATE_KEY"; 

// address
var account1 = "1ST_ACCOUNT_ADDRESS"; 
var account2 = "2ND_ACCOUNT_ADDRESS"; 
// -----

var fee = 0.007; 
var amount = 0.02; // amount to be sent

sendTransaction(account2, amount, account1, account1privkey, fee);

function sendTransaction(recipient, amount, sender, senderPrivateKey) {
	var promise = new Promise(function(resolve, reject) {
  //checking balance
		client.listReceivedByAddress((err, accounts)=>{
		    if (err) {
		        reject(err);
		    }

			var hasBalance = false;
			var balance = 0;
		    for (i = 0; i < accounts.length; i++) {
		    	if (accounts[i].address == sender && (accounts[i].amount >= amount + fee)) {
					balance = accounts[i].amount;
		    		hasBalance = true;
		    	}
		    } 

		    if (hasBalance) {
		    	resolve(balance);
		    } else {
				reject("not enought funds");
			}		    
		});            
    });
	promise.then((balance) => {
		var p1 = new Promise( function(resolve, reject) {
    //gathering unspent transactions
			client.listUnspent((err, ret) => {
		        if (err) {
		            reject(err);
		        }
		        console.log("listUnspent", ret);
		        var txUnspent = [];
		        var unspentAmount = 0;
		        for (i = 0; i < ret.length; i++) {
		        	txUnspent.push({txid: ret[i].txid, vout: ret[i].vout})
		        	unspentAmount += ret[i].amount;
		        	if (unspentAmount > amount + fee) {
	        			break;
	        		}	
		        }

		        var rawChange = unspentAmount - amount - fee;
		        var change = parseFloat(rawChange.toFixed(8));

		        console.log(unspentAmount, balance, amount, fee, change);

		        resolve([txUnspent, change]);
		    });
		});
		return p1;
    })
    .then((txid_vOut) => {
    	console.log('txid_vOut', txid_vOut);
    	var p2 = new Promise( function(resolve, reject) {
      //crafting the raw transaction
	    	client.createRawTransaction(txid_vOut[0], {[recipient]: amount, [sender]: txid_vOut[1]}, (err, ret) => {
		        if (err) {
		            reject(err);
		        }	 
		        console.log('createRawTransaction', ret);
		        client.decodeRawTransaction(ret, function(err, ret) {
		    		if (err) {
			    		return console.log('err', err);
					}
					console.log("tx decode", ret);
				});
		        resolve(ret);
		    });
		});
		return p2;
    })
    .then((rawTransaction) => {
    	
		var p3 = new Promise( function(resolve, reject) {
    // signing the raw transaction
			client.importPrivKey(senderPrivateKey);
			client.signRawTransaction(rawTransaction, (err, ret) => {
		        if (err) {
		            reject(err);
		        }
		       
		        console.log('signRawTransaction', ret);
		        resolve(ret);
		    });
		});
		return p3;
	})
	.then((signedRawTransaction) => {
		console.log('signedRawTransaction', signedRawTransaction);
		var p4 = new Promise( function(resolve, reject) {
    // submiting the signed transaction
			client.sendRawTransaction(signedRawTransaction.hex, (err, ret) => {
		        if (err) {
		            reject(err);
		        }
		        console.log('sendRawTransaction', ret);
		        resolve(ret);
		    });
		});
		return p4;
	})
    .then((txid) => {
    	console.log("final txid", txid);
    });
}



