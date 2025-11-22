"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import Link from "next/link";

import { LineShadowText } from "@/components/ui/line-shadow-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  MessageCircle,
  Camera,
  Heart,
  Bell,
  Github,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

// import { TweetCard } from "@/components/ui/tweet-card";

function LineShadowTextDemo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // cegah SSR render sampai theme diketahui

  const shadowColor = resolvedTheme === "dark" ? "white" : "black";

  return (
    <h1 className="text-4xl leading-none font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-7xl">
      Rumpi{" "}
      <LineShadowText className="italic" shadowColor={shadowColor}>
        Chat
      </LineShadowText>
    </h1>
  );
}

function TextAnimateDemo6() {
  return (
    <div className="max-w-2xl mx-auto text-center px-2">
      <TextAnimate
        animation="slideLeft"
        by="character"
        className="flex flex-wrap justify-center"
      >
        Connect Share Chat Meet New People. Forge real relationships and build
        your community with shared experiences and genuine conversations.
      </TextAnimate>
    </div>
  );
}

export default function HeroPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col">
      {/* SECTION 1 – HERO */}
      <section className="min-h-screen flex flex-col justify-center px-4 py-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
          <div className="w-full flex justify-end">
            <AnimatedThemeToggler />
          </div>

          <LineShadowTextDemo />
          <TextAnimateDemo6 />

          <div className="mt-5 pt-1 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <InteractiveHoverButton
              className="w-full sm:w-32"
              onClick={() => router.push("/Auth/Signup")}
            >
              Get Started
            </InteractiveHoverButton>

            <Button
              variant="outline"
              className="w-full sm:w-32"
              onClick={() => router.push("/Auth/Login")}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2 – FEATURES GRID */}
      <section className="min-h-screen flex flex-col justify-center px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Discover what makes <AuroraText>Rumpi </AuroraText> Unique
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
              <p>
                Chat instantly with people who share your interests and vibes.
              </p>
            </div>

            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
              <p>
                Share photos and moments to express yourself beyond just text.
              </p>
            </div>

            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
              <p>Like what you see and build real connections over time.</p>
            </div>

            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
              <p>Stay updated with smart notifications, never miss a moment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 – LIVE CHAT EXPERIENCE */}
      <section className="min-h-screen flex flex-col justify-center px-4 py-10 bg-gradient-to-b from-transparent to-purple-600/10 dark:to-indigo-900/20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Experience <AuroraText>Real Conversations</AuroraText>
          </h2>

          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
            Not just messages. Rumpi brings real emotions, reactions, and
            presence — feel the vibe as if you`re chatting face-to-face.
          </p>

          {/* Chat Box Preview */}
          <div className="w-full max-w-md p-4 rounded-2xl border bg-white dark:bg-gray-900 shadow-xl flex flex-col gap-2 relative overflow-hidden">
            <div className="self-start bg-gray-200 dark:bg-gray-700 text-sm p-3 rounded-2xl rounded-bl-none">
              Hey, you wanna hang out later tonight? 🌙
            </div>
            <div className="self-end bg-purple-600 text-white text-sm p-3 rounded-2xl rounded-br-none">
              Sure! Where should we go? 😄
            </div>
            <div className="self-start bg-gray-200 dark:bg-gray-700 text-sm p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
            </div>
          </div>

          <Button
            className="mt-6 px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform"
            onClick={() => router.push("/Auth/Signup")}
          >
            Start Your First Chat 🚀
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      {/* FOOTER – DOCK MAGIC UI */}
      <footer className="w-full py-10 px-4 bg-background flex flex-col items-center gap-6 border-t">
        <div className="max-w-4xl w-full">
          <Dock
            className="mx-auto"
            iconSize={40}
            iconMagnification={60}
            iconDistance={140}
            direction="middle"
          >
            <DockIcon>
              <Link
                href="https://github.com/RaiStillLearning"
                aria-label="Github "
              >
                <Github className="size-6" />
              </Link>
            </DockIcon>
            <DockIcon>
              <Link
                href="https://www.linkedin.com/in/rakha-arkana-6aba03353/ "
                aria-label="Linkedin "
              >
                <Linkedin className="size-6" />
              </Link>
            </DockIcon>
            <DockIcon>
              <Link
                href="https://www.instagram.com/arkanaavv/ "
                aria-label="Instagram "
              >
                <Instagram className="size-6" />
              </Link>
            </DockIcon>
            <DockIcon>
              <Link href="/contact" aria-label="Contact">
                <Mail className="size-6" />
              </Link>
            </DockIcon>
          </Dock>
        </div>

        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          <div className="font-semibold">Rumpi — Connect. Share. Chat.</div>
          <div>© {new Date().getFullYear()} Rumpi. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
