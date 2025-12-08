"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type UserType = {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
};

type MessageType = {
  _id: string;
  chat: string;
  text: string;
  createdAt: string;
  sender: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

export default function ChatPage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;

  const [me, setMe] = useState<UserType | null>(null);
  const [target, setTarget] = useState<UserType | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // scroll ke bawah tiap ada message baru
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const setupChat = async () => {
      try {
        if (!username) return;

        // 1. ambil current user
        const meRes = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (!meRes.ok) {
          setLoading(false);
          return;
        }
        const meData = await meRes.json();
        setMe(meData);

        // 2. ambil target user by username
        const targetRes = await fetch(`${API_URL}/api/users/${username}`);
        if (!targetRes.ok) {
          setLoading(false);
          return;
        }
        const targetData = await targetRes.json();
        setTarget(targetData);

        // 3. start / get chat
        const chatRes = await fetch(`${API_URL}/api/chats/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: targetData._id }),
        });

        const chat = await chatRes.json();
        setChatId(chat._id);

        // 4. ambil messages
        const msgRes = await fetch(
          `${API_URL}/api/chats/${chat._id}/messages`,
          {
            credentials: "include",
          }
        );
        const msgs = await msgRes.json();
        setMessages(msgs);

        // 5. setup socket.io
        socket = io(API_URL, {
          withCredentials: true,
        });

        socket.emit("join_chat", chat._id);

        socket.on("new_message", (msg: MessageType) => {
          setMessages((prev) => [...prev, msg]);
        });

        setLoading(false);
      } catch (err) {
        console.error("CHAT INIT ERROR:", err);
        setLoading(false);
      }
    };

    setupChat();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [username]);

  const handleSend = async () => {
    if (!input.trim() || !chatId || !me) return;

    const text = input.trim();

    // kirim via REST (supaya pasti kesimpan di DB)
    try {
      await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      setInput("");
      // realtime akan ditrigger dari socket 'new_message'
    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);
    }
  };

  if (loading || !target || !me) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-40 mb-4" />
        <Card className="h-[60vh]">
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isMe = (id: string) => id === me._id;

  const targetInitial =
    target.displayName?.[0]?.toUpperCase() || target.username[0]?.toUpperCase();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col gap-4">
      {/* Header chat */}
      <div className="flex items-center gap-3">
        <Avatar>
          {target.avatarUrl ? (
            <AvatarImage src={target.avatarUrl} />
          ) : (
            <AvatarFallback>{targetInitial}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-semibold">{target.displayName}</p>
          <p className="text-xs text-muted-foreground">@{target.username}</p>
        </div>
      </div>

      {/* Chat card */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="py-2 border-b">
          <p className="text-sm text-muted-foreground">
            You are chatting with{" "}
            <span className="font-medium">@{target.username}</span>
          </p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-3 overflow-y-auto gap-2">
          {messages.map((msg) => {
            const mine = isMe(msg.sender._id);
            return (
              <div
                key={msg._id}
                className={cn(
                  "flex w-full",
                  mine ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  {!mine && (
                    <p className="text-[11px] font-medium text-muted-foreground mb-0.5">
                      {msg.sender.displayName}
                    </p>
                  )}
                  <p>{msg.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder={`Message @${target.username}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
