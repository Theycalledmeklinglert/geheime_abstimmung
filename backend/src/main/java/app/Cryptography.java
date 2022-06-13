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

    public static void main(String[] args) {
        final EncryptedData data = new EncryptedData("B3/TONhH8u0eiTpO1NA0CTA43/dEMTaE",
                "5LUyNZkgEviAO6qx3tFkrxdbt29sjbRlXxm/ZosZG3s=",
                "5G8ZJZ+E/mOmJ1YZFlq72cNOH6btw02Yn6JTAx/shmh+FtKc+4FAwWIHP9bi0ueyC4cGa" +
                        "+pfCk/1WdAJNJCsrDb5ao5bsppXvu4wrMu1dMuo5CrLITtI03FtLWeNjhu9tui1A63XwgJ01Nn" +
                        "52zA7B4llDMu5eSwmQIBQAjxzlKwUNniDwGVwepaiuk9M0QlRnfCGdcMlYWOHtzJaK+NJ2Oe/BX" +
                        "7+t9SAgypcAt/FKE1og19PifKFdyCjIkq785g8bX89Qwn8zrAM/H6W5iw/9ciwrKl1WG7t94ccrZ" +
                        "GKYXJNPYWJHZW44ZmzVideboDUaTOPtA==");
        final String decrypted = decrypt("uS/W2ViCSGguZhHOuKvp/GACKxoieeNbXS2OjaFY4Ho=", data);
        System.out.println(decrypted);
    }
}