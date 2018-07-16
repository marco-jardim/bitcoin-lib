# bitcoin-lib
Sending custom transactions on bitcoin via RPC calls, but in the easy way with node.js. Just open the wallet on your node, add the amount, the destination and the desired fee. No more counter-intuitive default ``send`` RPC method that so many other libs implements and sends the change of your transaction to a new address. It works with every Bitcoin forks.

## Example
```
const node = new Node(client, senderPK);
node.sendTransaction(senderAddress, destinationAddress, amount, fee)
.then(txid => console.log('Transaction id:', txid));
```
More usage details [here](example.js).
