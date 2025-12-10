import { Link, useLocation } from "wouter";
import { Home, UserPlus, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import headerBg from "@assets/generated_images/subtle_blue_geometric_header_background.png";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-background min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="relative bg-primary text-primary-foreground pt-12 pb-8 px-6 overflow-hidden shrink-0">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url(${headerBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              {title || "Student Manager"}
            </h1>
            <p className="text-blue-100 text-sm font-medium opacity-90">
              نظام إدارة الطلاب
            </p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 space-y-6 scroll-smooth">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 flex items-center justify-around px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link href="/">
            <a className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200",
              location === "/" ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}>
              <Home className={cn("w-6 h-6", location === "/" && "fill-current")} />
              <span className="text-[10px] font-medium">الرئيسية</span>
            </a>
          </Link>

          <div className="relative -top-6">
            <Link href="/add">
              <a className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white">
                <UserPlus className="w-6 h-6" />
              </a>
            </Link>
          </div>

          <Link href="/students">
            <a className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200",
              location === "/students" ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}>
              <Users className={cn("w-6 h-6", location === "/students" && "fill-current")} />
              <span className="text-[10px] font-medium">الطلاب</span>
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
}
