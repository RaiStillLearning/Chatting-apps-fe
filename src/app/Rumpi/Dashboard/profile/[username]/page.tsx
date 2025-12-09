"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, User as UserIcon, Calendar, LogIn, Shield } from "lucide-react";

type UserProfile = {
  _id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  provider: "credentials" | "google";
  createdAt?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${username}`);

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const initials = useMemo(() => {
    if (!user) return "U";
    const parts = user.displayName.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }, [user]);

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-muted-foreground">
          User @{username} tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="p-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>

            <div>
              <h1 className="text-3xl font-semibold">{user?.displayName}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <UserIcon className="w-4 h-4" /> @{user?.username}
              </p>

              <Badge className="mt-2 capitalize">
                <LogIn className="w-3 h-3 mr-1" />
                Login via {user?.provider}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground flex gap-2">
            <Mail className="w-4 h-4" /> {user?.email}
          </p>

          {/* 🔥 Button Chat */}
          <Button
            className="w-full mt-4"
            onClick={() =>
              (window.location.href = `/Rumpi/Dashboard/chat/${user?.username}`)
            }
          >
            Start Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
