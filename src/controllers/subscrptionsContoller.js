const axios = require("axios");
const { saveSubscriber } = require("../services/mSpaceService");

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

exports.sendSubscriberNotification = async (req, res) => {
  try {
    const {
      timeStamp,
      version,
      subscriberId,
      frequency,
      status
    } = req.body;

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

exports.requestOtp = async (req, res) => {
  try {
    const { subscriberId, applicationHash } = req.body;
    if (!subscriberId) {
      return res.status(400).json({
        message: "subscriberId is required"
      });
    }
    const applicationMetaData = {
      client: "MOBILEAPP",
      device: "Web Browser",
      os: "Windows 11",
      appCode: "https://blissme.vercel.app/"
    };

    const payload = {
      applicationId: process.env.MSPACE_APP_ID,
      password: process.env.MSPACE_PASSWORD,
      subscriberId,
      applicationHash: applicationHash || "default_hash",
      applicationMetaData
    };

    const response = await axios.post(
      "https://api.mspace.lk/otp/request",
      payload,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }
    );
    console.log(response)

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("OTP Request Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "OTP request failed",
      error: error.response?.data || error.message
    });
  }
};
// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { referenceNo, otp } = req.body;
    const { userID } = req.user;

    const payload = {
      applicationId: process.env.MSPACE_APP_ID,
      password: process.env.MSPACE_PASSWORD,
      referenceNo,
      otp
    };

    const response = await axios.post(
      "https://api.mspace.lk/otp/verify",
      payload,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }
    );
    const data = response.data;

    if (data.statusCode === "S1000" && data.subscriberId) {
      await saveSubscriber({
        userID,
        subscriberId: data.subscriberId,
        subscriptionStatus: data.subscriptionStatus
      });
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.response?.data || error.message
    });
  }
};


