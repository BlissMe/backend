const axios = require("axios");

exports.sendSubscription = async (req, res) => {
  try {
    const { subscriberId, action } = req.body;

    if (!subscriberId || !action) {
      return res.status(400).json({ message: "subscriberId and action are required" });
    }

    const payload = {
      applicationId: process.env.MSPACE_APP_ID,
      password: process.env.MSPACE_PASSWORD,
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


// Subscriber Notification Controller
exports.sendSubscriberNotification = async (req, res) => {
  try {
    const {
      timeStamp,
      version,
      subscriberId,
      frequency,
      status
    } = req.body;

    // Basic validation
    if (!timeStamp || !version || !subscriberId || !frequency) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const payload = {
      timeStamp: timeStamp,            // yyMMddHHmm or full timestamp
      version: version,                // "1.0"
      applicationId: process.env.MSPACE_APP_ID,
      password: process.env.MSPACE_PASSWORD,
      subscriberId: subscriberId,      // tel:94716177301
      frequency: frequency,            // daily | weekly | monthly | yearly
      status: status || "REGISTERED."
    };

    const response = await axios.post(
      "https://api.mspace.lk/subscription/notify",
      payload,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Notification Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Subscriber notification failed",
      error: error.response?.data || error.message
    });
  }
};

