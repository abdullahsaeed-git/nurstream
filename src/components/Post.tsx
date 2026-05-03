import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  ChevronLeft,
  Bookmark,
  Play,
  Volume2,
  VolumeX,
  Pause,
  Share2,
  BadgeCheck,
} from "lucide-react";
import type { Database, Post, User } from "../types";

interface ReelVideoItemProps {
  reel: Post;
  author?: User;
  isLiked: boolean;
  isSaved: boolean;
  likesCount?: number;
  commentsCount?: number;
  hideCounts?: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onOpenComments: (id: string) => void;
  onOpenDetailMenu: (id: string) => void;
  onUserClick: (username: string) => void;
  onOpenDetail?: (id: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const ReelVideoItem: React.FC<ReelVideoItemProps> = ({
  reel,
  author,
  isLiked,
  isSaved,
  likesCount = 0,
  commentsCount = 0,
  hideCounts = false,
  onLike,
  onSave,
  onShare,
  onOpenComments,
  onOpenDetailMenu,
  onUserClick,
  onOpenDetail,
  isMuted,
  toggleMute,
  showBack = false,
  onBack,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [hasError, setHasError] = useState(false);
  const shouldTruncate = onOpenDetail && (reel.caption?.length || 0) > 140;

  const safePlay = async () => {
    try {
      if (videoRef.current && videoRef.current.paused) {
        await videoRef.current.play();
        setIsPausedManually(false);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) safePlay();
        else videoRef.current?.pause();
      },
      { threshold: 0.7 },
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) safePlay();
      else {
        videoRef.current.pause();
        setIsPausedManually(true);
      }
    }
  };

  return (
    <div className="h-full w-full snap-start snap-always relative bg-black flex flex-col justify-end overflow-hidden text-left text-zinc-100">
      {/* {void console.log("Rendering ReelVideoItem", reel)} */}
      {reel.content && !hasError ? (
        <video
          ref={videoRef}
          src={reel.content}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer"
          loop
          muted={isMuted}
          playsInline
          onClick={handleAction}
        />
      ) : (
        <div
          className="absolute inset-0 bg-zinc-900"
          onClick={handleAction}
        ></div>
      )}
      {isPausedManually && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none text-white text-center">
          <div className="p-5 bg-black/30 backdrop-blur-md rounded-full scale-150 animate-in zoom-in text-white mx-auto">
            <Play className="w-8 h-8 fill-current" />
          </div>
        </div>
      )}
      {showBack && (
        <button
          onClick={onBack}
          className="absolute top-10 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white z-50 active:scale-90 transition-all"
        >
          <ChevronLeft className="mx-auto" />
        </button>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      <div className="absolute right-4 bottom-6 flex flex-col items-center gap-7 z-20 text-white text-center text-zinc-100">
        <div className="flex flex-col items-center gap-1">
          <Heart
            onClick={(e) => {
              e.stopPropagation();
              onLike(reel.id);
            }}
            className={`w-8 h-8 cursor-pointer active:scale-125 transition-transform ${isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
          {!hideCounts && (
            <span className="text-xs font-bold">{likesCount}</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <MessageCircle
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(reel.id);
            }}
            className="w-8 h-8 cursor-pointer transition-all active:scale-90"
          />
          {!hideCounts && (
            <span className="text-xs font-bold">{commentsCount}</span>
          )}
        </div>
        <Bookmark
          onClick={(e) => {
            e.stopPropagation();
            onSave(reel.id);
          }}
          className={`w-8 h-8 cursor-pointer active:scale-125 transition-transform ${isSaved ? "fill-emerald-500 text-emerald-500" : ""}`}
        />
        <Share2
          onClick={(e) => {
            e.stopPropagation();
            onShare(reel.id);
          }}
          className="w-8 h-8 cursor-pointer transition-all active:scale-90"
        />
        <MoreHorizontal
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetailMenu(reel.id);
          }}
          className="w-8 h-8 cursor-pointer transition-all active:scale-90"
        />
      </div>
      <div className="p-6 pb-5 pr-16 relative z-10 text-left text-white">
        <div
          className="flex items-center gap-3 mb-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (author) onUserClick(author.username);
          }}
        >
          <div className="relative">
            <img
              src={author?.avatar}
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg"
              alt="av"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute -top-1.5 -right-1.5 bg-zinc-900/90 backdrop-blur-sm p-1 rounded-full border border-zinc-700 text-white shadow-sm z-10 hover:scale-110 transition-transform"
            >
              {isMuted ? (
                <VolumeX size={12} />
              ) : (
                <Volume2 size={12} className="text-emerald-500" />
              )}
            </button>
          </div>
          <span className="font-black text-white text-sm flex items-center gap-1">
            @{author?.username}
            {author?.isVerified && (
              <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
            )}
          </span>
        </div>
        <h3 className="text-white text-base font-bold leading-tight mb-1 break-words whitespace-pre-wrap">
          {(reel.title?.length || 0) > 70
            ? reel.title.slice(0, 70) + "..."
            : reel.title}
        </h3>
        <p className="text-xs font-medium leading-relaxed text-zinc-300 break-words whitespace-pre-wrap">
          {shouldTruncate ? (
            <>
              {reel.caption.slice(0, 140)}...
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail && onOpenDetail(reel.id);
                }}
                className="text-white font-bold cursor-pointer ml-1 hover:underline"
              >
                see more
              </span>
            </>
          ) : (
            reel.caption
          )}
        </p>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  db: Database;
  currentUser: User;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onUserClick: (username: string) => void;
  onOpenComments: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onOpenActions: (id: string) => void;
  hideHeader?: boolean;
  forcePause?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const PostCardPreviewRef = forwardRef<HTMLDivElement, PostCardProps>(
  (
    {
      post,
      db,
      currentUser,
      onLike,
      onSave,
      onShare,
      onUserClick,
      onOpenComments,
      onOpenDetail,
      onOpenActions,
      hideHeader = false,
      forcePause = false,
      isMuted = true,
      onToggleMute,
    },
    ref,
  ) => {
    const author = db.users.find((u) => u.id === post.authorId);
    const isLiked = db.likes.some(
      (l) => l.postId === post.id && l.userId === currentUser.id,
    );
    const isSaved = db.saved.some(
      (s) => s.postId === post.id && s.userId === currentUser.id,
    );
    const postLikesCount = db.likes.filter((l) => l.postId === post.id).length;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);

    const safePlay = async () => {
      try {
        if (videoRef.current && videoRef.current.paused) {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {}
    };

    const handlePlayPause = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
        if (videoRef.current.paused) {
          safePlay();
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    useEffect(() => {
      if (post.type !== "reel" || !videoRef.current) return;

      // Create observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !forcePause) {
            safePlay();
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        },
        { threshold: 0.6 },
      );

      observer.observe(videoRef.current);

      // React to forcePause changes
      if (forcePause) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else if (videoRef.current.paused && !videoRef.current.ended) {
        // logic handled by observer usually
      }

      return () => observer.disconnect();
    }, [post.type, forcePause]);

    const effectiveType = hasError ? "text" : post.type;

    return (
      <div
        ref={ref}
        className={`mb-6 bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-xl text-left ${hideHeader ? "mt-4" : ""}`}
      >
        {!hideHeader && (
          <div className="p-4 flex items-center justify-between text-left text-zinc-100">
            <div
              onClick={() => author && onUserClick(author.username)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={author?.avatar}
                className="w-7 h-7 rounded-full object-cover bg-zinc-800 shadow-sm"
                alt="av"
              />
              <div className="text-left">
                <span className="flex items-center gap-1 font-bold text-xs group-hover:text-emerald-400 transition-colors">
                  @{author?.username}
                  {author?.isVerified && (
                    <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />
                  )}
                </span>
                <span className="block text-[10px] text-zinc-500">
                  {author?.displayName}
                </span>
              </div>
            </div>
            <button onClick={() => onOpenActions(post.id)} className="p-1">
              <MoreHorizontal className="w-5 h-5 text-zinc-600 active:text-white" />
            </button>
          </div>
        )}
        <div
          onClick={() => onOpenDetail(post.id)}
          className="cursor-pointer pt-4 text-left text-zinc-100"
        >
          <div
            className={`w-full ${effectiveType !== "text" ? "bg-black rounded-2xl mb-3 shadow-inner overflow-hidden relative group/video" : "mb-3"}`}
          >
            {effectiveType === "reel" ? (
              <>
                <video
                  ref={videoRef}
                  src={post.content}
                  onError={() => setHasError(true)}
                  className="w-full h-auto block"
                  muted={isMuted}
                  loop
                  playsInline
                />

                {/* Top Right Controls */}
                <div className="absolute top-3 right-3 flex gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMute && onToggleMute();
                    }}
                    className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-90 transition-all"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-90 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                </div>
              </>
            ) : effectiveType === "image" && post.content ? (
              <img
                src={post.content}
                onError={() => setHasError(true)}
                className="w-full h-auto block text-zinc-100"
                alt="c"
              />
            ) : effectiveType === "text" ? null : (
              <div className="px-4 py-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl mb-3 border border-zinc-800/50 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"></div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-center">
                  Text Reflection
                </p>
              </div>
            )}
          </div>
          <div className="px-4 pb-4 text-left text-zinc-100">
            <h3
              className={`font-bold text-zinc-100 leading-tight break-words whitespace-pre-wrap ${effectiveType === "text" ? "text-2xl mb-2" : "text-lg"}`}
            >
              {(post.title?.length || 0) > 70
                ? post.title.slice(0, 70) + "..."
                : post.title}
            </h3>
            <p
              className={`text-zinc-400 mt-1 leading-relaxed break-words whitespace-pre-wrap ${effectiveType === "text" ? "text-base" : "text-sm"}`}
            >
              {(post.caption?.length || 0) > 140 ? (
                <>
                  {post.caption.slice(0, 140)}...
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail && onOpenDetail(post.id);
                    }}
                    className="text-zinc-300 font-bold cursor-pointer ml-1 hover:underline"
                  >
                    see more
                  </span>
                </>
              ) : (
                post.caption
              )}
            </p>
          </div>
        </div>
        <div className="px-4 py-3 flex justify-between items-center border-t border-zinc-800/50 text-left text-zinc-100 font-bold">
          <div className="flex gap-5 text-left text-zinc-500 text-zinc-100">
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onLike(post.id)}
            >
              <Heart
                className={`w-5 h-5 transition-all group-active:scale-125 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="text-[10px] text-zinc-500 font-bold">
                {postLikesCount}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSave(post.id)}
            >
              <Bookmark
                className={`w-5 h-5 transition-all group-active:scale-125 ${isSaved ? "fill-emerald-500 text-emerald-500" : ""}`}
              />
              <span className="text-[10px] text-zinc-500 font-bold">
                {isSaved ? "Saved" : "Save"}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onOpenComments(post.id)}
            >
              <MessageCircle className="w-5 h-5 text-zinc-500 group-active:scale-110 transition-transform" />
              <span className="text-[10px] text-zinc-500 font-bold">Talk</span>
            </div>
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="w-5 h-5 text-zinc-500 group-active:scale-110 transition-transform" />
              <span className="text-[10px] text-zinc-500 font-bold">Share</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
