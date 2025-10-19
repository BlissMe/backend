const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.MASTER_ENCRYPTION_KEY, "hex"); // 32 bytes key

/**
 * Encrypts a number array and returns hex string (with IV prepended)
 * @param {number[]} array
 * @returns {string}
 */
function encryptArray(array) {
  try {
    const iv = crypto.randomBytes(16); // generate random IV
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(array), "utf8", "hex");
    encrypted += cipher.final("hex");

    // Prepend IV to encrypted string (IV is 16 bytes = 32 hex chars)
    return iv.toString("hex") + encrypted;
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Failed to encrypt array");
  }
}

/**
 * Decrypts an encrypted array string back to number array
 * @param {string} encrypted
 * @returns {number[]}
 */
function decryptArray(encrypted) {
  try {
    // Extract IV from the first 32 hex chars
    const iv = Buffer.from(encrypted.slice(0, 32), "hex");
    const encryptedText = encrypted.slice(32);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption error:", err);
    throw new Error("Failed to decrypt array");
  }
}

module.exports = { encryptArray, decryptArray };
