"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ChatNotificationProvider({
  currentUserId,
}: {
  currentUserId: string;
}) {
  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("register", currentUserId);

    socket.on("chat:notification", (data) => {
      // Jika user sedang ada di chat yang sama → jangan notif
      if (
        window.location.pathname === `/Rumpi/Dashboard/chat/${data.senderId}`
      ) {
        return;
      }

      // 🎉 SONNER CUSTOM NOTIFICATION
      toast.custom(() => (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() =>
            (window.location.href = `/Rumpi/Dashboard/chat/${data.senderId}`)
          }
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={data.avatarUrl} />
            <AvatarFallback>{data.senderName?.[0] ?? "U"}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-semibold">{data.senderName}</span>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {data.text}
            </p>
          </div>
        </div>
      ));
    });

    return () => socket.off("chat:notification");
  }, [currentUserId]);

  return null;
}
