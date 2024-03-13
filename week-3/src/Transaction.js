import { useEffect } from 'react';

const Transaction = (props) => {
  const { transaction, setTransaction } = props;

  useEffect(() => {
    console.log(
      Object.keys(transaction)
        .filter((x) => x !== 'wait')
        .map((item) => `${item}: ${transaction[item]}`)
    );
  }, [transaction]);

  return (
    <div>
      <h1>Transaction</h1>
      <a onClick={() => setTransaction(null)}>Back</a>
      <ul>
        {Object.keys(transaction)
          .filter((x) => x !== 'wait')
          .map((item, key) => (
            <li key={key}>
              {item}: {`${transaction[item]}`}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Transaction;
