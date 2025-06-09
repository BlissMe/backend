const CryptoJS = require("crypto-js");
require("dotenv").config();

const secretKey = process.env.ENCRYPTION_KEY;

// Encrypt function
function encryptText(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decrypt function
function decryptText(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
   try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return data;
  }
}

module.exports = {
  encryptText,
  decryptText,
};
