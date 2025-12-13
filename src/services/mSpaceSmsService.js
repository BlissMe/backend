const axios = require("axios");

async function sendSMS({ message, phone }) {
    try {
        const payload = {
            version: process.env.MSPACE_VERSION || "1.0",
            applicationId: process.env.MSPACE_APP_ID,
            password: process.env.MSPACE_PASSWORD,
            message: message,
            destinationAddresses: [phone],
            sourceAddress: "77100",
            deliveryStatusRequest: "1",
            encoding: "0"
        };

        const response = await axios.post(
            process.env.MSPACE_SMS_URL,
            payload,
            { headers: { "Content-Type": "application/json;charset=utf-8" } }
        );

        console.log("SMS API Response:", response.data);
        return response.data;

    } catch (err) {
        console.error("Error sending SMS:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = { sendSMS };
