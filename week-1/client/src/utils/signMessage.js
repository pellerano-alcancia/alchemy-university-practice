import * as secp from '@noble/secp256k1';
import { hashMessage } from './hashMessage';

export async function signMessage(message, privateKey) {
  return await secp.sign(hashMessage(message), privateKey, { recovered: true });
}
