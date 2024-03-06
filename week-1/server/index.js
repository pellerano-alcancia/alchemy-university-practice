const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('@noble/secp256k1');
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  '0445f0b00e592965fe5e89bc9a21b34f214a949dd11e6ab9ff6280b01a2b3b42be698c483aaa0bbcf3d7f7ba63e50a65ed6c88d2d445599d085e3e689133474b74': 100,
  '04df180940a27064bcd4ac422b50fc717eb4877f92971018d102fa94b7234afec4f9a8768700d43f3b86ff0b9799f75dd3d538986ff4e82161b8a9e3195a1168e3': 50,
  '04c7bbccede073e0f23ff9385bb9b7c6aa6fcb5a3bd098a127a15abbbe89e31e28775bf32e40ad314aa2d7f09bc4ee86a6f862fdc32c47a1373386e428d4e27257': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  // TODO: get a signature from the client
  const { signature, recoveryBit, recipient, amount } = req.body;

  // recover the public key from the signature (aka. sender)
  const sender = toHex(
    await secp.recoverPublicKey(
      keccak256(utf8ToBytes(JSON.stringify({ amount, recipient }))),
      signature,
      recoveryBit
    )
  );

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
