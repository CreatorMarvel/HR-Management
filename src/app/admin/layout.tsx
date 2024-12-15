import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "../_components/Header";
import Sidebar from "../_components/Sidebar";

export const metadata: Metadata = {
  title: "HR Management",
  description: "Designed to manage employees and departments",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="flex">
          <div className="hidden h-[100vh] bg-slate-700 px-4 py-3 text-white md:block">
            <Sidebar />
          </div>
          <div className="w-full">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
