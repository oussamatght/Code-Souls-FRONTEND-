"use client";

import { cn } from "@/lib/utils";
import {
  Map,
  Store,
  Swords,
  Trophy,
  BookOpen,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "map", label: "World Map", icon: Map, href: "/world-selector" },
  { id: "store", label: "Store", icon: Store, href: "/store" },
  { id: "arena", label: "Arena", icon: Swords, href: "/arena" },
  { id: "learn", label: "Lessons", icon: BookOpen, href: "/learn" },
  { id: "docs", label: "Docs", icon: FileText, href: "/docs" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (item: (typeof navItems)[0]) => {
    onTabChange(item.id);
    router.push(item.href);
  };

  return (
    <aside className="fixed left-0 top-[73px] bottom-0 w-16 lg:w-64 bg-souls-darker border-r-2 border-souls-dark flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start px-2 lg:px-4 border-b-2 border-souls-dark">
        <span className="text-xl font-mono font-bold text-souls-red">CS</span>
        <span className="hidden lg:inline text-xl font-mono font-bold text-souls-light ml-1">
          Code Souls
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleNavigation(item)}
            className={cn(
              "w-full justify-center lg:justify-start gap-3 h-11 lg:h-11 font-mono text-sm",
              activeTab === item.id
                ? "bg-souls-red/20 text-souls-red border-l-2 border-souls-red"
                : "text-souls-light/60 hover:bg-souls-dark hover:text-souls-light",
            )}>
            <item.icon size={18} />
            <span className="hidden lg:inline font-medium">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 lg:p-4 border-t-2 border-souls-dark space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-3 h-11 lg:h-11 text-souls-light/60 hover:bg-souls-dark hover:text-souls-light font-mono text-sm"
          onClick={() => router.push("/settings")}>
          <Settings size={18} />
          <span className="hidden lg:inline font-medium">Settings</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="w-full justify-center lg:justify-start gap-3 h-11 lg:h-11 text-souls-red hover:bg-souls-red/10 font-mono text-sm">
          <LogOut size={18} />
          <span className="hidden lg:inline font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
