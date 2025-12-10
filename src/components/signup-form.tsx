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
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SignupFormProps = {
  className?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  form: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SignupForm({
  className,
  onSubmit,
  loading,
  form,
  onChange,
}: SignupFormProps) {
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your details to register a new account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                required
                disabled={loading}
              />
            </Field>
          </FieldGroup>

          <div className="space-y-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              asChild
              disabled={loading}
            >
              <a href="https://chatting-apps-be.up.railway.app/api/auth/google?redirect=/Rumpi/Dashboard">
                Sign up with Google
              </a>
            </Button>

            <FieldDescription className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/Auth/Login"
                className="font-medium hover:underline underline-offset-4"
              >
                Log in
              </a>
            </FieldDescription>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
