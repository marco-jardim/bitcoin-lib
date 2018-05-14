const Client = require('./client');
const { filterEnoughtFunds } = require('./utils');

function createConnection(options) {
  return new Client({
    host: options.host || 'localhost',
    port: options.port || 9332, // default litecoind port
    user: options.user || '',
    pass: options.pass || '',
    timeout: options.timeout || 30000,
    ssl: options.ssl || false
  });
}

// Full Client API: https://web.archive.org/web/20160430054919/https://litecoin.info/Litecoin_API
class Node {
  
  constructor(driver, pk) {
    if (driver instanceof litecoin.Client) this.__driver = driver;
    else throw new Error('Invalid connection driver.');
    this.__driver.importPrivKey(pk);
  }

  getBalance(minimumConfirmations) {
    return this.__driver.listReceivedByAddress(minimumConfirmations || 6)
      .then(accounts => accounts.reduce((prev, next) => prev + next.amount, 0));
  }

  getUnspentTransactions() {
    return this.__driver.listUnspent();
  }

  async sendTransaction(senderAddress, destinationAddress, amount, fee) {
    const balance = await this.getBalance();
    const unspentTransactions = await this.getUnspentTransactions();
    const { transactions, unspentAmount, change } = filterEnoughtFunds(amount, unspentTransactions);
    const rawTransaction = await this.__createRawTransaction({ unspentTransactions: transactions, senderAddress, destinationAddress, amount, fee });
    const signedRawTransaction = await this.__signTransaction(rawTransaction);
    return this.__sendSignedRawTransaction(signedRawTransaction);
  }

  __sendSignedRawTransaction(signedRawTransaction) {
    return this.__driver.sendRawTransaction(signedRawTransaction.hex);
  }

  __createRawTransaction({ unspentTransactions, senderAddress, destinationAddress, amount, fee }) {
    return this.__driver.createRawTransaction(unspentTransactions, { [destinationAddress]: amount, [senderAddress]: change })
      .then(rawTransaction => this.__driver.decodedRawTransaction(rawTransaction));
  }

  __signTransaction(rawTransaction) {
    return this.__driver.signRawTransaction(rawTransaction);
  }
}

module.exports = { createConnection, Node };
