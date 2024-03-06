import { useState } from 'react';
import server from './server';
import { toHex } from 'ethereum-cryptography/utils';
import * as secp from '@noble/secp256k1';
import { signMessage } from './utils/signMessage';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const data = {
        amount: parseInt(sendAmount),
        recipient,
      };

      const [sig, recoveryBit] = await signMessage(
        JSON.stringify(data),
        privateKey
      );

      const {
        data: { balance },
      } = await server.post(`send`, {
        ...data,
        signature: toHex(sig),
        recoveryBit,
      });
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
