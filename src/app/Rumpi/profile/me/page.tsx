"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, Camera, LogIn } from "lucide-react";

type UserType = {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
};

export default function MyProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data);
      setNewName(data.displayName);
      setLoading(false);
    };

    fetchMe();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("displayName", newName);
    if (imageFile) formData.append("avatar", imageFile);

    const res = await fetch(`${API_URL}/api/users/me`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data);
      setPreviewImage(null);
      setEditOpen(false);
    } else {
      alert(data.message || "Update profile failed");
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Skeleton className="w-32 h-32 rounded-full mx-auto" />
        <Skeleton className="h-6 w-40 mt-4 mx-auto" />
      </div>
    );

  if (!user)
    return (
      <p className="p-5 text-center text-red-500 font-medium">
        Anda belum login.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20">
      <Card className="shadow-lg border border-border/40">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Image
                src={
                  previewImage ||
                  user.avatarUrl ||
                  "/user-profile/default-avatar.png"
                }
                width={110}
                height={110}
                alt="avatar"
                className="rounded-full object-cover border shadow"
              />

              <button
                onClick={() => setEditOpen(true)}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow hover:bg-primary/80"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-xl font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {user.displayName}
              </p>

              <p className="text-muted-foreground">@{user.username}</p>

              <p className="flex items-center gap-2 mt-2 text-sm">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>

              <Badge className="mt-3 flex items-center gap-1 w-fit">
                <LogIn className="h-3 w-3" />
                Login via{" "}
                {user.provider === "google" ? "Google" : "Email & Password"}
              </Badge>
            </div>
          </div>

          <Button onClick={() => setEditOpen(true)} className="w-full">
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-3 mt-2">
                <Image
                  src={
                    previewImage ||
                    user.avatarUrl ||
                    "/user-profile/default-avatar.png"
                  }
                  width={70}
                  height={70}
                  alt="preview"
                  className="rounded-full object-cover border"
                />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div>
              <Label>Display Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
