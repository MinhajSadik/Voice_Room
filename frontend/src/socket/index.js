import io from "socket.io-client";

export const socketInit = () => {
  const options = {
    "force new connnection": true,
    reconnctionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io("https://voice-room-api-minhajsadik.vercel.app", options);
};
