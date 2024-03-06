import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

export function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}
