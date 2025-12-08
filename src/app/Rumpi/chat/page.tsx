"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ChatListItem = {
  chatId: string;
  user: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  lastMessage: {
    text: string;
    createdAt: string;
  };
};

let socket: Socket | null = null;

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch chat list
  const loadChats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chats/list`, {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.error("LOAD CHAT LIST ERROR:", err);
    }
  };

  useEffect(() => {
    loadChats();

    // Setup realtime socket
    socket = io(API_URL, { withCredentials: true });

    socket.on("chat:update_list", () => {
      loadChats();
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>

      {chats.length === 0 && (
        <p className="text-muted-foreground text-center mt-10">
          Belum ada chat.
        </p>
      )}

      <div className="space-y-3">
        {chats.map((item) => (
          <Link
            href={`/Rumpi/chat/${item.user.username}`}
            key={item.chatId}
            className="block"
          >
            <Card className="p-3 flex items-center gap-3 hover:bg-accent transition border-border/60">
              <Avatar>
                {item.user.avatarUrl ? (
                  <AvatarImage src={item.user.avatarUrl} />
                ) : (
                  <AvatarFallback>
                    {item.user.displayName[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.user.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {item.lastMessage?.text || "No messages yet"}
                </p>
              </div>

              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {item.lastMessage?.createdAt
                  ? new Date(item.lastMessage.createdAt).toLocaleTimeString(
                      "id-ID",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : ""}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
