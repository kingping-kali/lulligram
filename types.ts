export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isVerified?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: number;
  isViewed: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  price: number;
  description: string;
  image: string;
  likes: number;
  createdAt: number;
  category: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  userId: string; // The other person
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
}

export enum ViewState {
  FEED = 'FEED',
  EXPLORE = 'EXPLORE',
  CREATE = 'CREATE',
  MESSAGES = 'MESSAGES',
  PROFILE = 'PROFILE'
}
