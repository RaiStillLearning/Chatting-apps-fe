"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ChatListItem = {
  _id: string;
  participants: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }[];
  lastMessage?: {
    text: string;
    createdAt: string;
    sender: string;
  };
  unreadCount?: number;
};

type CurrentUser = {
  _id: string;
  username: string;
  displayName: string;
};

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch current user
  const loadCurrentUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error("LOAD USER ERROR:", err);
    }
  };

  // Fetch chat list
  const loadChats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/list`, {
        credentials: "include",
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.error("LOAD CHAT LIST ERROR:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadChats();

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      loadChats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Get the other participant (not current user)
  const getOtherParticipant = (chat: ChatListItem) => {
    if (!currentUser) return null;
    return chat.participants.find((p) => p._id !== currentUser._id) || null;
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  // Filter chats based on search
  const filteredChats = chats.filter((chat) => {
    const otherUser = getOtherParticipant(chat);
    if (!otherUser) return false;

    const query = searchQuery.toLowerCase();
    return (
      otherUser.displayName.toLowerCase().includes(query) ||
      otherUser.username.toLowerCase().includes(query) ||
      chat.lastMessage?.text.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <MessageCircle className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search messages..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Chat List */}
      {filteredChats.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start a conversation by searching for people
          </p>
        </div>
      )}

      {filteredChats.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Search className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No chats found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try searching with a different keyword
          </p>
        </div>
      )}

      <div className="space-y-2">
        {filteredChats.map((chat) => {
          const otherUser = getOtherParticipant(chat);
          if (!otherUser) return null;

          const hasUnread = chat.unreadCount && chat.unreadCount > 0;
          const isFromMe = chat.lastMessage?.sender === currentUser?._id;

          return (
            <Link
              href={`/Rumpi/chat/${otherUser.username}`}
              key={chat._id}
              className="block"
            >
              <Card
                className={cn(
                  "p-4 flex items-center gap-3 hover:bg-accent transition border-border/60",
                  hasUnread && "bg-accent/50"
                )}
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    {otherUser.avatarUrl ? (
                      <AvatarImage
                        src={otherUser.avatarUrl}
                        alt={otherUser.displayName}
                      />
                    ) : (
                      <AvatarFallback>
                        {otherUser.displayName[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {chat.unreadCount! > 9 ? "9+" : chat.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={cn(
                        "font-medium truncate",
                        hasUnread && "font-semibold"
                      )}
                    >
                      {otherUser.displayName}
                    </p>
                    {chat.lastMessage && (
                      <span
                        className={cn(
                          "text-xs whitespace-nowrap ml-2",
                          hasUnread
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatTimeAgo(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  <p
                    className={cn(
                      "text-sm truncate",
                      hasUnread
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {chat.lastMessage ? (
                      <>
                        {isFromMe && (
                          <span className="text-muted-foreground">You: </span>
                        )}
                        {chat.lastMessage.text}
                      </>
                    ) : (
                      <span className="italic">No messages yet</span>
                    )}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
