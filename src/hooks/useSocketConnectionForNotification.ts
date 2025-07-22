import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { notification } from "antd";
import { getDecodedUserToken } from "../utils";
// Replace with your actual user auth logic

const SOCKET_URL = import.meta.env.VITE_API_URL;

export const socketConnectionForNotification = () => {
  const socketRef = useRef<Socket | null>(null);
  const user = getDecodedUserToken();

  useEffect(() => {
    const userId = user?.userId
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join_room", userId);
      console.log(`📡 Joined room for user: ${userId}`);
    });

    socket.on("signal_executed", (data) => {
      notification.open({
        message: "Signal Executed",
        description: data.message || "A signal has been successfully executed.",
        placement: "topRight",
        duration: 4,
      });
    });
     socket.on("sender", (data) => {
      notification.open({
        message: "Signal Executed",
        description: data.message || "A signal has been successfully executed.",
        placement: "topRight",
        duration: 4,
      });
    });
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
};
