import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';
import Transaction from './Transaction';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [block, setBlock] = useState(null);
  const [blockNumber, setBlockNumber] = useState(0);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    async function getBlock() {
      const block = await alchemy.core.getBlockWithTransactions();
      console.log(block);
      setBlock(block);
    }

    getBlockNumber();
    getBlock();
  }, []);

  if (transaction) return <Transaction {...{ transaction, setTransaction }} />;

  return (
    <div className="App">
      <h1>Block Number: {blockNumber}</h1>
      <h2>Transactions</h2>
      {block && (
        <>
          <h3>Total transactions: {block.transactions.length}</h3>
          <ul>
            {block.transactions.map((transaction, key) => (
              <li key={key} onClick={() => setTransaction(transaction)}>
                <a>{transaction.hash}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
