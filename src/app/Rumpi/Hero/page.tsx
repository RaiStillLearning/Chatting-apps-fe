"use client";

import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { MessageCircle, Camera, Heart, Bell } from "lucide-react";

function LineShadowTextDemo() {
  const { resolvedTheme } = useTheme();
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
    <main className="min-h-screen flex flex-col gap-12 px-4 py-10">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        <div className="self-end">
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
            onClick={() => router.push("/Auth/Signup")}
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* GRID SECTION */}
      <section className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Recusandae, nostrum!
            </p>
          </div>

          <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
            <Camera className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Recusandae, nostrum!
            </p>
          </div>

          <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Recusandae, nostrum!
            </p>
          </div>

          <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 hover:shadow-lg p-4 text-xs sm:text-sm">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8 m-4" />
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Recusandae, nostrum!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
