import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Heart, Bookmark, MessageCircle, MoreHorizontal, LogOut, Settings, 
  Plus, X, Search, LayoutGrid, Image as ImageIcon, Film, Users,
  Grid, Lock, Play, Link as LinkIcon, Star, SendHorizontal, MessageSquare, Share2, ShieldAlert, Type, MoreVertical, Trash2, BadgeCheck, List, Eye, EyeOff
} from 'lucide-react';
import type { Database, Post, User, Message } from '../types';
import { ReelVideoItem, PostCardPreviewRef } from './Post';
import { ISLAMIC_IMAGES } from '../data';

export const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  }
};

interface PostDetailViewProps {
  post?: Post;
  db: Database;
  onBack: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onOpenComments: (id: string) => void;
  onOpenDetailMenu: (id: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  onUserClick: (username: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export function PostDetailView({ post, db, onBack, onLike, onSave, onShare, onOpenComments, onOpenDetailMenu, isLiked, isSaved, onUserClick, isMuted, toggleMute }: PostDetailViewProps) {
  const [hasError, setHasError] = useState(false);
  const author = db.users.find(u => u.id === post?.authorId);
  const likesCount = db.likes.filter(l => l.postId === post?.id).length;
  
  if (!post) return null;
  
  if (post.type === 'reel') { 
    return (
      <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[550] bg-black animate-in slide-in-from-right-10 duration-300">
        <ReelVideoItem reel={post} author={author} isLiked={isLiked} isSaved={isSaved} likesCount={db.likes.filter(l => l.postId === post.id).length} commentsCount={db.comments.filter(c => c.postId === post.id).length} hideCounts={db.users.find(u => u.id === post.authorId)?.hideReelCounts} onLike={onLike} onSave={onSave} onShare={onShare} onOpenComments={onOpenComments} onOpenDetailMenu={onOpenDetailMenu} onUserClick={onUserClick} isMuted={isMuted} toggleMute={toggleMute} showBack={true} onBack={onBack} />
      </div>
    ); 
  }

  const effectiveType = hasError ? 'text' : post.type;
  
  const parsedDate = new Date(Number(post.createdAt) ? Number(post.createdAt) : post.createdAt);
  const formattedDate = isNaN(parsedDate.getTime()) 
    ? post.createdAt 
    : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <div className="fixed inset-0 z-[550] bg-zinc-950 flex animate-in fade-in duration-300">
      <div className="w-full h-full overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row relative text-left text-zinc-100">
        
        {/* Mobile Nav */}
        <nav className="lg:hidden flex items-center p-4 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <span className="ml-4 font-bold text-xs tracking-widest uppercase text-zinc-400">Focus View</span>
        </nav>
        
        {/* Desktop Close Button - positioned outside the modal or top right of modal */}
        <button onClick={onBack} className="hidden lg:flex absolute top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all hover:scale-105 border border-white/10">
          <X className="w-5 h-5" />
        </button>

        {/* Image Section - takes up left side on desktop */}
        {effectiveType === 'image' && post.content && (
          <div className="relative w-full lg:w-3/5 bg-black flex items-center justify-center min-h-[50vh] lg:min-h-full border-b lg:border-b-0 lg:border-r border-white/5 shrink-0">
            {/* Blurred background for aspect ratio matching */}
            <div className="absolute inset-0 overflow-hidden">
               <img src={post.content} className="w-full h-full object-cover opacity-40 blur-3xl scale-125" alt="" />
            </div>
            <img src={post.content} onError={() => setHasError(true)} className="relative w-full max-h-[70vh] lg:max-h-full object-contain drop-shadow-2xl" alt="post" />
          </div>
        )}

        {/* Content Section - takes up right side on desktop */}
        <div className={`flex-grow overflow-visible lg:overflow-y-auto no-scrollbar pb-32 lg:pb-0 flex flex-col bg-gradient-to-b from-zinc-900/50 to-zinc-950 ${effectiveType === 'image' ? 'lg:w-2/5' : 'w-full max-w-4xl mx-auto'}`}>
          
          <div className="px-6 pt-8 lg:p-10 flex-grow">
            {/* Author Pill */}
            <div 
              onClick={() => author && onUserClick(author.username)}
              className="inline-flex items-center gap-3 mb-8 bg-white/5 hover:bg-white/10 transition-colors p-1.5 pr-5 rounded-full cursor-pointer border border-white/10 shadow-sm"
            >
              <img src={author?.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-zinc-800" alt="av" />
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                  {author?.displayName}
                  {author?.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 leading-none font-medium">@{author?.username}</p>
              </div>
            </div>

            {/* Content */}
            <h3 className={`font-extrabold text-white mb-4 leading-tight break-words whitespace-pre-wrap tracking-tight ${effectiveType === 'text' ? 'text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500' : 'text-2xl lg:text-3xl'}`}>
              {post.title}
            </h3>
            
            <p className={`text-zinc-300 mb-8 leading-relaxed break-words whitespace-pre-wrap ${effectiveType === 'text' ? 'text-xl lg:text-2xl font-medium text-zinc-400' : 'text-base lg:text-lg'}`}>
              {post.caption}
            </p>
            
            <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 mb-8 uppercase tracking-wider">
              <span>{formattedDate}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{likesCount} likes</span>
            </div>
          </div>

          {/* Action Bar - floating on mobile, fixed at bottom of right pane on desktop */}
          <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-2.5 rounded-full shadow-2xl flex justify-between items-center px-6 z-50">
            <div className="flex gap-6 items-center">
              <button onClick={() => onLike(post.id)} className="p-2 group transition-transform active:scale-90">
                <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-zinc-300'}`} />
              </button>
              <button onClick={() => onOpenComments(post.id)} className="p-2 group transition-transform active:scale-90">
                <MessageCircle className="w-6 h-6 text-white group-hover:text-zinc-300" />
              </button>
              <button onClick={() => onShare(post.id)} className="p-2 group transition-transform active:scale-90">
                <Share2 className="w-6 h-6 text-white group-hover:text-zinc-300" />
              </button>
              <button onClick={() => onSave(post.id)} className="p-2 group transition-transform active:scale-90">
                <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? 'fill-emerald-500 text-emerald-500' : 'text-white group-hover:text-zinc-300'}`} />
              </button>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <button onClick={() => onOpenDetailMenu(post.id)} className="p-2 group transition-transform active:scale-90">
              <MoreHorizontal className="w-6 h-6 text-zinc-400 group-hover:text-white" />
            </button>
          </div>
          
          {/* Desktop Action Bar */}
          <div className="hidden lg:flex w-full bg-zinc-950 border-t border-white/5 p-5 justify-between items-center px-8 mt-auto">
            <div className="flex gap-8 items-center">
              <button onClick={() => onLike(post.id)} className="flex items-center gap-2 group transition-transform active:scale-95">
                <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-400 group-hover:text-white'}`} />
                <span className={`text-sm font-bold ${isLiked ? 'text-red-500' : 'text-zinc-400 group-hover:text-white'}`}>Like</span>
              </button>
              <button onClick={() => onOpenComments(post.id)} className="flex items-center gap-2 group transition-transform active:scale-95">
                <MessageCircle className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white">Comment</span>
              </button>
              <button onClick={() => onShare(post.id)} className="flex items-center gap-2 group transition-transform active:scale-95">
                <Share2 className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white">Share</span>
              </button>
              <button onClick={() => onSave(post.id)} className="flex items-center gap-2 group transition-transform active:scale-95">
                <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? 'fill-emerald-500 text-emerald-500' : 'text-zinc-400 group-hover:text-white'}`} />
                <span className={`text-sm font-bold ${isSaved ? 'text-emerald-500' : 'text-zinc-400 group-hover:text-white'}`}>Save</span>
              </button>
            </div>
            <button onClick={() => onOpenDetailMenu(post.id)} className="p-2 group transition-transform active:scale-95 bg-white/5 hover:bg-white/10 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-zinc-300 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeedSliderViewProps {
  posts: Post[];
  startPostId?: string;
  db: Database;
  headerUser?: User;
  onBack: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onOpenActions: (id: string) => void;
  currentUser: User;
  onOpenComments: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onUserClick: (username: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export function FeedSliderView({ posts, startPostId, db, headerUser, onBack, onLike, onSave, onShare, onOpenActions, currentUser, onOpenComments, onOpenDetail, onUserClick, isMuted, toggleMute }: FeedSliderViewProps) {
  const postRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  useEffect(() => { 
    if (startPostId && postRefs.current[startPostId]) {
      postRefs.current[startPostId]?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [startPostId]);
  
  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[120] bg-zinc-950 flex flex-col animate-in slide-in-from-right-10 duration-300 text-left text-zinc-100">
      <nav className="flex items-center p-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-50 gap-4">
        <button onClick={onBack} className="p-1 text-zinc-400 hover:text-white transition-colors"><ChevronLeft className="w-6 h-6" /></button>
        {headerUser ? (
          <div className="flex items-center gap-3">
            <img src={headerUser.avatar} className="w-9 h-9 rounded-full bg-zinc-800 object-cover border border-zinc-800" alt="av" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">{headerUser.displayName}</span>
              <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                @{headerUser.username}
                {headerUser.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
              </span>
            </div>
          </div>
        ) : (
          <span className="font-bold text-sm">Posts</span>
        )}
      </nav>
      <div className="flex-grow overflow-y-auto no-scrollbar pb-24 px-4 pt-2">
        <div className="max-w-2xl mx-auto">
          {posts.map(post => (
            <PostCardPreviewRef 
              key={post.id} 
              ref={el => { postRefs.current[post.id] = el }} 
              post={post} 
              db={db} 
              currentUser={currentUser} 
              onLike={onLike} 
              onSave={onSave} 
              onShare={onShare}
              onUserClick={onUserClick} 
              onOpenComments={onOpenComments} 
              onOpenDetail={onOpenDetail} 
              onOpenActions={onOpenActions}
              hideHeader={false}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ReelsFeedViewProps {
  posts: Post[];
  startPostId?: string;
  db: Database;
  currentUser: User;
  onBack: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onOpenComments: (id: string) => void;
  onOpenDetailMenu: (id: string) => void;
  onUserClick: (username: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export function ReelsFeedView({ posts, startPostId, db, currentUser, onBack, onLike, onSave, onShare, onOpenComments, onOpenDetailMenu, onUserClick, isMuted, toggleMute }: ReelsFeedViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (startPostId && containerRef.current) {
      const el = document.getElementById(`reel-${startPostId}`);
      if (el) el.scrollIntoView({ behavior: 'auto' });
    }
  }, [startPostId]);

  return (
    <div ref={containerRef} className="h-full w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-black text-zinc-100 relative">
       <button onClick={onBack} className="absolute top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white"><ChevronLeft /></button>
       <div className="max-w-md mx-auto h-full relative">
         {posts.map(reel => {
           const author = db.users.find(u => u.id === reel.authorId);
           const isLiked = db.likes.some(l => l.postId === reel.id && l.userId === currentUser.id);
           const isSaved = db.saved.some(s => s.postId === reel.id && s.userId === currentUser.id);
           
           return (
             <div key={reel.id} id={`reel-${reel.id}`} className="h-full w-full snap-start snap-always relative">
                <ReelVideoItem 
                  reel={reel} 
                  author={author} 
                  isLiked={isLiked} 
                  isSaved={isSaved} 
                  likesCount={db.likes.filter(l => l.postId === reel.id).length}
                  commentsCount={db.comments.filter(c => c.postId === reel.id).length}
                  hideCounts={author?.hideReelCounts}
                  onLike={onLike} 
                  onSave={onSave} 
                  onShare={onShare}
                  onOpenComments={onOpenComments} 
                  onOpenDetailMenu={onOpenDetailMenu} 
                  onUserClick={onUserClick} 
                  isMuted={isMuted} 
                  toggleMute={toggleMute}
                />
             </div>
           );
         })}
       </div>
    </div>
  );
}

interface SearchViewProps {
  db: Database;
  loggedUserId: string | null;
  onUserClick: (username: string) => void;
  onOpenFeed: (posts: Post[], startId: string, type: 'slider') => void;
}

export function SearchView({ db, loggedUserId, onUserClick, onOpenFeed }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'posts' | 'reels'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter Users
  const filteredUsers = useMemo(() => {
    const allUsers = db.users.filter(u => u.id !== loggedUserId);
    // If exploring People (no query), show all users
    if (!query && activeTab === 'people') return allUsers; 
    // If exploring All/Posts/Reels (no query), generally hide users unless explicitly searching
    if (!query) return []; 
    
    const lower = query.toLowerCase();
    return allUsers.filter(u => u.username.toLowerCase().includes(lower) || u.displayName.toLowerCase().includes(lower));
  }, [db.users, query, loggedUserId, activeTab]);

  // Filter Posts
  const filteredPosts = useMemo(() => {
     let posts = db.posts;
     
     // Filter by query if present
     if (query) {
        const lower = query.toLowerCase();
        posts = posts.filter(p => p.title?.toLowerCase().includes(lower) || p.caption?.toLowerCase().includes(lower));
     }
     
     // Filter by type based on active tab
     if (activeTab === 'posts') {
        return posts.filter(p => p.type === 'image' || p.type === 'text');
     }
     if (activeTab === 'reels') {
        return posts.filter(p => p.type === 'reel');
     }
     // For 'all' or 'people' (people tab will hide this section anyway)
     return posts;
  }, [db.posts, query, activeTab]);
  
  return (
    <div className="h-full overflow-hidden flex flex-col bg-zinc-950 text-zinc-100">
      <div className="p-4 pb-2 sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900/50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-black text-white mb-4 tracking-tight">Explore</h1>
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm focus:border-emerald-500 outline-none text-white transition-all" 
              placeholder="Search creators, posts..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
            {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 p-1"><X className="w-4 h-4" /></button>}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'people', label: 'People' },
                { id: 'posts', label: 'Posts' },
                { id: 'reels', label: 'Reels' }
              ].map(tab => (
                  <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${activeTab === tab.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'}`}
                  >
                      {tab.label}
                  </button>
              ))}
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto no-scrollbar p-4 pt-2">
        <div className="max-w-2xl mx-auto">
          {/* Users Section: Show for 'People' tab OR 'All' tab with query */}
        {(activeTab === 'people' || (activeTab === 'all' && query)) && filteredUsers.length > 0 && (
           <div className="mb-6">
              {(activeTab === 'all' && query) && <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">People</p>}
              <div className="space-y-3">
                 {(activeTab === 'all' ? filteredUsers.slice(0, 3) : filteredUsers).map(u => (
                    <div key={u.id} onClick={() => onUserClick(u.username)} className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-2xl cursor-pointer active:scale-95 transition-transform">
                        <img src={u.avatar} className="w-12 h-12 rounded-full object-cover" alt="av" />
                        <div className="text-left">
                          <p className="font-bold text-white text-sm flex items-center gap-1">
                            @{u.username}
                            {u.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
                          </p>
                          <p className="text-zinc-500 text-xs">{u.displayName}</p>
                        </div>
                    </div>
                 ))}
                 {activeTab === 'all' && filteredUsers.length > 3 && (
                     <button onClick={() => setActiveTab('people')} className="w-full py-2 text-xs font-bold text-emerald-500 mt-2">See all people</button>
                 )}
              </div>
           </div>
        )}

        {/* Posts Grid: Show for All, Posts, Reels tabs (Hide for People) */}
        {activeTab !== 'people' && (
            <div>
               <div className="flex items-center justify-between mb-3">
                 {(activeTab === 'all' && query) && <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Posts & Reels</p>}
                 {(!query && activeTab === 'all') && <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Trending Posts</p>}
                 {(activeTab === 'posts' || activeTab === 'all') && (
                   <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800 ml-auto">
                     <button 
                       onClick={() => setViewMode('list')} 
                       className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                     >
                       <List className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => setViewMode('grid')} 
                       className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                     >
                       <Grid className="w-4 h-4" />
                     </button>
                   </div>
                 )}
               </div>
               
               {viewMode === 'grid' || activeTab === 'reels' ? (
                 <div className="grid grid-cols-3 gap-1">
                   {filteredPosts.map(post => (
                      <div key={post.id} onClick={() => onOpenFeed(filteredPosts, post.id, 'slider')} className="aspect-square bg-zinc-900 relative overflow-hidden cursor-pointer group">
                      {post.type === 'reel' ? (
                          <div className="w-full h-full relative">
                              <video src={post.content} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted />
                              <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white drop-shadow-md" fill="currentColor" />
                          </div>
                      ) : post.content ? (
                          <img src={post.content} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="p" />
                      ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-zinc-950 p-4 text-center border border-white/5 relative group-hover:border-emerald-500/30 transition-colors">
                              <div className="absolute top-2 left-2 p-1.5 bg-white/5 rounded-full">
                                <Type className="w-3 h-3 text-emerald-400" />
                              </div>
                              <p className="text-[11px] font-bold text-zinc-100 line-clamp-4 break-words leading-relaxed">{post.title}</p>
                          </div>
                      )}
                      {post.content && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                              <p className="text-[10px] font-medium text-white line-clamp-2 leading-tight">{post.title}</p>
                          </div>
                      )}
                      </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col gap-3">
                   {filteredPosts.map(post => {
                     const author = db.users.find(u => u.id === post.authorId);
                     const likesCount = db.likes.filter(l => l.postId === post.id).length;
                     const commentsCount = db.comments.filter(c => c.postId === post.id).length;
                     return (
                       <div key={post.id} onClick={() => onOpenFeed(filteredPosts, post.id, 'slider')} className="flex gap-3 bg-zinc-900/50 p-3 rounded-2xl cursor-pointer active:scale-95 transition-transform border border-zinc-800/50">
                         <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-800 relative">
                           {post.type === 'reel' ? (
                             <>
                               <video src={post.content} className="w-full h-full object-cover" muted />
                               <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white drop-shadow-md" fill="currentColor" />
                             </>
                           ) : post.content ? (
                             <img src={post.content} className="w-full h-full object-cover" alt="p" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-zinc-800 p-1 text-center">
                               <Type className="w-6 h-6 text-zinc-600" />
                             </div>
                           )}
                         </div>
                         <div className="flex flex-col justify-center flex-grow min-w-0">
                           <p className="font-bold text-white text-sm line-clamp-2 mb-1 leading-tight">{post.title}</p>
                           {author && (
                             <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                               <img src={author.avatar} className="w-4 h-4 rounded-full object-cover" alt="av" />
                               <span className="truncate">@{author.username}</span>
                             </div>
                           )}
                           <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-zinc-500">
                             <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {likesCount}</span>
                             <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {commentsCount}</span>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
               
               {filteredPosts.length === 0 && (
                   <div className="py-10 text-center text-zinc-500">
                       <p className="text-xs">No posts found</p>
                   </div>
               )}
            </div>
        )}
        
        {/* Empty State for People */}
        {activeTab === 'people' && filteredUsers.length === 0 && (
             <div className="py-10 text-center text-zinc-500">
                <p className="text-xs">No users found</p>
            </div>
        )}
        </div>
      </div>
    </div>
  );
}

interface ProfileViewProps {
  username: string;
  db: Database;
  loggedUserId: string | null;
  onBack?: () => void;
  onSettingsClick?: (mode?: 'logout') => void;
  onAddPostClick?: () => void;
  onListClick?: (type: 'followers' | 'following', id: string) => void;
  onFollowToggle?: (id: string) => void;
  onSliderOpen?: (username: string, startPostId: string, feedType: 'authored' | 'saved') => void;
  onProfileActionsClick?: (id: string) => void;
  onMessageClick?: (userId: string) => void;
  isTabMode: boolean;
}

export function ProfileView({ username, db, loggedUserId, onBack, onSettingsClick, onAddPostClick, onListClick, onFollowToggle, onSliderOpen, onProfileActionsClick, onMessageClick, isTabMode }: ProfileViewProps) {
  const user = db.users.find(u => u.username === username);
  const [tab, setTab] = useState<'grid' | 'saved'>('grid');
  
  if (!user) return <div className="p-10 text-center text-zinc-500">User not found</div>;

  const isMe = user.id === loggedUserId;
  const isFollowing = db.follows.some(f => f.followerId === loggedUserId && f.followingId === user.id);
  
  const posts = db.posts.filter(p => p.authorId === user.id);
  const savedIds = db.saved.filter(s => s.userId === user.id).map(s => s.postId);
  const savedPosts = db.posts.filter(p => savedIds.includes(p.id));
  
  const followersCount = db.follows.filter(f => f.followingId === user.id).length;
  const followingCount = db.follows.filter(f => f.followerId === user.id).length;
  const totalLikes = db.likes.filter(l => posts.map(p => p.id).includes(l.postId)).length;

  const canViewSaved = isMe || user.savedPublic;

  return (
    <div className="h-full bg-zinc-950 overflow-y-auto no-scrollbar text-zinc-100 text-left relative">
      {/* Sticky Nav Overlay */}
      <div className="sticky top-0 z-50 h-0 w-full overflow-visible">
         <div className="p-4 pt-6 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto">
              {(!isTabMode || onBack) && (
                 <button onClick={onBack} className="bg-black/30 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/50 transition-colors border border-white/10">
                   <ChevronLeft className="w-6 h-6" />
                 </button>
              )}
            </div>
            
            <div className="pointer-events-auto">
              {isMe ? (
                <button onClick={() => onSettingsClick && onSettingsClick()} className="bg-black/30 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/50 transition-colors border border-white/10">
                  <Settings className="w-6 h-6" />
                </button>
              ) : (
                <button onClick={() => onProfileActionsClick && onProfileActionsClick(user.id)} className="bg-black/30 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/50 transition-colors border border-white/10">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              )}
            </div>
         </div>
      </div>

      {/* Header Background */}
      <div className="h-56 w-full relative shrink-0">
         {user.coverImage ? (
           <img src={user.coverImage} className="w-full h-full object-cover" alt="cover" />
         ) : (
           <div className="w-full h-full bg-emerald-600" />
         )}
         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="bg-zinc-950 relative rounded-t-[32px] -mt-10 min-h-[calc(100vh-10rem)] px-6 pt-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="max-w-2xl mx-auto">
         {/* Avatar & Action Button Row */}
         <div className="flex justify-between items-end -mt-14 mb-4 relative z-20">
             <div className="p-1.5 bg-zinc-950 rounded-full">
                <img src={user.avatar} className="w-28 h-28 rounded-full object-cover border-4 border-zinc-950 bg-zinc-800 shadow-xl" alt="av" />
             </div>
             <div className="mb-2 flex gap-2">
                {isMe ? (
                   <button onClick={onAddPostClick} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-5 py-2.5 rounded-full font-bold text-xs hover:bg-emerald-500/20 transition-colors">
                     <Plus className="w-4 h-4" /> New Post
                   </button>
                ) : (
                   <>
                    <button 
                      onClick={() => onMessageClick && onMessageClick(user.id)} 
                      className="bg-zinc-800 text-zinc-200 border border-zinc-700 px-5 py-2.5 rounded-full font-bold text-xs hover:bg-zinc-700 transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> {user.messagePrivacy === 'request' ? 'Request' : 'Chat'}
                    </button>
                    <button onClick={() => onFollowToggle && onFollowToggle(user.id)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${isFollowing ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'}`}>
                        {isFollowing ? 'Following' : '+ Friend'}
                    </button>
                   </>
                )}
             </div>
         </div>

         {/* User Info & Stats */}
         <div className="flex justify-between items-start mb-6">
            <div>
               <h2 className="text-xl font-black text-white leading-tight flex items-center gap-1">
                 {user.displayName}
                 {user.isVerified && <BadgeCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />}
               </h2>
               <p className="text-sm text-zinc-500 font-medium">@{user.username}</p>
            </div>
            <div className="flex gap-6 text-right">
               <div className="flex flex-col items-center cursor-pointer" onClick={() => onListClick && onListClick('followers', user.id)}>
                  <span className="font-black text-lg text-white">{followersCount}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Followers</span>
               </div>
               <div className="flex flex-col items-center cursor-pointer" onClick={() => onListClick && onListClick('following', user.id)}>
                  <span className="font-black text-lg text-white">{followingCount}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Following</span>
               </div>
            </div>
         </div>

         {/* Bio */}
         <p className="text-sm text-zinc-300 mb-8 leading-relaxed font-normal">{user.bio}</p>

         {/* Dashboard Cards */}
         <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800/50 flex flex-col justify-between h-28">
               <div className="p-2 bg-yellow-500/10 rounded-full w-fit"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /></div>
               <div>
                  <span className="block font-black text-xl text-white">{posts.length}</span>
                  <span className="text-xs text-zinc-500 font-medium">Total Posts</span>
               </div>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800/50 flex flex-col justify-between h-28">
               <div className="p-2 bg-pink-500/10 rounded-full w-fit"><Heart className="w-5 h-5 text-pink-500 fill-pink-500" /></div>
               <div>
                  <span className="block font-black text-xl text-white">{totalLikes}</span>
                  <span className="text-xs text-zinc-500 font-medium">Likes Received</span>
               </div>
            </div>
         </div>

         {/* Content Section */}
         <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] p-2 min-h-[300px]">
            {/* Tabs */}
            <div className="flex p-1 bg-zinc-950/50 rounded-[28px] mb-3">
               <button onClick={() => setTab('grid')} className={`flex-1 py-3 rounded-[24px] font-bold text-xs transition-all flex items-center justify-center gap-2 ${tab === 'grid' ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <LayoutGrid className="w-4 h-4" /> My Posts
               </button>
               <button onClick={() => setTab('saved')} className={`flex-1 py-3 rounded-[24px] font-bold text-xs transition-all flex items-center justify-center gap-2 ${tab === 'saved' ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {canViewSaved ? <Bookmark className="w-4 h-4" /> : <Lock className="w-4 h-4" />} Saved
               </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1">
             {tab === 'grid' ? (
               posts.map(post => (
                 <div key={post.id} onClick={() => onSliderOpen && onSliderOpen(user.username, post.id, 'authored')} className="aspect-square bg-zinc-800 rounded-2xl relative cursor-pointer overflow-hidden group border border-zinc-700/30">
                   {post.type === 'reel' ? (
                     <video src={post.content} className="w-full h-full object-cover" muted />
                   ) : post.content ? (
                     <img src={post.content} className="w-full h-full object-cover" alt="p" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-zinc-950 p-4 text-center border border-white/5 relative group-hover:border-emerald-500/30 transition-colors">
                       <div className="absolute top-2 left-2 p-1.5 bg-white/5 rounded-full">
                         <Type className="w-3 h-3 text-emerald-400" />
                       </div>
                       <p className="text-[11px] font-bold text-zinc-100 line-clamp-4 break-words leading-relaxed">{post.title}</p>
                     </div>
                   )}
                   {post.type === 'reel' && <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full"><Play className="w-3 h-3 text-white drop-shadow-md" fill="currentColor" /></div>}
                   {post.content && (
                     <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                       <p className="text-[10px] font-medium text-white line-clamp-2 leading-tight">{post.title}</p>
                     </div>
                   )}
                 </div>
               ))
             ) : (
                canViewSaved ? (
                  savedPosts.map(post => (
                   <div key={post.id} onClick={() => onSliderOpen && onSliderOpen(user.username, post.id, 'saved')} className="aspect-square bg-zinc-800 rounded-2xl relative cursor-pointer overflow-hidden group border border-zinc-700/30">
                     {post.content ? (
                       post.type === 'reel' ? <video src={post.content} className="w-full h-full object-cover" muted /> : <img src={post.content} className="w-full h-full object-cover" alt="p" />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-zinc-950 p-4 text-center border border-white/5 relative group-hover:border-emerald-500/30 transition-colors">
                         <div className="absolute top-2 left-2 p-1.5 bg-white/5 rounded-full">
                           <Type className="w-3 h-3 text-emerald-400" />
                         </div>
                         <p className="text-[11px] font-bold text-zinc-100 line-clamp-4 break-words leading-relaxed">{post.title}</p>
                       </div>
                     )}
                     {post.type === 'reel' && <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full"><Play className="w-3 h-3 text-white drop-shadow-md" fill="currentColor" /></div>}
                     {post.content && (
                       <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                         <p className="text-[10px] font-medium text-white line-clamp-2 leading-tight">{post.title}</p>
                       </div>
                     )}
                   </div>
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center text-zinc-500 flex flex-col items-center">
                    <div className="p-4 bg-zinc-900 rounded-full mb-3 border border-zinc-800"><Lock className="w-6 h-6 text-zinc-400" /></div>
                    <p className="text-xs font-bold">Saved posts are private</p>
                  </div>
                )
             )}
             {((tab === 'grid' && posts.length === 0) || (tab === 'saved' && savedPosts.length === 0 && canViewSaved)) && (
                <div className="col-span-3 py-16 text-center text-zinc-500 flex flex-col items-center">
                  <div className="p-4 bg-zinc-900 rounded-full mb-3 border border-zinc-800"><LayoutGrid className="w-6 h-6 text-zinc-400" /></div>
                  <p className="text-sm font-bold text-zinc-400">No posts yet</p>
                </div>
             )}
            </div>
         </div>
         
         <div className="h-20" /> {/* Spacer for bottom nav */}
         </div>
      </div>
    </div>
  );
}

interface CreatePostViewProps {
  onClose: () => void;
  onPublish: (post: Omit<Post, 'id' | 'authorId' | 'createdAt'>) => void;
  isVerified?: boolean;
}

export function CreatePostView({ onClose, onPublish, isVerified }: CreatePostViewProps) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [type, setType] = useState<'image' | 'reel' | 'text'>('image');
  
  // States for Image Posts
  const [imageSource, setImageSource] = useState<'stock' | 'custom'>('stock');
  const [selectedStockImage, setSelectedStockImage] = useState(ISLAMIC_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // States for Reel Posts
  const [videoUrl, setVideoUrl] = useState("");
  const [coverSource, setCoverSource] = useState<'stock' | 'custom'>('stock');
  const [selectedStockCover, setSelectedStockCover] = useState(ISLAMIC_IMAGES[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState("");

  const handlePublish = () => {
    if (!title || !caption) return;
    
    let content = "";
    let thumbnail = undefined;

    if (type === 'image') {
      content = imageSource === 'stock' ? selectedStockImage : customImageUrl;
      if(!content) return;
    } else if (type === 'reel') {
      content = videoUrl;
      thumbnail = coverSource === 'stock' ? selectedStockCover : customCoverUrl;
      if(!content) return;
    } else {
      content = ""; // Text only posts don't have content
    }

    onPublish({
      title,
      caption,
      type,
      content,
      thumbnail
    });
  };

  const isPublishDisabled = !title || !caption || (type === 'image' && (imageSource === 'custom' && !customImageUrl)) || (type === 'reel' && (!videoUrl));

  return (
    <div className="h-full bg-zinc-950 flex flex-col animate-in slide-in-from-bottom duration-300">
      <nav className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-50">
        <button onClick={onClose}><X className="w-6 h-6 text-zinc-400" /></button>
        <h2 className="font-bold text-white">New Post</h2>
        <button onClick={handlePublish} className="text-emerald-500 font-bold text-sm disabled:opacity-50 transition-opacity" disabled={isPublishDisabled}>Share</button>
      </nav>
      <div className="p-6 flex-grow overflow-y-auto no-scrollbar text-left text-zinc-100">
         
         {/* Type Selector */}
         <div className="flex gap-2 mb-6">
           <button onClick={() => setType('image')} className={`flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${type === 'image' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}><ImageIcon className="w-4 h-4" /> <span className="text-sm font-bold">Image</span></button>
           {isVerified && (
             <button 
               onClick={() => setType('reel')} 
               className={`flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${type === 'reel' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
             >
               <Film className="w-4 h-4" /> <span className="text-sm font-bold">Reel</span>
             </button>
           )}
           <button onClick={() => setType('text')} className={`flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${type === 'text' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}><Type className="w-4 h-4" /> <span className="text-sm font-bold">Text</span></button>
         </div>
         
         {/* Content Input Section */}
         {type !== 'text' && (
           <div className="mb-6">
             <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
               {type === 'image' ? 'Image Source' : 'Video URL'}
             </label>

             {type === 'image' ? (
             <>
               <div className="flex mb-3 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button onClick={() => setImageSource('stock')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === 'stock' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>Stock</button>
                  <button onClick={() => setImageSource('custom')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === 'custom' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>Upload URL</button>
               </div>
               
               {imageSource === 'stock' ? (
                 <>
                    <div className="h-48 bg-zinc-900 rounded-2xl overflow-hidden mb-3 border border-zinc-800">
                      <img src={selectedStockImage} className="w-full h-full object-cover" alt="sel" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                      {ISLAMIC_IMAGES.map((img, i) => (
                        <button key={i} onClick={() => setSelectedStockImage(img)} className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedStockImage === img ? 'border-emerald-500' : 'border-transparent'}`}>
                          <img src={img} className="w-full h-full object-cover" alt="opt" />
                        </button>
                      ))}
                    </div>
                 </>
               ) : (
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-emerald-500 text-sm" 
                      placeholder="Paste image URL..." 
                      value={customImageUrl} 
                      onChange={e => setCustomImageUrl(e.target.value)} 
                    />
                  </div>
               )}
             </>
           ) : (
             <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-emerald-500 text-sm" 
                  placeholder="Paste video URL (mp4)..." 
                  value={videoUrl} 
                  onChange={e => setVideoUrl(e.target.value)} 
                />
             </div>
           )}
         </div>
         )}

         {/* Reel Cover Image Selection */}
         {type === 'reel' && (
           <div className="mb-6">
             <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cover Image</label>
             <div className="flex mb-3 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button onClick={() => setCoverSource('stock')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${coverSource === 'stock' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>Stock</button>
                <button onClick={() => setCoverSource('custom')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${coverSource === 'custom' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>Upload URL</button>
             </div>

             {coverSource === 'stock' ? (
                 <>
                    <div className="h-32 bg-zinc-900 rounded-2xl overflow-hidden mb-3 border border-zinc-800">
                      <img src={selectedStockCover} className="w-full h-full object-cover" alt="sel" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                      {ISLAMIC_IMAGES.map((img, i) => (
                        <button key={i} onClick={() => setSelectedStockCover(img)} className={`w-12 h-12 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedStockCover === img ? 'border-emerald-500' : 'border-transparent'}`}>
                          <img src={img} className="w-full h-full object-cover" alt="opt" />
                        </button>
                      ))}
                    </div>
                 </>
             ) : (
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-emerald-500 text-sm" 
                    placeholder="Paste cover image URL..." 
                    value={customCoverUrl} 
                    onChange={e => setCustomCoverUrl(e.target.value)} 
                  />
                </div>
             )}
           </div>
         )}

         {/* Common Fields */}
         <div className="space-y-4">
           <div>
             <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Title</label>
               <span className={`text-xs ${title.length >= 70 ? 'text-red-500' : 'text-zinc-500'}`}>{title.length}/70</span>
             </div>
             <input maxLength={70} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 text-sm" placeholder="Give it a title" value={title} onChange={e => setTitle(e.target.value)} />
           </div>
           <div>
             <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Caption</label>
             <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 h-32 resize-none text-sm" placeholder="Write a caption..." value={caption} onChange={e => setCaption(e.target.value)} />
           </div>
         </div>
      </div>
    </div>
  );
}

interface SettingsViewProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
  onLogout: () => void;
}

export function SettingsView({ user, onClose, onSave, onLogout }: SettingsViewProps) {
  const [formData, setFormData] = useState(user);
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  if (isEditingCredentials) {
    return (
      <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[960] bg-zinc-950 flex flex-col animate-in slide-in-from-right duration-300">
        <nav className="flex items-center justify-between p-4 border-b border-zinc-900">
          <button onClick={() => setIsEditingCredentials(false)}><ChevronLeft className="w-6 h-6 text-zinc-400" /></button>
          <h2 className="font-bold text-white">Edit Credentials</h2>
          <button onClick={() => { onSave(formData); setIsEditingCredentials(false); }} className="text-emerald-500 font-bold text-sm">Save</button>
        </nav>
        <div className="p-6 flex-grow overflow-y-auto no-scrollbar space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Username</label>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Leave blank to keep current" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pr-12 text-white outline-none focus:border-emerald-500" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[950] bg-zinc-950 flex flex-col animate-in slide-in-from-right duration-300">
      <nav className="flex items-center justify-between p-4 border-b border-zinc-900">
        <button onClick={onClose}><ChevronLeft className="w-6 h-6 text-zinc-400" /></button>
        <h2 className="font-bold text-white">Settings</h2>
        <button onClick={() => onSave(formData)} className="text-emerald-500 font-bold text-sm">Save</button>
      </nav>
      <div className="p-6 flex-grow overflow-y-auto no-scrollbar">
        {/* Cover Image Edit Preview */}
        <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-10 group bg-zinc-900 border border-zinc-800">
            {formData.coverImage ? (
                <img src={formData.coverImage} className="w-full h-full object-cover transition-opacity" alt="cover" />
            ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 font-bold text-xs uppercase tracking-widest">No Cover Image</div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <p className="text-xs font-bold text-white bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">Cover Preview</p>
            </div>
        </div>

        {/* Avatar Edit Preview - Overlapping */}
        <div className="flex justify-center -mt-24 mb-8 relative z-10">
          <div className="relative">
            <img src={formData.avatar} className="w-24 h-24 rounded-full bg-zinc-900 object-cover border-4 border-zinc-950 shadow-xl" alt="av" />
            <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full text-white border-4 border-zinc-950"><ImageIcon className="w-3 h-3" /></div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Display Name</label>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Bio</label>
            <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500 resize-none h-24" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Avatar URL</label>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500 text-sm" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cover Image URL</label>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500 text-sm" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
          </div>

          <button onClick={() => setIsEditingCredentials(true)} className="w-full p-4 flex items-center justify-between text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl font-bold transition-colors">
            <span>Edit Username / Password</span>
            <ChevronLeft className="w-5 h-5 rotate-180 text-zinc-500" />
          </button>

          <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
             <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Privacy Settings</p>
             
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-300">Public Saved Posts</span>
                <button onClick={() => setFormData({...formData, savedPublic: !formData.savedPublic})} className={`w-12 h-7 rounded-full transition-colors relative ${formData.savedPublic ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${formData.savedPublic ? 'left-6' : 'left-1'}`} />
                </button>
             </div>

             <div className="pt-2 border-t border-zinc-800/50">
                <span className="block text-sm font-bold text-zinc-300 mb-3">Messaging Privacy</span>
                <div className="flex gap-2">
                   <button 
                      onClick={() => setFormData({...formData, messagePrivacy: 'anyone'})}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${formData.messagePrivacy === 'anyone' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                   >
                      Anyone
                   </button>
                   <button 
                      onClick={() => setFormData({...formData, messagePrivacy: 'request'})}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${formData.messagePrivacy === 'request' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                   >
                      Request Needed
                   </button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 italic flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {formData.messagePrivacy === 'request' ? 'Strangers will need to request to chat.' : 'Anyone can message you directly.'}</p>
             </div>

             <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-bold text-zinc-300">Hide Reel Counts</span>
                  <span className="text-[10px] text-zinc-500">Hide likes and comments count on reels</span>
                </div>
                <button onClick={() => setFormData({...formData, hideReelCounts: !formData.hideReelCounts})} className={`w-12 h-7 rounded-full transition-colors relative ${formData.hideReelCounts ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${formData.hideReelCounts ? 'left-6' : 'left-1'}`} />
                </button>
             </div>
          </div>
          
          <button onClick={onLogout} className="w-full p-4 mt-8 flex items-center justify-center gap-3 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-bold">
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserListViewProps {
  type: 'followers' | 'following';
  targetUserId: string;
  db: Database;
  loggedUserId: string | null;
  onClose: () => void;
  onUserClick: (username: string) => void;
  onFollow: (id: string) => void;
}

export function UserListView({ type, targetUserId, db, loggedUserId, onClose, onUserClick, onFollow }: UserListViewProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(type);
  const targetUser = db.users.find(u => u.id === targetUserId);
  
  const followerIds = db.follows.filter(f => f.followingId === targetUserId).map(f => f.followerId);
  const followingIds = db.follows.filter(f => f.followerId === targetUserId).map(f => f.followingId);
    
  const userIds = activeTab === 'followers' ? followerIds : followingIds;
  const users = db.users.filter(u => userIds.includes(u.id));

  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[900] flex flex-col justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-950 w-full rounded-t-[32px] h-[75vh] flex flex-col shadow-2xl border-t border-zinc-800 animate-in slide-in-from-bottom-full duration-300">
        <div className="flex flex-col items-center py-3 text-white">
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-4"></div>
          <span className="text-sm font-bold text-white mb-2">@{targetUser?.username}</span>
        </div>
        
        <div className="flex px-4 border-b border-zinc-900 mb-2">
          <button 
            onClick={() => setActiveTab('followers')}
            className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${activeTab === 'followers' ? 'text-white' : 'text-zinc-500'}`}
          >
            Followers
            {activeTab === 'followers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${activeTab === 'following' ? 'text-white' : 'text-zinc-500'}`}
          >
            Following
            {activeTab === 'following' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar p-4">
          {users.map(u => {
            const isFollowing = db.follows.some(f => f.followerId === loggedUserId && f.followingId === u.id);
            const isMe = u.id === loggedUserId;
            return (
              <div key={u.id} className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => { onClose(); onUserClick(u.username); }}>
                  <img src={u.avatar} className="w-12 h-12 rounded-full object-cover bg-zinc-800" alt="av" />
                  <div>
                    <p className="font-bold text-sm text-white flex items-center gap-1">
                      @{u.username}
                      {u.isVerified && <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />}
                    </p>
                    <p className="text-xs text-zinc-500">{u.displayName}</p>
                  </div>
                </div>
                {!isMe && (
                  <button 
                    onClick={() => onFollow(u.id)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${isFollowing ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' : 'bg-emerald-500 text-white'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            );
          })}
          {users.length === 0 && (
            <div className="py-20 text-center opacity-40">
              <Users className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
              <p className="text-xs font-bold text-zinc-500">No {activeTab} found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- CHATS FEATURE ---

interface ChatsViewProps {
  db: Database;
  loggedUserId: string;
  onClose: () => void;
  onOpenChat: (userId: string) => void;
  onOpenRequests: () => void;
}

export function ChatsView({ db, loggedUserId, onClose, onOpenChat, onOpenRequests }: ChatsViewProps) {
  const [query, setQuery] = useState("");
  
  // Find all users the current user has exchanged messages with
  const chatPartners = useMemo(() => {
    const ids = new Set<string>();
    db.messages.forEach(m => {
      const isPendingReceivedRequest = db.chatRequests.some(r => r.senderId === m.senderId && r.receiverId === loggedUserId && r.status === 'pending');
      
      if (m.senderId === loggedUserId) ids.add(m.receiverId);
      if (m.receiverId === loggedUserId && !isPendingReceivedRequest) ids.add(m.senderId);
    });
    return db.users.filter(u => ids.has(u.id));
  }, [db.messages, db.chatRequests, loggedUserId, db.users]);

  // Search for new users to chat with
  const searchResults = useMemo(() => {
    if (!query) return [];
    return db.users.filter(u => u.id !== loggedUserId && 
      (u.username.toLowerCase().includes(query.toLowerCase()) || 
       u.displayName.toLowerCase().includes(query.toLowerCase())));
  }, [db.users, query, loggedUserId]);

  const getLatestMessage = (partnerId: string) => {
    const msgs = db.messages
      .filter(m => (m.senderId === loggedUserId && m.receiverId === partnerId) || 
                   (m.senderId === partnerId && m.receiverId === loggedUserId));
    if (msgs.length === 0) return null;
    return msgs.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0))[0];
  };

  const getUnreadCount = (partnerId: string) => {
    return db.messages.filter(m => m.senderId === partnerId && m.receiverId === loggedUserId && !m.read).length;
  };

  const sortedChatPartners = useMemo(() => {
    return [...chatPartners].sort((a, b) => {
      const latestA = getLatestMessage(a.id);
      const latestB = getLatestMessage(b.id);
      const timeA = latestA ? new Date(latestA.createdAt).getTime() : 0;
      const timeB = latestB ? new Date(latestB.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [chatPartners, db.messages, loggedUserId]);

  const pendingRequestsCount = db.chatRequests.filter(r => r.receiverId === loggedUserId && r.status === 'pending').length;

  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[1000] bg-zinc-950 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="w-full h-full flex flex-col bg-zinc-950">
        <nav className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-50">
        <div className="flex items-center">
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
          <span className="ml-4 font-black text-lg text-white">Messages</span>
        </div>
        <button onClick={onOpenRequests} className="relative p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full">
          <MessageSquare className="w-5 h-5" />
          {pendingRequestsCount > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-950"></span>
          )}
        </button>
      </nav>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-emerald-500 outline-none" 
            placeholder="Search for people..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        {query ? (
          <div className="px-4">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">Search Results</p>
            {searchResults.map(u => (
              <div key={u.id} onClick={() => onOpenChat(u.id)} className="flex items-center justify-between mb-4 bg-zinc-900/40 p-3 rounded-2xl cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src={u.avatar} className="w-12 h-12 rounded-full object-cover" alt="av" />
                  <div className="text-left">
                    <p className="font-bold text-white text-sm flex items-center gap-1">
                      @{u.username}
                      {u.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
                    </p>
                    <p className="text-zinc-500 text-xs">{u.displayName}</p>
                  </div>
                </div>
                {u.messagePrivacy === 'request' && <span className="text-[8px] font-black uppercase text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded-md bg-emerald-500/5">Request</span>}
              </div>
            ))}
            {searchResults.length === 0 && <p className="text-center text-zinc-600 text-xs mt-10">No users found</p>}
          </div>
        ) : (
          <div className="px-4">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">Direct Messages</p>
            {sortedChatPartners.map(u => {
              const latest = getLatestMessage(u.id);
              const unreadCount = getUnreadCount(u.id);
              const isUnread = unreadCount > 0;
              
              return (
                <div key={u.id} onClick={() => onOpenChat(u.id)} className="flex items-center gap-4 mb-4 hover:bg-zinc-900/30 p-2 rounded-2xl cursor-pointer transition-colors">
                  <div className="relative">
                    <img src={u.avatar} className="w-14 h-14 rounded-full object-cover border border-zinc-800" alt="av" />
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-sm flex items-center gap-1 ${isUnread ? 'font-black text-white' : 'font-bold text-zinc-200'}`}>
                        @{u.username}
                        {u.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
                      </p>
                      <span className={`text-[10px] ${isUnread ? 'text-emerald-500 font-bold' : 'text-zinc-600'}`}>
                        {latest ? formatMessageTime(latest.createdAt) : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate w-48 ${isUnread ? 'text-white font-medium' : 'text-zinc-500'}`}>
                      {latest?.text || (latest?.sharedPostId ? 'Shared a post' : '')}
                    </p>
                  </div>
                </div>
              );
            })}
            {sortedChatPartners.length === 0 && (
              <div className="py-20 text-center opacity-40">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
                <p className="text-xs font-bold text-zinc-500">No conversations yet</p>
                <p className="text-[10px] text-zinc-600 mt-2">Start a new message by searching above</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

interface ChatRequestsViewProps {
  db: Database;
  loggedUserId: string;
  onClose: () => void;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onOpenChat: (userId: string) => void;
}

export function ChatRequestsView({ db, loggedUserId, onClose, onAccept, onReject, onOpenChat }: ChatRequestsViewProps) {
  const pendingRequests = db.chatRequests.filter(r => r.receiverId === loggedUserId && r.status === 'pending');

  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[1050] bg-zinc-950 flex flex-col animate-in slide-in-from-right duration-300">
      <nav className="flex items-center p-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-50">
        <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
        <span className="ml-4 font-black text-lg text-white">Message Requests</span>
      </nav>
      
      <div className="flex-grow overflow-y-auto p-4">
        {pendingRequests.map(req => {
          const sender = db.users.find(u => u.id === req.senderId);
          if (!sender) return null;
          
          const requestMessage = db.messages.find(m => m.senderId === req.senderId && m.receiverId === loggedUserId);

          return (
            <div key={req.id} className="bg-zinc-900/50 p-4 rounded-2xl mb-4 border border-zinc-800">
              <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => onOpenChat(sender.id)}>
                <img src={sender.avatar} className="w-12 h-12 rounded-full object-cover" alt="av" />
                <div>
                  <p className="font-bold text-white text-sm flex items-center gap-1">
                    @{sender.username}
                    {sender.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
                  </p>
                  <p className="text-zinc-500 text-xs">{sender.displayName}</p>
                </div>
              </div>
              {requestMessage && (
                <div className="bg-zinc-950 p-3 rounded-xl mb-4 text-sm text-zinc-300 border border-zinc-900">
                  {requestMessage.text || (requestMessage.sharedPostId ? 'Shared a post' : '')}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => onReject(req.id)} className="flex-1 py-2 rounded-xl font-bold text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">Delete</button>
                <button onClick={() => onAccept(req.id)} className="flex-1 py-2 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Accept</button>
              </div>
            </div>
          );
        })}
        {pendingRequests.length === 0 && (
          <div className="py-20 text-center opacity-40">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <p className="text-xs font-bold text-zinc-500">No pending requests</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ChatRoomViewProps {
  db: Database;
  loggedUserId: string;
  partnerId: string;
  onBack: () => void;
  onSendMessage: (receiverId: string, text: string, sharedPostId?: string, replyToId?: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onDeleteForMe: (messageId: string) => void;
  onOpenPost: (postId: string) => void;
  onAcceptRequest?: (requestId: string) => void;
  onRejectRequest?: (requestId: string) => void;
}

export function ChatRoomView({ db, loggedUserId, partnerId, onBack, onSendMessage, onDeleteMessage, onDeleteForMe, onOpenPost, onAcceptRequest, onRejectRequest }: ChatRoomViewProps) {
  const partner = db.users.find(u => u.id === partnerId);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<{ id: string, x: number, y: number, isMe: boolean } | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);

  const messages = useMemo(() => {
    return db.messages
      .filter(m => !m.deletedFor?.includes(loggedUserId))
      .filter(m => (m.senderId === loggedUserId && m.receiverId === partnerId) || 
                   (m.senderId === partnerId && m.receiverId === loggedUserId))
      .sort((a, b) => (new Date(a.createdAt).getTime() || 0) - (new Date(b.createdAt).getTime() || 0));
  }, [db.messages, loggedUserId, partnerId]);

  const hasPartnerReplied = db.messages.some(m => m.senderId === partnerId && m.receiverId === loggedUserId);
  const existingRequest = db.chatRequests.find(r => r.senderId === loggedUserId && r.receiverId === partnerId);
  const isRequestPending = partner?.messagePrivacy === 'request' && !hasPartnerReplied && existingRequest?.status === 'pending';
  const receivedRequest = db.chatRequests.find(r => r.senderId === partnerId && r.receiverId === loggedUserId && r.status === 'pending');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() && !replyingTo) return;
    onSendMessage(partnerId, text, undefined, replyingTo?.id);
    setText("");
    setReplyingTo(null);
  };

  const handleForward = (targetUserId: string) => {
    if (!forwardingMessage) return;
    onSendMessage(targetUserId, forwardingMessage.text, forwardingMessage.sharedPostId);
    setForwardingMessage(null);
    setActiveContextMenu(null);
  };

  const handleContextMenuClick = (e: React.MouseEvent, id: string, isMe: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeContextMenu?.id === id) {
      setActiveContextMenu(null);
    } else {
      // Position slightly above the click
      setActiveContextMenu({ id, x: e.clientX, y: window.innerHeight - e.clientY + 10, isMe });
    }
  };

  if (!partner) return null;

  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[1100] bg-zinc-950 flex flex-col animate-in slide-in-from-right duration-300">
      {activeContextMenu && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={(e) => { e.stopPropagation(); setActiveContextMenu(null); }}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setActiveContextMenu(null); }}
        />
      )}
      <nav className="flex items-center p-4 border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-50 gap-4">
        <button onClick={onBack} className="p-1 text-zinc-400 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
        <div className="flex items-center gap-3">
          <img src={partner.avatar} className="w-9 h-9 rounded-full object-cover" alt="av" />
          <div className="text-left">
            <p className="font-bold text-sm text-white flex items-center gap-1">
              {partner.displayName}
              {partner.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
            </p>
          </div>
        </div>
      </nav>

      <div ref={scrollRef} className="flex-grow overflow-y-auto no-scrollbar p-5 space-y-4">
        {messages.map(m => {
          const isMe = m.senderId === loggedUserId;
          const sharedPost = m.sharedPostId ? db.posts.find(p => p.id === m.sharedPostId) : null;
          const postAuthor = sharedPost ? db.users.find(u => u.id === sharedPost.authorId) : null;
          
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>
              {m.replyToId && (
                <div className={`text-[10px] mb-1 px-3 py-1.5 rounded-xl bg-zinc-800/50 text-zinc-400 max-w-[70%] truncate border-l-2 ${isMe ? 'border-emerald-500' : 'border-zinc-500'}`}>
                  <span className="font-bold text-zinc-300 mr-1">
                    {db.messages.find(rm => rm.id === m.replyToId)?.senderId === loggedUserId ? 'You' : partner.displayName}:
                  </span>
                  {db.messages.find(rm => rm.id === m.replyToId)?.text || 'Shared a post'}
                </div>
              )}
              {sharedPost && (
                <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div 
                    onClick={() => onOpenPost(sharedPost.id)}
                    className={`max-w-[70%] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-emerald-500/50 transition-colors shadow-lg`}
                  >
                    <img src={sharedPost.type === 'reel' ? (sharedPost.thumbnail || sharedPost.content) : sharedPost.content} className="w-full aspect-square object-cover opacity-80" alt="share" />
                    <div className="p-2 text-left">
                      <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">@{postAuthor?.username}</p>
                      <p className="text-xs font-bold text-white truncate">{sharedPost.title}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleContextMenuClick(e, m.id, isMe)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              )}
              {m.text ? (
                <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div 
                    onClick={(e) => handleContextMenuClick(e, m.id, isMe)}
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm cursor-pointer transition-opacity ${activeContextMenu?.id === m.id ? 'opacity-80' : ''} ${isMe ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none'}`}
                  >
                    {m.text}
                    <div className={`text-[8px] mt-1 text-right ${isMe ? 'text-emerald-100' : 'text-zinc-500'}`}>{formatMessageTime(m.createdAt)}</div>
                  </div>
                  {!sharedPost && (
                    <button 
                      onClick={(e) => handleContextMenuClick(e, m.id, isMe)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div 
                  onClick={(e) => handleContextMenuClick(e, m.id, isMe)}
                  className={`text-[8px] mt-1 cursor-pointer ${isMe ? 'text-right text-zinc-500' : 'text-left text-zinc-500'}`}
                >
                  {formatMessageTime(m.createdAt)}
                </div>
              )}
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="py-10 text-center text-zinc-600">
            <p className="text-xs">Send a message to start chatting</p>
          </div>
        )}
      </div>

      {activeContextMenu && (
        <div 
          className="fixed z-[9999] flex items-center gap-1 bg-zinc-800 rounded-xl p-1 shadow-xl border border-zinc-700 animate-in fade-in zoom-in-95 duration-100"
          style={{ 
            bottom: activeContextMenu.y, 
            left: Math.max(10, Math.min(activeContextMenu.x - 60, window.innerWidth - 130)) 
          }}
        >
          <button onClick={() => { setReplyingTo(db.messages.find(m => m.id === activeContextMenu.id)!); setActiveContextMenu(null); }} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Reply">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button onClick={() => { setForwardingMessage(db.messages.find(m => m.id === activeContextMenu.id)!); setActiveContextMenu(null); }} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Forward">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => { onDeleteForMe(activeContextMenu.id); setActiveContextMenu(null); }} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Delete for me">
            <Trash2 className="w-4 h-4" />
          </button>
          {activeContextMenu.isMe && (
            <button onClick={() => { onDeleteMessage(activeContextMenu.id); setActiveContextMenu(null); }} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Unsend">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="p-4 pb-8 bg-zinc-950 border-t border-zinc-900 flex flex-col gap-2">
        {receivedRequest ? (
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center flex flex-col gap-3">
            <p className="text-sm text-zinc-300 flex items-center justify-center gap-1">
              @{partner.username}
              {partner.isVerified && <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />}
              wants to chat with you.
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => { onRejectRequest && onRejectRequest(receivedRequest.id); onBack(); }} className="px-6 py-2 rounded-xl font-bold text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">Delete</button>
              <button onClick={() => onAcceptRequest && onAcceptRequest(receivedRequest.id)} className="px-6 py-2 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Accept</button>
            </div>
          </div>
        ) : (
          <>
            {isRequestPending && (
              <div className="bg-zinc-900/50 p-2 rounded-xl border border-zinc-800 text-center mb-2">
                <p className="text-xs text-zinc-400">Request sent. Waiting for approval.</p>
              </div>
            )}
            {replyingTo && (
              <div className="flex items-center justify-between bg-zinc-900/50 px-4 py-2 rounded-xl border-l-2 border-emerald-500">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold text-emerald-500">Replying to {replyingTo.senderId === loggedUserId ? 'yourself' : partner.displayName}</span>
                  <span className="text-xs text-zinc-400 truncate">{replyingTo.text || 'Shared a post'}</span>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 text-zinc-500 hover:text-zinc-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-800">
              <input 
                className="flex-grow bg-transparent text-sm outline-none text-white" 
                placeholder="Type a message..." 
                value={text} 
                onChange={e => setText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="text-emerald-500 active:scale-90 transition-transform">
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {forwardingMessage && (
        <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[1200] bg-zinc-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-4 border-b border-zinc-900">
            <h3 className="font-bold text-white">Forward to...</h3>
            <button onClick={() => setForwardingMessage(null)} className="p-2 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {db.users.filter(u => u.id !== loggedUserId).map(u => (
              <div key={u.id} onClick={() => handleForward(u.id)} className="flex items-center gap-4 mb-4 hover:bg-zinc-900/50 p-3 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-zinc-800">
                <img src={u.avatar} className="w-12 h-12 rounded-full object-cover" alt="av" />
                <div className="text-left flex-grow">
                  <p className="font-bold text-white text-sm flex items-center gap-1">
                    @{u.username}
                    {u.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
                  </p>
                  <p className="text-zinc-500 text-xs">{u.displayName}</p>
                </div>
                <button className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">Send</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}