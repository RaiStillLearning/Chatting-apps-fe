"use client";

import { useEffect, useState } from "react";
import { useNotificationBus } from "@/components/notification-bus-provider";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type NotificationItem = {
  _id?: string;
  senderName: string;
  senderUsername: string;
  avatarUrl?: string;
  text: string;
  source?: "db" | "realtime"; // ditambahkan internal untuk key unik
};

export default function NotificationsPage() {
  const bus = useNotificationBus();
  const [backendNotifications, setBackendNotifications] = useState<
    NotificationItem[]
  >([]);

  useEffect(() => {
    async function loadNotif() {
      try {
        const res = await fetch(`${API_URL}/api/notifications`, {
          credentials: "include",
        });

        if (res.ok) {
          const data: NotificationItem[] = await res.json();
          setBackendNotifications(data);
        }
      } catch (err) {
        console.error("LOAD NOTIFICATIONS ERROR:", err);
      }
    }

    loadNotif();
  }, []);

  if (!bus) return null;

  const { notifications } = bus;

  // Tambahkan properti 'source' untuk membedakan key
  const allNotifications: NotificationItem[] = [
    ...backendNotifications.map((n) => ({ ...n, source: "db" as const })),
    ...notifications.map((n) => ({ ...n, source: "realtime" as const })),
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {allNotifications.length === 0 && (
        <p className="text-muted-foreground text-center py-16">
          No notifications yet.
        </p>
      )}

      {allNotifications.map((n) => (
        <Link
          key={`${n._id}-${n.source}`} // key unik
          href={`/Rumpi/Dashboard/chat/${n.senderUsername}`}
        >
          <Card className="p-4 flex gap-3 items-center hover:bg-accent">
            <Avatar>
              <AvatarImage src={n.avatarUrl} />
              <AvatarFallback>{n.senderName?.[0] ?? "U"}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{n.senderName}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {n.text}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
