function filterEnoughtFunds(amount, transactions) {
  const txUnspent = [];
  let unspentAmount = 0;

  for (let transaction in transactions) {
    txUnspent.push(transaction);
    unspentAmount += transaction.amount;
    if (unspentAmount > amount + fee) break;
  }

  const rawChange = unspentAmount - amount - fee;

  return { transactions, unspentAmount, change: parseFloat(rawChange.toFixed(8)) };
}

module.exports = { filterEnoughtFunds };
