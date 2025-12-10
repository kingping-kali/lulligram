import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Home, Search, PlusSquare, MessageCircle, User as UserIcon, 
  ArrowLeft, Phone, Video, Send, Settings, Grid, Wand2, Loader2,
  Camera, MapPin, MoreVertical
} from 'lucide-react';

import { MOCK_USERS, MOCK_STORIES, MOCK_PRODUCTS, CURRENT_USER, MOCK_CONVERSATIONS } from './constants';
import { User, Product, Story, Message, Conversation, ViewState } from './types';
import StoryViewer from './components/StoryViewer';
import ProductCard from './components/ProductCard';
import { generateListingDescription, generateSmartReply } from './services/geminiService';

// --- Helper Components defined in App for simpler context sharing in this demo format ---

const Navbar: React.FC<{ view: ViewState; setView: (v: ViewState) => void }> = ({ view, setView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-3 z-40 pb-safe">
      <button onClick={() => setView(ViewState.FEED)} className={`${view === ViewState.FEED ? 'text-black' : 'text-gray-400'}`}>
        <Home className="w-7 h-7" strokeWidth={view === ViewState.FEED ? 2.5 : 2} />
      </button>
      <button onClick={() => setView(ViewState.EXPLORE)} className={`${view === ViewState.EXPLORE ? 'text-black' : 'text-gray-400'}`}>
        <Search className="w-7 h-7" strokeWidth={view === ViewState.EXPLORE ? 2.5 : 2} />
      </button>
      <button onClick={() => setView(ViewState.CREATE)} className={`${view === ViewState.CREATE ? 'text-black' : 'text-gray-400'}`}>
        <PlusSquare className="w-7 h-7" strokeWidth={view === ViewState.CREATE ? 2.5 : 2} />
      </button>
      <button onClick={() => setView(ViewState.MESSAGES)} className={`${view === ViewState.MESSAGES ? 'text-black' : 'text-gray-400'}`}>
        <MessageCircle className="w-7 h-7" strokeWidth={view === ViewState.MESSAGES ? 2.5 : 2} />
      </button>
      <button onClick={() => setView(ViewState.PROFILE)} className={`${view === ViewState.PROFILE ? 'text-black' : 'text-gray-400'}`}>
        <div className={`rounded-full p-0.5 border ${view === ViewState.PROFILE ? 'border-black' : 'border-transparent'}`}>
            <img src={CURRENT_USER.avatar} className="w-6 h-6 rounded-full" alt="Me" />
        </div>
      </button>
    </div>
  );
};

// --- Views ---

const CreateView: React.FC<{ setView: (v: ViewState) => void; onPost: (p: Product) => void }> = ({ setView, onPost }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [desc, setDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAI = async () => {
    if (!title || !price) return;
    setIsGenerating(true);
    const generated = await generateListingDescription(title, category, parseFloat(price));
    setDesc(generated);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        sellerId: CURRENT_USER.id,
        title,
        price: parseFloat(price),
        description: desc,
        image: 'https://picsum.photos/500/500', // Mock image
        likes: 0,
        createdAt: Date.now(),
        category
    };
    onPost(newProduct);
    setView(ViewState.PROFILE);
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="sticky top-0 bg-white border-b z-20 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setView(ViewState.FEED)} className="text-gray-600">Cancel</button>
        <h1 className="font-bold text-lg">New Listing</h1>
        <button onClick={handleSubmit} className="text-blue-500 font-bold disabled:opacity-50" disabled={!title || !price}>Share</button>
      </div>

      <div className="p-4 space-y-6">
        <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
           <Camera className="w-10 h-10 mb-2" />
           <span className="text-sm font-medium">Upload Photo</span>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What are you selling?"
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                />
            </div>
             <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                    />
                </div>
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none"
                    >
                        <option>Fashion</option>
                        <option>Electronics</option>
                        <option>Art</option>
                        <option>Home</option>
                    </select>
                </div>
            </div>

            <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button 
                        type="button"
                        onClick={handleAI}
                        disabled={isGenerating || !title}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 disabled:opacity-50 font-medium"
                    >
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        AI Write
                    </button>
                 </div>
                <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe your item..."
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:border-black transition-colors resize-none"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

const MessagesView: React.FC = () => {
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, Message[]>>({
        'c1': [{ id: 'm1', senderId: 'u1', text: 'Is this still available?', timestamp: Date.now() - 100000, isOwn: false }],
        'c2': [{ id: 'm2', senderId: 'me', text: 'Thanks for the order!', timestamp: Date.now() - 9000000, isOwn: true }]
    });
    const [inputText, setInputText] = useState('');
    const [isGeneratingReply, setIsGeneratingReply] = useState(false);

    const handleSend = () => {
        if(!inputText.trim() || !activeChat) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: inputText,
            timestamp: Date.now(),
            isOwn: true
        };
        setMessages(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMsg]
        }));
        setInputText('');
    };

    const handleAIReply = async () => {
        if (!activeChat) return;
        const chatMsgs = messages[activeChat] || [];
        const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
        
        // Don't reply to self
        if (!lastMsg || lastMsg.isOwn) return;

        setIsGeneratingReply(true);
        const reply = await generateSmartReply(lastMsg.text);
        setInputText(reply);
        setIsGeneratingReply(false);
    }

    if (activeChat) {
        const conversation = MOCK_CONVERSATIONS.find(c => c.id === activeChat);
        const otherUser: User = MOCK_USERS[conversation?.userId || ''] || { 
             id: 'unknown',
             username: 'User', 
             fullName: 'Unknown User',
             avatar: 'https://via.placeholder.com/150',
             bio: '',
             followers: 0,
             following: 0
        };
        const chatMessages = messages[activeChat] || [];

        return (
            <div className="flex flex-col h-screen bg-white z-50 fixed inset-0">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveChat(null)}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                             <img src={otherUser.avatar} className="w-8 h-8 rounded-full" />
                             <span className="font-bold">{otherUser.username}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 text-gray-800">
                        <Phone className="w-6 h-6 cursor-pointer" onClick={() => alert("Calling feature mock")} />
                        <Video className="w-6 h-6 cursor-pointer" onClick={() => alert("Video call feature mock")} />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {chatMessages.map(m => (
                        <div key={m.id} className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                m.isOwn ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'
                            }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white safe-pb">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleAIReply}
                            disabled={isGeneratingReply}
                            className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                            title="AI Smart Reply"
                        >
                             {isGeneratingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                        </button>
                        <input 
                            type="text" 
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
                            placeholder="Message..."
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} disabled={!inputText} className="text-blue-500 font-bold p-2">
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 bg-white min-h-screen">
             <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center justify-center">
                <h1 className="font-bold text-lg">{CURRENT_USER.username}</h1>
            </div>
            <div className="p-2">
                <div className="px-4 py-2 font-bold text-lg">Messages</div>
                {MOCK_CONVERSATIONS.map(c => {
                    const u = MOCK_USERS[c.userId];
                    return (
                        <div key={c.id} onClick={() => setActiveChat(c.id)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <img src={u.avatar} className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <div className="font-semibold text-sm">{u.username}</div>
                                <div className={`text-sm ${c.unreadCount > 0 ? 'font-bold text-black' : 'text-gray-500'}`}>
                                    {c.lastMessage}
                                </div>
                            </div>
                            {c.unreadCount > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ProfileView: React.FC<{ user: User; products: Product[] }> = ({ user, products }) => {
    return (
        <div className="pb-20 bg-white min-h-screen">
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center justify-between">
                <h1 className="font-bold text-lg">{user.username}</h1>
                <div className="flex gap-4">
                    <PlusSquare className="w-6 h-6" />
                    <Settings className="w-6 h-6" />
                </div>
            </div>

            <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                         <img src={user.avatar} className="w-20 h-20 rounded-full border border-gray-200" />
                         {user.isVerified && (
                             <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                             </div>
                         )}
                    </div>
                    <div className="flex gap-6 text-center">
                        <div>
                            <div className="font-bold text-lg">{products.length}</div>
                            <div className="text-xs text-gray-500">Posts</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{user.followers}</div>
                            <div className="text-xs text-gray-500">Followers</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{user.following}</div>
                            <div className="text-xs text-gray-500">Following</div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="font-bold">{user.fullName}</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{user.bio}</div>
                </div>

                <div className="flex gap-2 mb-6">
                    <button className="flex-1 bg-gray-100 font-semibold py-1.5 rounded-lg text-sm">Edit Profile</button>
                    <button className="flex-1 bg-gray-100 font-semibold py-1.5 rounded-lg text-sm">Share Profile</button>
                </div>
            </div>

            {/* Grid Tabs */}
            <div className="border-t border-b flex">
                <button className="flex-1 py-3 flex justify-center border-b-2 border-black">
                    <Grid className="w-6 h-6" />
                </button>
                <button className="flex-1 py-3 flex justify-center text-gray-400">
                     <UserIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-0.5">
                {products.map(p => (
                    <div key={p.id} className="aspect-square bg-gray-100 relative group cursor-pointer">
                        <img src={p.image} className="w-full h-full object-cover" />
                         {/* Price overlay on hover/tap */}
                         <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 rounded font-bold">
                             ${p.price}
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.FEED);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);

  const handleStoryClick = (story: Story) => {
    setActiveStory(story);
  };

  const handleStoryNext = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex(s => s.id === activeStory.id);
    if (currentIndex < stories.length - 1) {
      setActiveStory(stories[currentIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handleCreatePost = (newProduct: Product) => {
      setProducts([newProduct, ...products]);
  };

  const handleChatRequest = (userId: string) => {
    // In a real app, this would create a conversation or navigate to existing one
    console.log("Start chat with", userId);
    setView(ViewState.MESSAGES);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (view) {
      case ViewState.FEED:
        return (
          <div className="pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
              <span className="font-bold text-xl italic tracking-tighter">MarketSnap</span>
              <div className="flex gap-4">
                 <div className="relative">
                    <MessageCircle className="w-6 h-6 text-gray-800" onClick={() => setView(ViewState.MESSAGES)} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">2</div>
                 </div>
              </div>
            </div>

            {/* Stories */}
            <div className="py-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
              <div className="flex gap-4 px-4">
                {/* My Story Add */}
                 <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[70px]">
                    <div className="w-16 h-16 rounded-full p-[2px] relative">
                         <img src={CURRENT_USER.avatar} className="w-full h-full rounded-full object-cover border border-gray-200" />
                         <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                             <PlusSquare className="w-3 h-3" />
                         </div>
                    </div>
                    <span className="text-xs truncate w-full text-center">Your Story</span>
                </div>

                {stories.map(story => {
                   const u = MOCK_USERS[story.userId];
                   return (
                    <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer min-w-[70px]" onClick={() => handleStoryClick(story)}>
                        <div className={`w-16 h-16 rounded-full p-[2px] ${story.isViewed ? 'bg-gray-200' : 'bg-gradient-to-tr from-yellow-400 to-red-600'}`}>
                             <div className="bg-white p-[2px] rounded-full w-full h-full">
                                <img src={u?.avatar} className="w-full h-full rounded-full object-cover" />
                             </div>
                        </div>
                        <span className="text-xs truncate w-full text-center">{u?.username}</span>
                    </div>
                   );
                })}
              </div>
            </div>

            {/* Feed */}
            <div className="bg-gray-50">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onChat={handleChatRequest} />
              ))}
            </div>
          </div>
        );
      case ViewState.EXPLORE:
        return (
            <div className="pb-20">
                <div className="sticky top-0 z-30 bg-white p-2">
                    <div className="bg-gray-100 rounded-lg flex items-center px-3 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input type="text" placeholder="Search" className="bg-transparent w-full focus:outline-none text-sm"/>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-0.5">
                    {[...products, ...products, ...products].sort(() => 0.5 - Math.random()).map((p, i) => (
                        <div key={i} className="aspect-square relative">
                            <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        );
      case ViewState.CREATE:
        return <CreateView setView={setView} onPost={handleCreatePost} />;
      case ViewState.MESSAGES:
        return <MessagesView />;
      case ViewState.PROFILE:
        return <ProfileView user={CURRENT_USER} products={products.filter(p => p.sellerId === CURRENT_USER.id)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden">
      {renderContent()}
      
      {/* Global Navbar */}
      {view !== ViewState.MESSAGES && view !== ViewState.CREATE && <Navbar view={view} setView={setView} />}

      {/* Story Overlay */}
      {activeStory && (
        <StoryViewer 
          story={activeStory} 
          onClose={() => setActiveStory(null)} 
          onNext={handleStoryNext} 
        />
      )}
    </div>
  );
};

export default App;