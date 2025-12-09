"use client";

import { useNotificationBus } from "@/components/notification-bus-provider";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function NotificationsPage() {
  const bus = useNotificationBus();

  if (!bus) return null;
  const { notifications } = bus;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-muted-foreground text-center py-16">
          No notifications yet.
        </p>
      )}

      {notifications.map((n, i) => (
        <Link key={i} href={`/Rumpi/Dashboard/chat/${n.senderUsername}`}>
          <Card className="p-4 flex gap-3 items-center hover:bg-accent">
            <Avatar>
              <AvatarImage src={n.avatarUrl} />
              <AvatarFallback>{n.senderName[0]}</AvatarFallback>
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
