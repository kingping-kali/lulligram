import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Story, User } from '../types';
import { MOCK_USERS } from '../constants';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
  onNext: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose, onNext }) => {
  const [progress, setProgress] = useState(0);
  const user: User = MOCK_USERS[story.userId] || { 
    id: 'unknown',
    username: 'Unknown', 
    fullName: 'Unknown User',
    avatar: 'https://via.placeholder.com/150',
    bio: '',
    followers: 0,
    following: 0
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onNext();
          return 100;
        }
        return prev + 1; // 100 ticks approx 3 seconds
      });
    }, 30);

    return () => clearInterval(timer);
  }, [story, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Progress Bar */}
      <div className="w-full flex gap-1 p-2 pt-4">
        <div className="h-1 bg-gray-600 flex-1 rounded overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-white">
        <div className="flex items-center gap-2">
          <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-500" alt={user.username} />
          <span className="font-semibold text-sm">{user.username}</span>
          <span className="text-gray-400 text-xs">2h</span>
        </div>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
        <img 
          src={story.imageUrl} 
          className="max-h-full max-w-full object-contain" 
          alt="Story"
          onClick={onNext} // Tap to skip
        />
        
        {/* Reply input simulation */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
            <input 
                type="text" 
                placeholder="Send message" 
                className="w-full bg-transparent border border-white/50 rounded-full px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
            />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;