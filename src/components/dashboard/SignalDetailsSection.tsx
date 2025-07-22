import React, { useState, useEffect } from "react";
import { getDecodedUserToken, getHoursAgo } from "../../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ChevronRight,
  Star,
  ArrowUpCircle,
  ArrowDownCircle,
  Target,
  MessageCircle,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Signals } from "../../types/signal";
import SignalChat from "./SignalChat";
dayjs.extend(relativeTime);
const socket = io(import.meta.env.VITE_API_URL);
interface SignalDetailsSectionProps {
  signal: Signals;
  analyst: {
    name: string;
    image: string;
    type: string;
    stats: {
      signals: number | undefined;
      followers: string;
      success: string | undefined;
    };
  };
  onSignalClick: (id: string) => void;
}

type Sender = {
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: string;
};

type Message = {
  id: string;
  signalId: string;
  senderId: Sender;
  message: string;
  createdAt: string; // ISO date string
};

const SignalDetailsSection = () => {
  const { signalId } = useParams();
  if (!signalId) {
    return;
  }
  return (
    <div className="w-full bg-slate-800/50">
      <div className="border-t border-slate-700/50">
        <SignalChat signalId={signalId} />
      </div>
    </div>
  );
};

export default SignalDetailsSection;
