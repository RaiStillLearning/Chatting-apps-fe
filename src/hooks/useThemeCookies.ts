"use client";
import { useCookies } from "react-cookie";

export function usePreference() {
  const [cookies, setCookie] = useCookies(["theme"]);
  const setTheme = (val: string) => setCookie("theme", val, { path: "/" });
  return { theme: cookies.theme, setTheme };
}
