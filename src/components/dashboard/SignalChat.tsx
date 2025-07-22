import { useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getDecodedUserToken } from "../../utils";
import { Else, If, Then } from "react-if";
const socket = io(import.meta.env.VITE_API_URL);

type Message = {
  _id: string
  id: string;
  signalId: Signal;
  senderId: Sender;
  message: string;
  image: string;
  createdAt: string; // ISO date string
};
type Signal = {
  id: string
}
type Sender = {
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: string;
};

dayjs.extend(relativeTime);

type Props = {
  signalId: string;
  isDashboard?: boolean;
};

const SignalChat = ({ signalId, isDashboard = false }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [signalExist, setSignalExist] = useState(false);
  const user = getDecodedUserToken();
  const navigate = useNavigate();

  const setupChat = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/${signalId}/messages`
      );
      if (res.status === 404) {
        console.warn("Signal not found, skipping socket connection.");
        return;
      }

      setSignalExist(true);
      const result = await res.json();
      setMessages(result.data);

      socket.emit("join-signal", { signalId });

      socket.on("new-message", (message: Message) => {
        console.log("message ", message);
        setMessages((prev) => {
          if (prev.length > 0 && prev[0].id === message.id) return prev;
          return [message, ...prev];
        });
      });
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", {
      signalId,
      senderId: user?.userId,
      message: input,
    });

    setInput("");
  };

  useEffect(() => {
    setupChat();

    return () => {
      socket.emit("leave-signal", { signalId });
      socket.off("new-message");
    };
  }, [signalId]);
  if (!signalExist) return null;
  return (
    <div className="p-4 border-t border-slate-700/50">
      <div className="flex items-center justify-between mb-4"
        onClick={() => {
          if (isDashboard) {
            navigate(`/signal/${signalId}`);
          }
        }}>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <span className="font-medium">Signal Group Chat</span>
        </div>
      </div>
      {!isDashboard && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Enter Message"
            className="w-[90%] bg-slate-800/50 border rounded-xl px-2 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
          <button
            className="w-[10%] px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      )}
      <div className="space-y-3">
        <If condition={messages.length > 0}>
          <Then>
            {messages
              .filter((_, index) => !isDashboard || index === 0)
              .map((message) => (
                <div
                  key={message.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50"

                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-10 h-10 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
                      {message && message.image ? (
                        <img
                          src={message.image}
                          alt="User"
                          referrerPolicy="no-referrer"
                          className="w-full h-full rounded-full object-cover"
                          onError={() => {
                            console.error(
                              "❌ Image failed to load:",
                              message.image
                            );
                          }}
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="w-full flex justify-between items-start gap-4">
                      <div >
                        <span className="text-sm font-medium">
                          {message.senderId.username}
                        </span>
                        <p className="text-sm text-slate-300">{message.message}</p>
                      </div>
                      <div >
                        <span className="text-xs text-slate-400">
                          {dayjs(message.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Then>
          <Else>
              <div>
                No comments
              </div>
          </Else>
        </If>
      </div>
    </div>
  );
};

export default SignalChat;
