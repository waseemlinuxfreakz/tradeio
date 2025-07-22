import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

interface EventCardProps {
  title: string;
  type: string;
  date: string;
  time: string;
  participants: number;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  type,
  date,
  time,
  participants,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
    >
      <div className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 inline-block mb-2">
        {type}
      </div>
      
      <h3 className="font-medium mb-4">{title}</h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          {time}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="w-4 h-4" />
          {participants} participants
        </div>
      </div>
    </div>
  );
};

export default EventCard;