import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Pill,
  Menu,
  BarChart,
  Settings,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Drugs", href: "/drugs", icon: Package },
    { name: "Reports", href: "/reports", icon: BarChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center gap-2 px-4 border-b lg:px-6">
        <Pill className="h-6 w-6 text-primary" />
        <span className="font-semibold">Drug Manager</span>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => {
            logoutMutation.mutate();
            setIsOpen(false);
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 h-16">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            <span className="font-semibold">Drug Manager</span>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full max-w-xs">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block lg:flex-shrink-0">
        <div className="fixed h-full w-64 flex-col bg-sidebar border-r hidden lg:flex">
          <NavContent />
        </div>
      </div>
    </>
  );
}