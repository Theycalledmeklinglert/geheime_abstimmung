import {Injectable} from '@angular/core';
import * as nacl from "tweetnacl";
import {box, randomBytes} from "tweetnacl";
import {decodeBase64, decodeUTF8, encodeBase64, encodeUTF8} from "tweetnacl-util";
import {EncryptedData} from "../models/encryptedData";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  generateKeyPair = () => box.keyPair();

  decrypt(secretKey: string, data: EncryptedData) {

    let nonce = decodeBase64(data.nonce);
    let ephemPubKey = decodeBase64(data.ephemPubKey);
    let encrypted = decodeBase64(data.message);
    let secretKeyJS = decodeBase64(secretKey);
    let decryptedFromJS = nacl.box.open(
      encrypted,
      nonce,
      ephemPubKey,
      secretKeyJS
    );
    return encodeUTF8(decryptedFromJS);
    }

    encrypt(publicKeyString: string, ciphertext: any): EncryptedData{
      const nonce = randomBytes(box.nonceLength);
      const messageUint8 = decodeUTF8(JSON.stringify(ciphertext));
      const ephemKeyPair = box.keyPair();
      const publicKey = decodeBase64(publicKeyString);
      const encrypted = box(messageUint8, nonce, publicKey, ephemKeyPair.secretKey);
      return {nonce: encodeBase64(nonce), ephemPubKey: encodeBase64(ephemKeyPair.publicKey), message: encodeBase64(encrypted)};
    }
}
