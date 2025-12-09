"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

type NotificationItem = {
  text: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  avatarUrl: string;
  chatId: string;
  createdAt: string;
};

const NotificationBusContext = createContext<{
  notifications: NotificationItem[];
} | null>(null);

export function NotificationBusProvider({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: string;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("register", currentUserId);

    socket.on("chat:notification", (data: NotificationItem) => {
      // Tambahkan ke state
      setNotifications((prev) => [data, ...prev]);

      // Tampilkan sonner popup
      toast(`${data.senderName} sent a message`, {
        description: data.text,
        action: {
          label: "Open Chat",
          onClick: () =>
            (window.location.href = `/Rumpi/Dashboard/chat/${data.senderUsername}`),
        },
      });
    });

    return () => {
      socket.off("chat:notification");
    };
  }, [currentUserId]);

  return (
    <NotificationBusContext.Provider value={{ notifications }}>
      {children}
    </NotificationBusContext.Provider>
  );
}

export function useNotificationBus() {
  return useContext(NotificationBusContext);
}
