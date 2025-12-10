import { User, Product, Conversation, Story } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  username: 'alex_designer',
  fullName: 'Alex Morgan',
  avatar: 'https://picsum.photos/id/64/200/200',
  bio: 'Digital Creator | Vintage Collector 📸\nSelling pre-loved items.',
  followers: 1240,
  following: 450,
  isVerified: true
};

export const MOCK_USERS: Record<string, User> = {
  'u1': {
    id: 'u1',
    username: 'sarah_styles',
    fullName: 'Sarah Jenkins',
    avatar: 'https://picsum.photos/id/65/200/200',
    bio: 'Fashion enthusiast ✨',
    followers: 890,
    following: 200
  },
  'u2': {
    id: 'u2',
    username: 'tech_guru',
    fullName: 'Mike Ross',
    avatar: 'https://picsum.photos/id/91/200/200',
    bio: 'Tech reviews and gadgets.',
    followers: 5600,
    following: 120
  },
  'u3': {
    id: 'u3',
    username: 'art_daily',
    fullName: 'Emily Blunt',
    avatar: 'https://picsum.photos/id/103/200/200',
    bio: 'Artist living in NYC 🎨',
    followers: 2300,
    following: 800
  }
};

export const MOCK_STORIES: Story[] = [
  { id: 's1', userId: 'u1', imageUrl: 'https://picsum.photos/id/120/400/800', timestamp: Date.now(), isViewed: false },
  { id: 's2', userId: 'u2', imageUrl: 'https://picsum.photos/id/160/400/800', timestamp: Date.now(), isViewed: false },
  { id: 's3', userId: 'u3', imageUrl: 'https://picsum.photos/id/180/400/800', timestamp: Date.now(), isViewed: false },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'u1',
    title: 'Vintage Denim Jacket',
    price: 45,
    description: 'Authentic 90s denim jacket in great condition. Size M.',
    image: 'https://picsum.photos/id/325/500/500',
    likes: 124,
    createdAt: Date.now() - 100000,
    category: 'Fashion'
  },
  {
    id: 'p2',
    sellerId: 'u2',
    title: 'Sony Wireless Headphones',
    price: 120,
    description: 'Noise cancelling, barely used. Comes with box.',
    image: 'https://picsum.photos/id/250/500/500',
    likes: 856,
    createdAt: Date.now() - 200000,
    category: 'Electronics'
  },
  {
    id: 'p3',
    sellerId: 'u3',
    title: 'Abstract Oil Painting',
    price: 300,
    description: 'Original canvas 24x36. Signed by artist.',
    image: 'https://picsum.photos/id/400/500/500',
    likes: 45,
    createdAt: Date.now() - 300000,
    category: 'Art'
  },
  {
    id: 'p4',
    sellerId: 'me',
    title: 'Retro Film Camera',
    price: 150,
    description: 'Fully functional 35mm film camera.',
    image: 'https://picsum.photos/id/450/500/500',
    likes: 12,
    createdAt: Date.now() - 50000,
    category: 'Photography'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userId: 'u1',
    lastMessage: 'Is this still available?',
    timestamp: Date.now() - 10000,
    unreadCount: 1
  },
  {
    id: 'c2',
    userId: 'u2',
    lastMessage: 'Thanks for the quick shipping!',
    timestamp: Date.now() - 8000000,
    unreadCount: 0
  }
];
