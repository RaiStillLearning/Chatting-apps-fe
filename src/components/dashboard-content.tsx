"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Eye,
} from "lucide-react";

import Image from "next/image";

export function DashboardContent() {
  const trendingTopics = [
    {
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=250&fit=crop",
      title: "Trending Fashion Picks",
      views: "5678 views",
    },
    {
      image:
        "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=250&fit=crop",
      title: "Latest Tech Gadgets",
      views: "3456 views",
    },
    {
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
      title: "Healthy Recipe Ideas",
      views: "7890 views",
    },
    {
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
      title: "Dream Travel Spots",
      views: "9123 views",
    },
  ];

  const posts = [
    {
      id: 1,
      author: "NatureLover",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
      caption:
        "Lost in the beauty of nature. Every moment is a reminder to appreciate the simple things.",
      likes: 124,
      comments: 32,
      shares: 15,
    },
    {
      id: 2,
      author: "CoffeeAddict",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coffee",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop",
      caption:
        "Starting the day with a perfect cup of coffee. Who else loves this morning ritual?",
      likes: 230,
      comments: 58,
      shares: 28,
    },
    {
      id: 3,
      author: "UrbanExplorer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=urban",
      image:
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&h=400&fit=crop",
      caption:
        "City nights are always an adventure. So much to see, so much to do!",
      likes: 98,
      comments: 21,
      shares: 11,
    },
    {
      id: 4,
      author: "FitLife",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fit",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=400&fit=crop",
      caption:
        "Pushing my limits today! Consistency is key. #fitness #motivation",
      likes: 345,
      comments: 78,
      shares: 42,
    },
    {
      id: 5,
      author: "CreativeSoul",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop",
      caption:
        "My latest piece. Art is how we decorate space; music is how we decorate time.",
      likes: 190,
      comments: 45,
      shares: 20,
    },
  ];

  return (
    <div className="w-full">
      {/* What's New Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">What`s New</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group border"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {topic.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{topic.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Feed */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Explore Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">{post.author}</span>
                </div>
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm mb-4 line-clamp-3">{post.caption}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
