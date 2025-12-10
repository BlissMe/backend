const { sendSMS } = require("../services/mSpaceSmsService");

const sendTherapySMS = async (req, res) => {
    const { phone, text } = req.body;

    if (!phone || !text) {
        return res.status(400).json({ error: "phone and text are required" });
    }

    try {
        const apiResponse = await sendSMS({
            phone,
            message: text,
        });

        res.status(200).json({
            success: true,
            apiResponse,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Failed to send SMS",
            details: err.message,
        });
    }
};

module.exports = { sendTherapySMS };
