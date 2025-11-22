// "use client";

// import type { ReactNode } from "react";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // biasanya dari file yang sama

// export default function HeroLayout({ children }: { children: ReactNode }) {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full">
//         <AppSidebar />

//         <div className="flex-1 flex flex-col min-w-0">
//           <header className="sticky top-0 z-10 h-14 w-full flex items-center border-b px-4 bg-white shadow-sm">
//             <SidebarTrigger />
//           </header>

//           <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-[url('/BackgroundLayout/background-layout.jpg')] bg-cover bg-center overflow-auto bg-gray-50">
//             <div className="w-full max-w-full">{children}</div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }

export default function HeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
