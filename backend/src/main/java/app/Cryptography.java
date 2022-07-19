package main.java.app;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;

import static main.java.app.TweetNaclFast.*;

public class Cryptography {

    public static HashMap<String, String> generateKeyPair(){
        final Box.KeyPair pair = Box.keyPair();
        final String publicKey = Base64.getEncoder().encodeToString(pair.getPublicKey());
        final String privateKey = Base64.getEncoder().encodeToString(pair.getSecretKey());
        HashMap<String, String> result = new HashMap<>();
        result.put("publicKey", publicKey);
        result.put("privateKey", privateKey);
        return result;
    }


    public static EncryptedData encrypt(String pubKeyString, String msg) {
        final byte[] pubKey = Base64.getDecoder().decode(pubKeyString);
        final Box.KeyPair ephemKeys = Box.keyPair();
        final byte[] msgArr = msg.getBytes(StandardCharsets.UTF_8);
        final byte[] nonce = TweetNaclFast.randombytes(Box.nonceLength);

        final Box box = new Box(pubKey, ephemKeys.getSecretKey());
        final byte[] encrypted = box.box(msgArr, nonce);

        final String nonce64 = Base64.getEncoder().encodeToString(nonce);
        final String ephemPubKey64 = Base64.getEncoder().encodeToString(ephemKeys.getPublicKey());
        final String encrypted64 = Base64.getEncoder().encodeToString(encrypted);
        return new EncryptedData(nonce64, ephemPubKey64, encrypted64);
    }

    public static String decrypt(String privKeyString, EncryptedData data){
        final byte[] privKey = Base64.getDecoder().decode(privKeyString);
        final byte[] nonce = Base64.getDecoder().decode(data.getNonce());
        final byte[] ephemPubKey = Base64.getDecoder().decode(data.getEphemPubKey());
        final byte[] msg = Base64.getDecoder().decode(data.getMessage());

        final Box box = new Box(ephemPubKey, privKey);
        final byte[] decrypted = box.open(msg, nonce);

        return new String(decrypted, StandardCharsets.UTF_8);
    }

    static class EncryptedData {
        public EncryptedData(String nonce, String ephemPubKey, String encrypted) {
            this.nonce = nonce;
            this.ephemPubKey = ephemPubKey;
            this.message = encrypted;
        }
        private final String nonce;
        private final String ephemPubKey;
        private final String message;

        public String getNonce() {
            return nonce;
        }

        public String getEphemPubKey() {
            return ephemPubKey;
        }

        public String getMessage() {
            return message;
        }

        @Override
        public String toString() {
            return "{" +
                    "nonce:'" + nonce + '\'' +
                    ", ephemPubKey:'" + ephemPubKey + '\'' +
                    ", message:'" + message + '\'' +
                    '}';
        }
    }
}