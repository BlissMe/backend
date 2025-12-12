const { sendSMS } = require("../services/mSpaceSmsService");

const sendTherapySMS = async (req, res) => {
    const { phone, text } = req.body;

    if (!phone) {
        return res.status(400).json({
            success: false,
            error: "phone is required"
        });
    }

    try {
        const apiResponse = await sendSMS({
            phone: phone,
            message: text,   // IMPORTANT: backend expects "message"
        });

        return res.status(200).json({
            success: true,
            result: apiResponse,
        });

    } catch (err) {
        console.error(
            "Error sending SMS:",
            err.response?.status,
            err.response?.data || err.message
        );

        return res.status(500).json({
            success: false,
            error: err || "Failed to send SMS",
            details: err.response?.data || err.message,
            status: err.response?.status || 500,
        });
    }
};

module.exports = { sendTherapySMS };
