// Includes crypto module
const crypto = require("crypto");

interface User {
  id?: string;
  username?: string;
  [key: string]: any;
}

interface ValidatedData {
  [key: string]: string;
}

interface ValidationResult {
  validatedData: ValidatedData | null;
  user: User;
  message: string;
}

export function validateTelegramWebAppData(
  telegramInitData: string
): ValidationResult {
  const BOT_TOKEN = process.env.BOT_TOKEN;

  let validatedData: ValidatedData | null = null;
  let user: User = {};
  let message = "";

  if (!BOT_TOKEN) {
    return {
      message: "BOT_TOKEN is not defined in the environment variables.",
      validatedData: null,
      user: {},
    };
  }

  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get("hash");

  if (!hash) {
    return {
      message: "Hash is missing in the Telegram web app data.",
      validatedData: null,
      user: {},
    };
  }
  initData.delete("hash");

  const authDate = initData.get("auth_date");
  if (!authDate) {
    return {
      message: "Auth date is missing in the Telegram web app data.",
      validatedData: null,
      user: {},
    };
  }
  const authTimestamp = parseInt(authDate, 10);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDifference = currentTimestamp - authTimestamp;
  const fiveMinutesInSeconds = 5 * 60;

  if (timeDifference > fiveMinutesInSeconds) {
    return {
      message: "Auth data is too old. Please try again.",
      validatedData: null,
      user: {},
    };
  }

  const dataCheckString = Array.from(initData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash === hash) {
    validatedData = Object.fromEntries(initData.entries());
    message = "Telegram web app data is valid.";
    const userString = validatedData["user"];
    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (error) {
        console.error("Error parsing user data:", error);
        message = "Error parsing user data.";
        validatedData = null;
      }
    } else {
      message = "User data is missing in the Telegram web app data.";
      validatedData = null;
    }
  } else {
    message = "Telegram web app data is invalid.";
  }
  return {
    message,
    validatedData,
    user,
  };
}
