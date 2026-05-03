import type { Database } from "./types";

export const ISLAMIC_IMAGES = [
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506784917094-13174154442a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542834369-f10d7974f9d3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
];

export const INITIAL_DATABASE: Database = {
  users: [
    {
      id: "u0",
      username: "My_Identity",
      displayName: "My Identity",
      bio: "Seeking light through spiritual growth. 🌙",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me",
      coverImage:
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
      savedPublic: false,
      messagePrivacy: "anyone",
      isVerified: true,
    },
    {
      id: "u1",
      username: "Alim_Connect",
      displayName: "Alim Connect",
      bio: "Knowledge hub. 📚",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alim",
      coverImage:
        "https://images.unsplash.com/photo-1542834369-f10d7974f9d3?auto=format&fit=crop&w=800&q=80",
      savedPublic: false,
      messagePrivacy: "anyone",
    },
    {
      id: "u2",
      username: "Haya_Style",
      displayName: "Haya Lifestyle",
      bio: "Modesty is our identity. ✨",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Haya",
      coverImage:
        "https://images.unsplash.com/photo-1493673272479-da7e82367ecd?auto=format&fit=crop&w=800&q=80",
      savedPublic: false,
      messagePrivacy: "request",
      isVerified: true,
    },
    {
      id: "u3",
      username: "Quran_Daily",
      displayName: "Quran Daily",
      bio: "Verses to soothe the soul. 📖",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quran",
      coverImage:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
      savedPublic: true,
      messagePrivacy: "anyone",
    },
    {
      id: "u4",
      username: "Halal_Travels",
      displayName: "Halal Voyager",
      bio: "Exploring Allah's creation. 🌍",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Travel",
      coverImage:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
      savedPublic: true,
      messagePrivacy: "request",
      isVerified: true,
    },
    {
      id: "u5",
      username: "Fit_Ummah",
      displayName: "Fit Ummah",
      bio: "Strong believer is better. 💪",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fit",
      coverImage:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      savedPublic: false,
      messagePrivacy: "anyone",
    },
    {
      id: "u6",
      username: "Islamic_Art",
      displayName: "Islamic Geometry",
      bio: "Beauty in patterns. 🎨",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Art",
      coverImage:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
      savedPublic: true,
      messagePrivacy: "anyone",
    },
    {
      id: "u7",
      username: "Sunnah_Revival",
      displayName: "Sunnah Revival",
      bio: "Following the footsteps. 👣",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunnah",
      coverImage:
        "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=800&q=80",
      savedPublic: false,
      messagePrivacy: "anyone",
    },
    {
      id: "u8",
      username: "Halal_Eats",
      displayName: "Halal Eats",
      bio: "Bismillah before every bite. 🍔",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Food",
      coverImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      savedPublic: true,
      messagePrivacy: "anyone",
    },
    {
      id: "u9",
      username: "Muslim_Tech",
      displayName: "Muslim Techies",
      bio: "Innovating for good. 💻",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
      coverImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      savedPublic: false,
      messagePrivacy: "anyone",
    },
  ],
  posts: [
    {
      id: "p1",
      authorId: "u1",
      type: "image",
      title: "Power of Silence",
      content:
        "https://images.unsplash.com/photo-1584281722570-34062833075d?auto=format&fit=crop&w=800&q=80",
      caption: "Speak good or stay silent.",
      createdAt: "2h ago",
    },
    {
      id: "p2",
      authorId: "u3",
      type: "image",
      title: "Morning Light",
      content:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      caption: "Fajr blessings.",
      createdAt: "6h ago",
    },
    {
      id: "p3",
      authorId: "u4",
      type: "reel",
      title: "Nature's Signs",
      content:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      caption: "Look at the details Allah created.",
      createdAt: "7h ago",
      thumbnail:
        "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p4",
      authorId: "u2",
      type: "reel",
      title: "Summit View",
      content: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "SubhanAllah.",
      createdAt: "5h ago",
      thumbnail:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p5",
      authorId: "u5",
      type: "image",
      title: "Strength",
      content:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      caption: "A strong believer is loved by Allah.",
      createdAt: "8h ago",
    },
    {
      id: "p6",
      authorId: "u6",
      type: "image",
      title: "Geometric Harmony",
      content:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
      caption: "Infinite patterns.",
      createdAt: "9h ago",
    },
    {
      id: "p7",
      authorId: "u1",
      type: "reel",
      title: "Library Tour",
      content:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      caption: "So many books, so little time.",
      createdAt: "10h ago",
      thumbnail:
        "https://images.unsplash.com/photo-1507842217153-e21f40668ceb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p8",
      authorId: "u7",
      type: "image",
      title: "Miswak",
      content:
        "https://images.unsplash.com/photo-1627393100177-b4297e79a5be?auto=format&fit=crop&w=800&q=80",
      caption: "Simple sunnahs.",
      createdAt: "11h ago",
    },
    {
      id: "p9",
      authorId: "u8",
      type: "image",
      title: "Iftar Prep",
      content:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      caption: "Getting ready.",
      createdAt: "12h ago",
    },
    {
      id: "p10",
      authorId: "u9",
      type: "image",
      title: "Coding for Ummah",
      content:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      caption: "Building useful tools.",
      createdAt: "13h ago",
    },
    {
      id: "p11",
      authorId: "u2",
      type: "reel",
      title: "Scenery",
      content:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      caption: "Peaceful moments.",
      createdAt: "14h ago",
      thumbnail:
        "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p12",
      authorId: "u0",
      type: "image",
      title: "Reflection",
      content:
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
      caption: "Who are we?",
      createdAt: "1d ago",
    },
    {
      id: "p13",
      authorId: "u3",
      type: "image",
      title: "Quran",
      content:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
      caption: "Read.",
      createdAt: "1d ago",
    },
    {
      id: "p14",
      authorId: "u4",
      type: "image",
      title: "Desert",
      content:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
      caption: "Vastness.",
      createdAt: "1d ago",
    },
    {
      id: "p15",
      authorId: "u5",
      type: "reel",
      title: "Morning Run",
      content:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      caption: "Consistency is key.",
      createdAt: "1d ago",
      thumbnail:
        "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p16",
      authorId: "u6",
      type: "image",
      title: "Blue Mosque",
      content:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      caption: "Architecture.",
      createdAt: "1d ago",
    },
    {
      id: "p17",
      authorId: "u7",
      type: "image",
      title: "Dates",
      content:
        "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=800&q=80",
      caption: "Breaking fast.",
      createdAt: "2d ago",
    },
    {
      id: "p18",
      authorId: "u8",
      type: "reel",
      title: "Cooking",
      content: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "Making something special.",
      createdAt: "2d ago",
      thumbnail:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p19",
      authorId: "u9",
      type: "image",
      title: "Setup",
      content:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      caption: "Workspace.",
      createdAt: "2d ago",
    },
    {
      id: "p20",
      authorId: "u0",
      type: "reel",
      title: "Rain",
      content:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      caption: "Mercy from the sky.",
      createdAt: "2d ago",
      thumbnail:
        "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p21",
      authorId: "u1",
      type: "image",
      title: "Notes",
      content:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
      caption: "Studying hard.",
      createdAt: "3d ago",
    },
    {
      id: "p22",
      authorId: "u2",
      type: "image",
      title: "Tea Time",
      content:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      caption: "Chai.",
      createdAt: "3d ago",
    },
    {
      id: "p23",
      authorId: "u3",
      type: "reel",
      title: "Recitation",
      content:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      caption: "Listen.",
      createdAt: "3d ago",
      thumbnail:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p24",
      authorId: "u4",
      type: "image",
      title: "Mountains",
      content:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      caption: "High up.",
      createdAt: "3d ago",
    },
    {
      id: "p25",
      authorId: "u5",
      type: "image",
      title: "Running Shoes",
      content:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      caption: "Ready.",
      createdAt: "4d ago",
    },
    {
      id: "p26",
      authorId: "u6",
      type: "reel",
      title: "Art Process",
      content: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "Creating.",
      createdAt: "4d ago",
      thumbnail:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "p27",
      authorId: "u7",
      type: "image",
      title: "Compass",
      content:
        "https://images.unsplash.com/photo-1504280509247-248ce3248356?auto=format&fit=crop&w=800&q=80",
      caption: "Direction.",
      createdAt: "4d ago",
    },
    {
      id: "p28",
      authorId: "u0",
      type: "image",
      title: "Masjid Nabawi",
      content:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
      caption: "Pure peace. 3",
      createdAt: "1h ago",
    },
  ],
  comments: [],
  likes: [
    { postId: "p1", userId: "u2" },
    { postId: "p1", userId: "u3" },
    { postId: "p1", userId: "u5" },
    { postId: "p4", userId: "u1" },
    { postId: "p4", userId: "u6" },
    { postId: "p28", userId: "u8" },
    { postId: "p28", userId: "u9" },
    { postId: "p28", userId: "u1" },
  ],
  follows: [
    { followerId: "u2", followingId: "u1" },
    { followerId: "u0", followingId: "u1" },
    { followerId: "u3", followingId: "u0" },
    { followerId: "u4", followingId: "u0" },
    { followerId: "u5", followingId: "u6" },
    { followerId: "u1", followingId: "u9" },
  ],
  saved: [
    { postId: "p1", userId: "u0" },
    { postId: "p28", userId: "u2" },
  ],
  blocks: [],
  messages: [
    {
      id: "m1",
      senderId: "u1",
      receiverId: "u0",
      text: "Assalamu Alaikum! How are you?",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m2",
      senderId: "u0",
      receiverId: "u1",
      text: "Wa Alaikum Assalam! I'm doing well, Alhamdullilah.",
      createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m3",
      senderId: "u2",
      receiverId: "u0",
      text: "Love your latest post!",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
  ],
  chatRequests: [],
};
