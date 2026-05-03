import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, SendHorizontal, UserPlus, UserMinus, BookmarkPlus, 
  BookmarkMinus, UserCheck, UserX, Search, Send, BadgeCheck
} from 'lucide-react';
import type { Database, Post, User } from '../types';

interface CommentsSheetProps {
  postId: string;
  db: Database;
  onClose: () => void;
  onUserClick: (username: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export function CommentsSheet({ postId, db, onClose, onUserClick, onAddComment }: CommentsSheetProps) {
  const [text, setText] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'verified'>('all');
  
  const postComments = useMemo(() => {
    let comments = db.comments.filter(c => c.postId === postId);
    if (filterType === 'verified') {
      comments = comments.filter(c => {
        const author = db.users.find(u => u.id === c.userId);
        return author?.isVerified;
      });
    }
    return comments;
  }, [db.comments, postId, filterType, db.users]);
  
  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[600] flex flex-col justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-900 w-full max-w-md mx-auto rounded-t-[32px] h-[75vh] flex flex-col shadow-2xl">
        <div className="flex flex-col items-center py-3 text-white">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 text-center">Comments</span>
        </div>
        
        <div className="px-5 pb-4 flex gap-2">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === 'all' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('verified')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${filterType === 'verified' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            Verified Only <BadgeCheck className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-5 pb-20 text-left">
          {postComments.map(c => { 
            const author = db.users.find(u => u.id === c.userId);
            return (
              <div key={c.id} className="flex gap-4 items-start mb-6 px-4">
                <img src={author?.avatar} className="w-9 h-9 rounded-full bg-zinc-800 cursor-pointer object-cover" onClick={() => { onClose(); if(author) onUserClick(author.username); }} alt="av" />
                <div className="flex-grow text-left text-zinc-100 overflow-hidden">
                  <p className="text-xs font-bold text-zinc-100 mb-0.5 flex items-center gap-1">
                    @{author?.username}
                    {author?.isVerified && <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />}
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">{c.text}</p>
                </div>
              </div>
            ); 
          })}
          {postComments.length === 0 && <div className="py-20 text-center opacity-20 text-zinc-500"><MessageCircle className="w-12 h-12 mx-auto mb-2" /><p className="text-[10px] font-black uppercase text-zinc-100">No comments yet</p></div>}
        </div>
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/95">
          <div className="flex items-end gap-3 bg-zinc-800 rounded-3xl px-4 py-2 border border-zinc-700 text-zinc-100">
            <textarea 
              className="bg-transparent text-sm w-full outline-none text-zinc-100 resize-none max-h-32 py-1 no-scrollbar" 
              placeholder="Add a comment..." 
              value={text} 
              rows={Math.min(5, text.split('\n').length || 1)}
              onChange={(e) => setText(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim()) {
                    onAddComment(postId, text);
                    setText("");
                  }
                }
              }} 
            />
            <button onClick={() => { if(text.trim()) { onAddComment(postId, text); setText(""); } }} className="text-emerald-500 mb-1"><SendHorizontal className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PostActionsSheetProps {
  post?: Post;
  author?: User;
  isFollowing: boolean;
  isSaved: boolean;
  isBlocked: boolean;
  isMe: boolean;
  onFollowToggle: (id: string) => void;
  onBlockToggle: (id: string) => void;
  onSaveToggle: (id: string) => void;
  onClose: () => void;
}

export function PostActionsSheet({ post, author, isFollowing, isSaved, isBlocked, isMe, onFollowToggle, onBlockToggle, onSaveToggle, onClose }: PostActionsSheetProps) {
  if (!post || !author) return null;
  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[900] flex flex-col justify-end animate-in fade-in text-zinc-100">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-950 w-full max-w-md mx-auto rounded-t-[32px] p-6 pb-12 text-center">
        <div className="flex flex-col items-center mb-8"><div className="w-10 h-1 bg-zinc-800 rounded-full mb-6"></div><p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">Post Actions</p><h3 className="font-black text-white text-base">@{author.username}</h3></div>
        <div className="space-y-3 text-left">
          {!isMe && (<button onClick={() => { onFollowToggle(author.id); onClose(); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 transition-all ${isFollowing ? 'text-zinc-300' : 'text-emerald-500'}`}>{isFollowing ? <UserMinus /> : <UserPlus />}<span className="font-bold text-sm ml-4">{isFollowing ? 'Unfollow Creator' : 'Follow Creator'}</span></button>)}
          <button onClick={() => { onSaveToggle(post.id); onClose(); }} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 text-zinc-300 active:scale-95 transition-all">{isSaved ? <BookmarkMinus className="text-emerald-500" /> : <BookmarkPlus />}<span className="font-bold text-sm ml-4">{isSaved ? 'Remove from Saved' : 'Save this Post'}</span></button>
          {!isMe && (<button onClick={() => { onBlockToggle(author.id); onClose(); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl border ${isBlocked ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>{isBlocked ? <UserCheck /> : <UserX />}<span className="font-bold text-sm ml-4">Block User</span></button>)}
          <button onClick={onClose} className="w-full p-5 rounded-2xl text-zinc-600 font-bold text-sm text-center">Cancel</button>
        </div>
      </div>
    </div>
  );
}

interface ProfileActionsSheetProps {
  user?: User;
  isFollowing: boolean;
  isBlocked: boolean;
  onFollowToggle: (id: string) => void;
  onBlockToggle: (id: string) => void;
  onClose: () => void;
}

export function ProfileActionsSheet({ user, isFollowing, isBlocked, onFollowToggle, onBlockToggle, onClose }: ProfileActionsSheetProps) {
  if (!user) return null;
  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[850] flex flex-col justify-end animate-in fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-950 w-full max-w-md mx-auto rounded-t-[32px] p-6 pb-12 text-center text-zinc-100 border-t border-zinc-800">
        <div className="flex flex-col items-center mb-8 text-center"><div className="w-10 h-1 bg-zinc-800 rounded-full mb-6"></div><img src={user.avatar} className="w-20 h-20 rounded-full border-4 border-zinc-900 shadow-xl mb-3 mx-auto" alt="av" /><p className="font-black text-white text-lg">@{user.username}</p></div>
        <div className="space-y-3 text-left">
          <button onClick={() => { onFollowToggle(user.id); onClose(); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl ${isFollowing ? 'bg-zinc-900 text-zinc-300' : 'bg-emerald-500 text-white shadow-lg'}`}>{isFollowing ? <UserMinus /> : <UserPlus />}<span className="font-bold ml-4">{isFollowing ? 'Unfollow' : 'Follow'} Account</span></button>
          <button onClick={() => { onBlockToggle(user.id); onClose(); }} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-red-500">{isBlocked ? <UserCheck /> : <UserX />}<span className="font-bold ml-4">{isBlocked ? 'Unblock' : 'Block'} User</span></button>
          <button onClick={onClose} className="w-full p-5 text-zinc-500 font-bold text-center">Cancel</button>
        </div>
      </div>
    </div>
  );
}

interface SharePostSheetProps {
  postId: string;
  db: Database;
  loggedUserId: string;
  onClose: () => void;
  onShare: (receiverId: string, postId: string) => void;
}

export function SharePostSheet({ postId, db, loggedUserId, onClose, onShare }: SharePostSheetProps) {
  const [query, setQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  
  const searchResults = useMemo(() => {
    if (!query) {
      // Show people we are following or who follow us for sharing
      const followedIds = db.follows.filter(f => f.followerId === loggedUserId).map(f => f.followingId);
      const followerIds = db.follows.filter(f => f.followingId === loggedUserId).map(f => f.followerId);
      const friendIds = Array.from(new Set([...followedIds, ...followerIds]));
      return db.users.filter(u => friendIds.includes(u.id));
    }
    return db.users.filter(u => u.id !== loggedUserId && (u.username.toLowerCase().includes(query.toLowerCase()) || u.displayName.toLowerCase().includes(query.toLowerCase())));
  }, [db.follows, db.users, loggedUserId, query]);

  const handleSend = () => {
    selectedUserIds.forEach(id => onShare(id, postId));
    onClose();
  };

  const toggleUser = (id: string) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  return (
    <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[1200] flex flex-col justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-900 w-full max-w-md mx-auto rounded-t-[32px] h-[70vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center py-3 text-white">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Share with friends</span>
        </div>
        
        <div className="px-5 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-emerald-500 text-white" 
              placeholder="Search people..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar px-5 pb-24">
          {searchResults.map(user => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <div key={user.id} onClick={() => toggleUser(user.id)} className={`flex items-center justify-between mb-4 p-3 rounded-2xl cursor-pointer transition-colors border ${isSelected ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-800/50 border-transparent hover:border-zinc-700'}`}>
                <div className="flex items-center gap-3">
                  <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="av" />
                  <div className="text-left">
                    <p className="font-bold text-white text-xs">@{user.username}</p>
                    <p className="text-zinc-500 text-[10px]">{user.displayName}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            );
          })}
          {searchResults.length === 0 && (
            <div className="py-10 text-center text-zinc-600">
              <p className="text-xs">No users found</p>
            </div>
          )}
        </div>

        {selectedUserIds.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-zinc-900 border-t border-zinc-800">
            <button 
              onClick={handleSend} 
              className="w-full bg-emerald-500 text-white py-3 rounded-xl text-sm font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send separately to {selectedUserIds.length} {selectedUserIds.length === 1 ? 'person' : 'people'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}