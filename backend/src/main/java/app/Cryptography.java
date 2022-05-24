package de.fhws.pvs.unit13.exercise4;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import static de.fhws.pvs.unit13.exercise4.TweetNaclFast.*;


public class Cryptography {

    private static EncryptedData encrypt(String pubKeyString, String msg) {
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

    private static String decrypt(byte[]privKey, EncryptedData data){
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

//    public static void main(String[] args) {

        //Test generating pubKey in frontend, encrypt in backend and decrypt in frontend

//        byte[] pubKey = Base64.getDecoder().decode("quu9xSu4WACmgAwRSuPATsyu8XGX1pihIhW+ij0OWUk=");
//        EncryptedData encryptedData = encrypt(pubKey, "Hallo Welt");
//        System.out.println(encryptedData);


        //Test generating pubKey in backend, encrypt in frontend and decrypt in backend

//        Box.KeyPair pair = Box.keyPair();
//        System.out.println(Base64.getEncoder().encodeToString(pair.getPublicKey())+"\n"+Base64.getEncoder().encodeToString(pair.getSecretKey()));
//        EncryptedData data = new EncryptedData("8MP7AvxFdGDEi5XZT2kFlzYYxTyxbbLn", "Qf/OWaa9BOZiaBhqTYnSfYhcEZ01J0R5LlCDwGtPEXg=", "vk3KYsKsj1BtoSv+BdtAnM1cEydkZfzwa8MfWBVTY/Zpc728iIQUD6SHAvObm+hoo2jfY5+bO6UsdyFTQXxhgvyQZTjIA0P9trhzsWeWxSyervw4fjMX2vFDhNajLEizxLnm09LhapUvs5TtDScvgNdUX+mKwxJDirQw");
//        byte[] priv = Base64.getDecoder().decode("GlsQzf75xgi0oq8z64bZ8gTGUn5v6VZwwtQCj5E8FsM=");
//        EncryptedData encryptedData = encrypt(pair.getPublicKey(), "Hallo Welt");
//        System.out.println(encryptedData);
//        String decrypt = decrypt(pair.getSecretKey(), encryptedData);
//        System.out.println(decrypt);
//    }
}