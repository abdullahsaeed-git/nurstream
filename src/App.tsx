import  { useState, useMemo, useEffect } from "react";
import { ShieldCheck, MessageCircle } from "lucide-react";
import { AppShell, Navbar, LoginView } from "./components/Shared";
import { ReelVideoItem, PostCardPreviewRef } from "./components/Post";
import {
  CommentsSheet,
  PostActionsSheet,
  ProfileActionsSheet,
  SharePostSheet,
} from "./components/Overlays";
import {
  PostDetailView,
  FeedSliderView,
  ReelsFeedView,
  ProfileView,
  CreatePostView,
  SearchView,
  SettingsView,
  UserListView,
  ChatsView,
  ChatRoomView,
  ChatRequestsView,
} from "./components/Views";
import { INITIAL_DATABASE } from "./data";
import type { Post, User, Message } from "./types";

export default function App() {
  const [db, setDb] = useState(INITIAL_DATABASE);
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);

  // Refactored from activeUserFeed to a generic activeFeed
  const [activeFeed, setActiveFeed] = useState<{
    posts: Post[];
    startPostId: string;
    type: "slider" | "reels";
    headerUser?: User; // Optional user for header context in slider
  } | null>(null);

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePostActionsId, setActivePostActionsId] = useState<string | null>(
    null,
  );
  const [commentSheetPostId, setCommentSheetPostId] = useState<string | null>(
    null,
  );
  const [shareSheetPostId, setShareSheetPostId] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<{
    type: "followers" | "following";
    targetUserId: string;
  } | null>(null);
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  const [isShowingProfileActions, setIsShowingProfileActions] = useState<
    string | null
  >(null);
  const [isMuted, setIsMuted] = useState(true);

  // Chats state
  const [isShowingChats, setIsShowingChats] = useState(false);
  const [isShowingChatRequests, setIsShowingChatRequests] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  const currentUser = useMemo(
    () => db.users.find((u) => u.id === loggedUserId)!,
    [db.users, loggedUserId],
  );

  const totalUnreadCount = useMemo(() => {
    if (!loggedUserId) return 0;
    return db.messages.filter((m) => m.receiverId === loggedUserId && !m.read)
      .length;
  }, [db.messages, loggedUserId]);

  useEffect(() => {
    if (activeChatUserId && loggedUserId) {
      setDb((prev) => {
        let changed = false;
        const newMessages = prev.messages.map((m) => {
          if (
            m.senderId === activeChatUserId &&
            m.receiverId === loggedUserId &&
            !m.read
          ) {
            changed = true;
            return { ...m, read: true };
          }
          return m;
        });
        if (changed) {
          return { ...prev, messages: newMessages };
        }
        return prev;
      });
    }
  }, [activeChatUserId, loggedUserId]);

  const handleLike = (pid: string) =>
    setDb((p) => ({
      ...p,
      likes: p.likes.some((l) => l.postId === pid && l.userId === loggedUserId)
        ? p.likes.filter(
            (l) => !(l.postId === pid && l.userId === loggedUserId),
          )
        : [...p.likes, { postId: pid, userId: loggedUserId! }],
    }));
  const handleSave = (pid: string) =>
    setDb((p) => ({
      ...p,
      saved: p.saved.some((s) => s.postId === pid && s.userId === loggedUserId)
        ? p.saved.filter(
            (s) => !(s.postId === pid && s.userId === loggedUserId),
          )
        : [...p.saved, { postId: pid, userId: loggedUserId! }],
    }));
  const handleFollowToggle = (tid: string) =>
    setDb((p) => {
      const isF = p.follows.some(
        (f) => f.followerId === loggedUserId && f.followingId === tid,
      );
      return {
        ...p,
        follows: isF
          ? p.follows.filter(
              (f) => !(f.followerId === loggedUserId && f.followingId === tid),
            )
          : [...p.follows, { followerId: loggedUserId!, followingId: tid }],
      };
    });
  const handleBlockToggle = (tid: string) =>
    setDb((p) => ({
      ...p,
      blocks: p.blocks.some(
        (b) => b.blockerId === loggedUserId && b.blockedId === tid,
      )
        ? p.blocks.filter(
            (b) => !(b.blockerId === loggedUserId && b.blockedId === tid),
          )
        : [...p.blocks, { blockerId: loggedUserId!, blockedId: tid }],
    }));
  const handleUpdateProfile = (newData: User) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === newData.id ? newData : u)),
    }));
    setIsShowingSettings(false);
  };
  const handlePublishPost = (
    postData: Omit<Post, "id" | "authorId" | "createdAt">,
  ) => {
    const newPost: Post = {
      ...postData,
      id: `p_${Date.now()}`,
      authorId: loggedUserId!,
      createdAt: new Date().toISOString(),
    };
    setDb((p) => ({ ...p, posts: [newPost, ...p.posts] }));
  };

  const handleSendMessage = (
    rid: string,
    text: string,
    sharedPostId?: string,
    replyToId?: string,
  ) => {
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: loggedUserId!,
      receiverId: rid,
      text,
      createdAt: new Date().toISOString(),
      sharedPostId,
      replyToId,
      read: false,
    };

    setDb((p) => {
      const receiver = p.users.find((u) => u.id === rid);
      const hasReplied = p.messages.some(
        (m) => m.senderId === rid && m.receiverId === loggedUserId,
      );
      const existingRequest = p.chatRequests.find(
        (r) => r.senderId === loggedUserId && r.receiverId === rid,
      );
      const receivedRequest = p.chatRequests.find(
        (r) =>
          r.senderId === rid &&
          r.receiverId === loggedUserId &&
          r.status === "pending",
      );

      let newChatRequests = [...p.chatRequests];

      if (receivedRequest) {
        // Implicitly accept the request by replying
        newChatRequests = newChatRequests.map((r) =>
          r.id === receivedRequest.id ? { ...r, status: "accepted" } : r,
        );
      } else if (
        receiver?.messagePrivacy === "request" &&
        !hasReplied &&
        !existingRequest
      ) {
        newChatRequests.push({
          id: `cr_${Date.now()}`,
          senderId: loggedUserId!,
          receiverId: rid,
          status: "pending",
        });
      }

      return {
        ...p,
        messages: [...p.messages, newMessage],
        chatRequests: newChatRequests,
      };
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setDb((p) => ({
      ...p,
      messages: p.messages.filter((m) => m.id !== messageId),
    }));
  };

  const handleDeleteForMe = (messageId: string) => {
    setDb((p) => ({
      ...p,
      messages: p.messages.map((m) =>
        m.id === messageId
          ? { ...m, deletedFor: [...(m.deletedFor || []), loggedUserId!] }
          : m,
      ),
    }));
  };

  const handleAcceptRequest = (requestId: string) => {
    setDb((p) => ({
      ...p,
      chatRequests: p.chatRequests.map((r) =>
        r.id === requestId ? { ...r, status: "accepted" } : r,
      ),
    }));
  };

  const handleRejectRequest = (requestId: string) => {
    setDb((p) => {
      const req = p.chatRequests.find((r) => r.id === requestId);
      if (!req) return p;
      // Delete the request and the message associated with it
      return {
        ...p,
        chatRequests: p.chatRequests.filter((r) => r.id !== requestId),
        messages: p.messages.filter(
          (m) =>
            !(m.senderId === req.senderId && m.receiverId === req.receiverId),
        ),
      };
    });
  };

  const handleSharePost = (rid: string, pid: string) => {
    const post = db.posts.find((p) => p.id === pid);
    if (!post) return;
    handleSendMessage(rid, "", pid);
  };

  // Helper to open feed from ProfileView
  const handleProfileSliderOpen = (
    username: string,
    startPostId: string,
    feedType: "authored" | "saved",
  ) => {
    const author = db.users.find((u) => u.username === username);
    if (!author) return;

    let posts: Post[] = [];
    if (feedType === "saved") {
      const savedIds = db.saved
        .filter((s) => s.userId === author.id)
        .map((s) => s.postId);
      posts = db.posts.filter((p) => savedIds.includes(p.id));
    } else {
      posts = db.posts.filter((p) => p.authorId === author.id);
    }

    setActiveFeed({
      posts,
      startPostId,
      type: "slider",
      headerUser: author,
    });
  };

  const handleProfileMessageClick = (uid: string) => {
    setViewingUsername(null);
    setActiveChatUserId(uid);
  };

  const handleLogin = (id: string) => {
    setLoggedUserId(id);
    setActiveTab("home");
    setViewingUsername(null);
    setActiveFeed(null);
    setIsShowingSettings(false);
    setIsShowingChats(false);
  };

  const handleSignUp = (newUser: Omit<User, "id">) => {
    const id = `u_${Date.now()}`;
    const user: User = { ...newUser, id };
    setDb((prev) => ({ ...prev, users: [...prev.users, user] }));
    handleLogin(id);
  };

  if (!loggedUserId)
    return (
      <AppShell>
        <LoginView
          users={db.users}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      </AppShell>
    );

  const filteredPosts = db.posts.filter(
    (p) =>
      !db.blocks.some(
        (b) => b.blockerId === loggedUserId && b.blockedId === p.authorId,
      ),
  );
  const showGlobalHeader =
    !["reels", "explore", "profile", "add"].includes(activeTab) &&
    !viewingUsername &&
    !activeFeed &&
    !isShowingSettings &&
    !isShowingChats;

  // Logic to determine if detail view is open (to pause background videos)
  const isDetailViewOpen =
    !!activePostId || !!activeFeed || isShowingChats || !!shareSheetPostId;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setViewingUsername(null);
    setActiveFeed(null);
    setActivePostId(null);
    setActiveList(null);
    setIsShowingSettings(false);
    setIsShowingChats(false);
    setIsShowingChatRequests(false);
    setActiveChatUserId(null);
  };

  const isSubViewActive =
    !!viewingUsername ||
    !!activeFeed ||
    !!activePostId ||
    !!activeList ||
    isShowingSettings ||
    isShowingChats ||
    isShowingChatRequests ||
    !!activeChatUserId;
  const effectiveActiveTab = isSubViewActive ? null : activeTab;

  return (
    <>
      <AppShell>
        {showGlobalHeader && (
          <header className="absolute top-0 w-full md:w-[calc(100%-80px)] md:left-[80px] lg:w-[calc(100%-240px)] lg:left-[240px] bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 z-50 flex items-center justify-between px-5 py-4 text-left text-zinc-100">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-bold">
                The Ummah Feed
              </span>
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
                NurStream
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShowingChats(true)}
                className="p-1 text-zinc-400 hover:text-white transition-colors relative"
              >
                <MessageCircle className="w-6 h-6" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                    {totalUnreadCount}
                  </span>
                )}
              </button>
              <ShieldCheck className="w-6 h-6 text-emerald-500 md:hidden" />
            </div>
          </header>
        )}
        <main
          className={`flex-grow h-full overflow-hidden text-left pb-[60px] md:pb-0 md:pl-[80px] lg:pl-[240px] text-zinc-100 ${activeTab === "home" ? "pt-20" : "pt-0"}`}
        >
          {activeTab === "home" && (
            <div className="h-full overflow-y-auto no-scrollbar px-4 md:px-8 lg:px-12 pt-2 text-left text-zinc-100">
              <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 text-left text-zinc-100">
                {db.users
                  .filter((u) => u.id !== loggedUserId)
                  .map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setViewingUsername(u.username)}
                      className="flex flex-col items-center shrink-0 cursor-pointer text-center text-zinc-100"
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-500">
                        <img
                          src={u.avatar}
                          className="w-full h-full rounded-full bg-zinc-950 p-0.5 object-cover"
                          alt="av"
                        />
                      </div>
                      <span className="text-[10px] md:text-xs text-zinc-500 mt-1 truncate w-14 md:w-16">
                        @{u.username}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="max-w-2xl mx-auto">
                {filteredPosts.map((post) => (
                  <PostCardPreviewRef
                    key={post.id}
                    post={post}
                    db={db}
                    currentUser={currentUser}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={setShareSheetPostId}
                    onUserClick={setViewingUsername}
                    onOpenComments={setCommentSheetPostId}
                    onOpenDetail={setActivePostId}
                    onOpenActions={setActivePostActionsId}
                    forcePause={isDetailViewOpen}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                  />
                ))}
              </div>
            </div>
          )}
          {activeTab === "reels" && (
            <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-black text-zinc-100 text-left relative">
              <div className="max-w-md mx-auto h-full relative">
                {filteredPosts
                  .filter((p) => p.type === "reel")
                  .map((reel) => (
                    <div
                      key={reel.id}
                      className="h-full w-full snap-start snap-always relative"
                    >
                      <ReelVideoItem
                        reel={reel}
                        author={db.users.find((u) => u.id === reel.authorId)}
                        isLiked={db.likes.some(
                          (l) =>
                            l.postId === reel.id && l.userId === loggedUserId,
                        )}
                        isSaved={db.saved.some(
                          (s) =>
                            s.postId === reel.id && s.userId === loggedUserId,
                        )}
                        likesCount={
                          db.likes.filter((l) => l.postId === reel.id).length
                        }
                        commentsCount={
                          db.comments.filter((c) => c.postId === reel.id).length
                        }
                        hideCounts={currentUser.hideReelCounts}
                        onLike={handleLike}
                        onSave={handleSave}
                        onShare={setShareSheetPostId}
                        onOpenComments={setCommentSheetPostId}
                        onOpenDetailMenu={setActivePostActionsId}
                        onUserClick={setViewingUsername}
                        onOpenDetail={setActivePostId}
                        isMuted={isMuted}
                        toggleMute={() => setIsMuted(!isMuted)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
          {activeTab === "explore" && (
            <SearchView
              db={db}
              loggedUserId={loggedUserId}
              onUserClick={setViewingUsername}
              onOpenFeed={(posts, startId, type) =>
                setActiveFeed({ posts, startPostId: startId, type })
              }
            />
          )}
          {activeTab === "add" && (
            <CreatePostView
              onClose={() => handleTabChange("home")}
              onPublish={(post) => {
                handlePublishPost(post);
                handleTabChange("home");
              }}
              isVerified={currentUser?.isVerified}
            />
          )}
          {activeTab === "profile" && (
            <ProfileView
              username={currentUser.username}
              db={db}
              loggedUserId={loggedUserId}
              onBack={() => handleTabChange("home")}
              onSettingsClick={(mode) =>
                mode === "logout"
                  ? setLoggedUserId(null)
                  : setIsShowingSettings(true)
              }
              onAddPostClick={() => handleTabChange("add")}
              onListClick={(type, id) =>
                setActiveList({ type, targetUserId: id })
              }
              onFollowToggle={handleFollowToggle}
              onSliderOpen={handleProfileSliderOpen}
              onProfileActionsClick={setIsShowingProfileActions}
              isTabMode={true}
            />
          )}
        </main>
        <Navbar
          activeTab={effectiveActiveTab}
          onTabChange={handleTabChange}
          onAddClick={() => handleTabChange("add")}
        />

        {viewingUsername && (
          <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[110] bg-zinc-950 text-left text-zinc-100">
            <ProfileView
              username={viewingUsername}
              db={db}
              loggedUserId={loggedUserId}
              onBack={() => setViewingUsername(null)}
              onProfileActionsClick={setIsShowingProfileActions}
              onListClick={(type, id) =>
                setActiveList({ type, targetUserId: id })
              }
              onFollowToggle={handleFollowToggle}
              onSliderOpen={handleProfileSliderOpen}
              onAddPostClick={() => {
                setActiveTab("add");
                setViewingUsername(null);
              }}
              onSettingsClick={() => setIsShowingSettings(true)}
              onMessageClick={handleProfileMessageClick}
              isTabMode={false}
            />
          </div>
        )}

        {activeFeed && activeFeed.type === "slider" && (
          <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[120] bg-zinc-950 text-left text-zinc-100">
            <FeedSliderView
              posts={activeFeed.posts}
              startPostId={activeFeed.startPostId}
              db={db}
              currentUser={currentUser}
              headerUser={activeFeed.headerUser}
              onBack={() => setActiveFeed(null)}
              onLike={handleLike}
              onSave={handleSave}
              onShare={setShareSheetPostId}
              onOpenActions={setActivePostActionsId}
              onOpenComments={setCommentSheetPostId}
              onOpenDetail={setActivePostId}
              onUserClick={setViewingUsername}
              isMuted={isMuted}
              toggleMute={() => setIsMuted(!isMuted)}
            />
          </div>
        )}

        {activeFeed && activeFeed.type === "reels" && (
          <div className="absolute inset-0 md:left-[80px] lg:left-[240px] md:w-[calc(100%-80px)] lg:w-[calc(100%-240px)] z-[120] bg-black text-left text-zinc-100">
            <ReelsFeedView
              posts={activeFeed.posts}
              startPostId={activeFeed.startPostId}
              db={db}
              currentUser={currentUser}
              onBack={() => setActiveFeed(null)}
              onLike={handleLike}
              onSave={handleSave}
              onShare={setShareSheetPostId}
              onOpenComments={setCommentSheetPostId}
              onOpenDetailMenu={setActivePostActionsId}
              onUserClick={setViewingUsername}
              isMuted={isMuted}
              toggleMute={() => setIsMuted(!isMuted)}
            />
          </div>
        )}

        {isShowingSettings && (
          <SettingsView
            user={currentUser}
            onClose={() => setIsShowingSettings(false)}
            onSave={handleUpdateProfile}
            onLogout={() => setLoggedUserId(null)}
          />
        )}
        {isShowingProfileActions && (
          <ProfileActionsSheet
            user={db.users.find((u) => u.id === isShowingProfileActions)}
            isFollowing={db.follows.some(
              (f) =>
                f.followerId === loggedUserId &&
                f.followingId === isShowingProfileActions,
            )}
            isBlocked={db.blocks.some(
              (b) =>
                b.blockerId === loggedUserId &&
                b.blockedId === isShowingProfileActions,
            )}
            onFollowToggle={handleFollowToggle}
            onBlockToggle={handleBlockToggle}
            onClose={() => setIsShowingProfileActions(null)}
          />
        )}
        {activePostActionsId && (
          <PostActionsSheet
            post={db.posts.find((p) => p.id === activePostActionsId)}
            author={db.users.find(
              (u) =>
                u.id ===
                db.posts.find((p) => p.id === activePostActionsId)!.authorId,
            )}
            isFollowing={db.follows.some(
              (f) =>
                f.followerId === loggedUserId &&
                f.followingId ===
                  db.posts.find((p) => p.id === activePostActionsId)!.authorId,
            )}
            isSaved={db.saved.some(
              (s) =>
                s.postId === activePostActionsId && s.userId === loggedUserId,
            )}
            isBlocked={db.blocks.some(
              (b) =>
                b.blockerId === loggedUserId &&
                b.blockedId ===
                  db.posts.find((p) => p.id === activePostActionsId)!.authorId,
            )}
            isMe={
              db.posts.find((p) => p.id === activePostActionsId)!.authorId ===
              loggedUserId
            }
            onFollowToggle={handleFollowToggle}
            onBlockToggle={handleBlockToggle}
            onSaveToggle={handleSave}
            onClose={() => setActivePostActionsId(null)}
          />
        )}
        {activeList && (
          <UserListView
            type={activeList.type}
            targetUserId={activeList.targetUserId}
            db={db}
            loggedUserId={loggedUserId}
            onClose={() => setActiveList(null)}
            onUserClick={setViewingUsername}
            onFollow={handleFollowToggle}
          />
        )}
        {commentSheetPostId && (
          <CommentsSheet
            postId={commentSheetPostId}
            db={db}
            onClose={() => setCommentSheetPostId(null)}
            onUserClick={setViewingUsername}
            onAddComment={(pid, t) =>
              setDb({
                ...db,
                comments: [
                  {
                    id: Date.now().toString(),
                    postId: pid,
                    userId: loggedUserId,
                    text: t,
                  },
                  ...db.comments,
                ],
              })
            }
          />
        )}
        {shareSheetPostId && (
          <SharePostSheet
            postId={shareSheetPostId}
            db={db}
            loggedUserId={loggedUserId}
            onClose={() => setShareSheetPostId(null)}
            onShare={handleSharePost}
          />
        )}

        {/* Chats Overlays */}
        {isShowingChats && (
          <ChatsView
            db={db}
            loggedUserId={loggedUserId}
            onClose={() => setIsShowingChats(false)}
            onOpenChat={(uid) => setActiveChatUserId(uid)}
            onOpenRequests={() => setIsShowingChatRequests(true)}
          />
        )}
        {isShowingChatRequests && (
          <ChatRequestsView
            db={db}
            loggedUserId={loggedUserId}
            onClose={() => setIsShowingChatRequests(false)}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            onOpenChat={(uid) => {
              setActiveChatUserId(uid);
              setIsShowingChatRequests(false);
            }}
          />
        )}
        {activeChatUserId && (
          <ChatRoomView
            db={db}
            loggedUserId={loggedUserId}
            partnerId={activeChatUserId}
            onBack={() => setActiveChatUserId(null)}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage}
            onDeleteForMe={handleDeleteForMe}
            onOpenPost={(pid) => {
              setActiveChatUserId(null);
              setIsShowingChats(false);
              setActivePostId(pid);
            }}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
          />
        )}
      </AppShell>
      {activePostId && (
        <div className="fixed inset-0 z-[500] bg-zinc-950/90 backdrop-blur-sm flex justify-center items-center">
          <div className="w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-6xl bg-zinc-950 md:rounded-3xl overflow-hidden relative shadow-2xl border border-zinc-800">
            <PostDetailView
              post={db.posts.find((p) => p.id === activePostId)}
              db={db}
              onBack={() => setActivePostId(null)}
              onLike={handleLike}
              onSave={handleSave}
              onShare={setShareSheetPostId}
              onOpenComments={setCommentSheetPostId}
              onOpenDetailMenu={setActivePostActionsId}
              isLiked={db.likes.some(
                (l) => l.postId === activePostId && l.userId === loggedUserId,
              )}
              isSaved={db.saved.some(
                (s) => s.postId === activePostId && s.userId === loggedUserId,
              )}
              onUserClick={setViewingUsername}
              isMuted={isMuted}
              toggleMute={() => setIsMuted(!isMuted)}
            />
          </div>
        </div>
      )}
    </>
  );
}
