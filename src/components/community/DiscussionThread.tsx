import React from 'react';
import { MessageCircle, ThumbsUp, Share2 } from 'lucide-react';

interface DiscussionThreadProps {
  title: string;
  author: {
    name: string;
    image: string;
    badge: string;
  };
  content: string;
  likes: number;
  comments: number;
  time: string;
  onClick?: () => void;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({
  title,
  author,
  content,
  likes,
  comments,
  time,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={author.image}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-medium">{author.name}</div>
          <div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block">
            {author.badge}
          </div>
        </div>
        <div className="text-xs text-slate-400 ml-auto">{time}</div>
      </div>

      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{content}</p>

      <div className="flex items-center gap-4 text-sm text-slate-400">
        <button className="flex items-center gap-1 hover:text-white transition-colors">
          <ThumbsUp className="w-4 h-4" />
          {likes}
        </button>
        <button className="flex items-center gap-1 hover:text-white transition-colors">
          <MessageCircle className="w-4 h-4" />
          {comments}
        </button>
        <button className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default DiscussionThread;