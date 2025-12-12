const axios = require("axios");

exports.sendSubscription = async (req, res) => {
  try {
    const { subscriberId, action } = req.body;

    if (!subscriberId || !action) {
      return res.status(400).json({ message: "subscriberId and action are required" });
    }

    const payload = {
      applicationId: "APP_009632",
      password: "cf65ad1de8944861291ec196281153ba",
      subscriberId: subscriberId, 
      action: action
    };

    const response = await axios.post(
      "https://api.mspace.lk/subscription/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Subscription error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Subscription failed",
      error: error.response?.data || error.message,
    });
  }
};
