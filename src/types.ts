export interface User {
  id: string;
  username: string;
  password?: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  savedPublic: boolean;
  messagePrivacy: 'anyone' | 'request';
  hideReelCounts?: boolean;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  type: 'image' | 'reel' | 'text';
  title: string;
  content: string;
  caption: string;
  createdAt: string;
  thumbnail?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
}

export interface Like {
  postId: string;
  userId: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
}

export interface Saved {
  postId: string;
  userId: string;
}

export interface Block {
  blockerId: string;
  blockedId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  sharedPostId?: string;
  replyToId?: string;
  deletedFor?: string[];
  read?: boolean;
}

export interface ChatRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  follows: Follow[];
  saved: Saved[];
  blocks: Block[];
  messages: Message[];
  chatRequests: ChatRequest[];
}