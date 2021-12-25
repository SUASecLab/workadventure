const SECRET_KEY = process.env.SECRET_KEY || "THECODINGMACHINE_SECRET_KEY";
const ALLOW_ARTILLERY = process.env.ALLOW_ARTILLERY ? process.env.ALLOW_ARTILLERY == "true" : false;
const API_URL = process.env.API_URL || "";
const ADMIN_API_URL = process.env.ADMIN_API_URL || "";
const ADMIN_URL = process.env.ADMIN_URL || "";
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || "myapitoken";
export const ADMIN_SOCKETS_TOKEN = process.env.ADMIN_SOCKETS_TOKEN || "myapitoken";
const CPU_OVERHEAT_THRESHOLD = Number(process.env.CPU_OVERHEAT_THRESHOLD) || 80;
const JITSI_URL: string | undefined = process.env.JITSI_URL === "" ? undefined : process.env.JITSI_URL;
const JITSI_ISS = process.env.JITSI_ISS || "";
const BBB_URL: string | undefined = process.env.BBB_URL === "" ? undefined: process.env.BBB_URL;
const BBB_SECRET = process.env.BBB_SECRET || "";
const BBB_ATTENDEE_SECRET = process.env.BBB_ATTENDEE_SECRET || "secret";
const BBB_MODERATOR_SECRET = process.env.BBB_MODERATOR_SECRET || "supersecret";
const SECRET_JITSI_KEY = process.env.SECRET_JITSI_KEY || "";
const SECRET_WEBSITE_ISS = process.env.SECRET_WEBSITE_ISS || "";
const SECRET_WEBSITE_KEY = process.env.SECRET_WEBSITE_KEY || "";
const NOVNC_PASSWORD = process.env.NOVNC_PASSWORD || "";
const PUSHER_HTTP_PORT = parseInt(process.env.PUSHER_HTTP_PORT || "8080") || 8080;
export const SOCKET_IDLE_TIMER = parseInt(process.env.SOCKET_IDLE_TIMER as string) || 120; // maximum time (in second) without activity before a socket is closed. Should be greater than 60 seconds in order to cope for Chrome intensive throttling (https://developer.chrome.com/blog/timer-throttling-in-chrome-88/#intensive-throttling)

export const FRONT_URL = process.env.FRONT_URL || "http://localhost";
export const OPID_CLIENT_ID = process.env.OPID_CLIENT_ID || "";
export const OPID_CLIENT_SECRET = process.env.OPID_CLIENT_SECRET || "";
export const OPID_CLIENT_ISSUER = process.env.OPID_CLIENT_ISSUER || "";

export {
    SECRET_KEY,
    API_URL,
    ADMIN_API_URL,
    ADMIN_URL,
    ADMIN_API_TOKEN,
    ALLOW_ARTILLERY,
    CPU_OVERHEAT_THRESHOLD,
    JITSI_URL,
    JITSI_ISS,
    BBB_URL,
    BBB_SECRET,
    BBB_ATTENDEE_SECRET,
    BBB_MODERATOR_SECRET,
    SECRET_JITSI_KEY,
    SECRET_WEBSITE_ISS,
    SECRET_WEBSITE_KEY,
    NOVNC_PASSWORD,
    PUSHER_HTTP_PORT,
};
