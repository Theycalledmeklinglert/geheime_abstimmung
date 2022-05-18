import { Injectable } from '@angular/core';
import {box, randomBytes} from "tweetnacl";
import {decodeBase64, decodeUTF8, encodeBase64, encodeUTF8} from "tweetnacl-util";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  newNonce: Uint8Array = randomBytes(box.nonceLength);
  generateKeyPair = () => box.keyPair();

  encryptMessage (
    secretOrSharedKey: Uint8Array,
    json: any,
    key?: Uint8Array
  ) {
    const nonce = this.newNonce;
    const messageUint8 = decodeUTF8(JSON.stringify(json));
    const encrypted = key
      ? box(messageUint8, nonce, key, secretOrSharedKey)
      : box.after(messageUint8, nonce, secretOrSharedKey);

    const fullMessage = new Uint8Array(nonce.length + encrypted.length);
    fullMessage.set(nonce);
    fullMessage.set(encrypted, nonce.length);

    return encodeBase64(fullMessage);
  };

  decryptMessage (
    secretOrSharedKey: Uint8Array,
    messageWithNonce: string,
    key?: Uint8Array
  ) {
    const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(
      box.nonceLength,
      messageWithNonce.length
    );

    const decrypted = key
      ? box.open(message, nonce, key, secretOrSharedKey)
      : box.open.after(message, nonce, secretOrSharedKey);

    if (!decrypted) {
      throw new Error('Could not decrypt message');
    }

    const base64DecryptedMessage = encodeUTF8(decrypted);
    return JSON.parse(base64DecryptedMessage);
  };


  tryCrypto(obj: any) {
    const pairA = this.generateKeyPair();
    const pairB = this.generateKeyPair();
    console.log(pairA.publicKey);
    console.log(pairA.secretKey);
    const sharedA = box.before(pairB.publicKey, pairA.secretKey);
    const sharedB = box.before(pairA.publicKey, pairB.secretKey);
    const encrypted = this.encryptMessage(sharedA, obj);
    const decrypted = this.decryptMessage(sharedB, encrypted);
    console.log(obj, encrypted , decrypted);
  }

  generateKeys(): Uint8Array {
    let pair = this.generateKeyPair();
    return pair.publicKey;
  }
}
