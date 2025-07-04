import twilio from "twilio";

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const sendOtpService = {
  /**
   * Send OTP using Twilio Verify Service.
   * @param to - The phone number to send the OTP to.
   * @param channel - Channel to use for OTP delivery (sms or call).
   */
  sendOtp: async (to: string, channel: "sms" | "call" = "sms") => {
    if (!to) {
      throw new Error("Phone number is required");
    }

    try {
      const response = await client.verify
        .services(process.env.VERIFY_SERVICE_SID!)
        .verifications.create({ to, channel });

      return { success: true, sid: response.sid };
    } catch (error: any) {
      console.error("Error sending OTP:", error.message || error);
      throw new Error("Failed to send OTP. Check Twilio configuration or phone number.");
    }
  },

  /**
   * Verify the OTP using Twilio Verify Service.
   * @param to - The phone number to verify.
   * @param code - The OTP code entered by the user.
   */
  verifyOtp: async (to: string, code: string) => {
    if (!to || !code) {
      throw new Error("Phone number and OTP code are required");
    }

    try {
      const response = await client.verify
        .services(process.env.VERIFY_SERVICE_SID!)
        .verificationChecks.create({ to, code });

      if (response.status === "approved") {
        return { success: true, message: "OTP verified successfully" };
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message || error);
      throw new Error("Failed to verify OTP. Check the OTP or phone number.");
    }
  },
};

export default sendOtpService;
