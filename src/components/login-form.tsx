"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  loading?: boolean;
};

export function LoginForm({ className, onSubmit, loading }: LoginFormProps) {
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          Login to your account
        </CardTitle>
        <CardDescription>
          Enter your email and password to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Password</FieldLabel>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </Field>
          </FieldGroup>

          <div className="space-y-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              asChild
              disabled={loading}
            >
              {/* ⭐ FIX: Pakai proxy route untuk Google auth */}
              <a href="/api/auth/google/callback?redirect=/Rumpi/Dashboard">
                Login with Google
              </a>
            </Button>

            <FieldDescription className="text-center text-sm">
              Don`t have an account?{" "}
              <a
                href="/Auth/Signup"
                className="font-medium hover:underline underline-offset-4"
              >
                Sign up
              </a>
            </FieldDescription>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
