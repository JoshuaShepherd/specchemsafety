"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BookOpen,
  BarChart3,
  Users,
  Settings,
  Building2,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  GraduationCap,
  TrendingUp,
  Shield,
  UserCheck,
  Home,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

// Navigation items based on actual database schema
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Overview and analytics",
    roles: ["admin", "manager", "user"],
  },
  {
    name: "Courses",
    href: "/courses",
    icon: BookOpen,
    description: "Safety training courses",
    roles: ["admin", "manager", "user"],
  },
  {
    name: "My Progress",
    href: "/progress",
    icon: TrendingUp,
    description: "Track your learning progress",
    roles: ["user"],
  },
  {
    name: "Enrollments",
    href: "/enrollments",
    icon: GraduationCap,
    description: "Manage course enrollments",
    roles: ["admin", "manager"],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    description: "User management",
    roles: ["admin", "manager"],
  },
  {
    name: "Plants",
    href: "/plants",
    icon: Building2,
    description: "Facility management",
    roles: ["admin"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Compliance and analytics",
    roles: ["admin", "manager"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration",
    roles: ["admin"],
  },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();
  const {
    user,
    profile,
    getFullName,
    getRole,
    getPermissions,
    isAuthenticated,
  } = useUser();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userRole = getRole();
  const permissions = getPermissions();
  const isAuthenticatedUser = isAuthenticated();

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item =>
    item.roles.includes(userRole || "user")
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrator",
      manager: "Manager",
      user: "Employee",
    };
    return roleMap[role] || role;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Link href={isAuthenticatedUser ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-neutral-900">
                SpecChem Safety
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu - Always hidden, shown via hamburger */}
        <div className="hidden">
          {/* This section is now handled by the mobile menu */}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticatedUser ? (
            // Authenticated user actions
            <>
              {/* User Role Badge */}
              {userRole && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100">
                  <UserCheck className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    {getRoleDisplayName(userRole)}
                  </span>
                </div>
              )}

              {/* User Menu */}
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={getFullName()} />
                  <AvatarFallback className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                    {getFullName() ? getInitials(getFullName()) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getFullName()}
                  </p>
                  <p className="text-xs leading-none text-neutral-500">
                    {user?.email}
                  </p>
                  {userRole && (
                    <p className="text-xs leading-none text-neutral-500">
                      {getRoleDisplayName(userRole)}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger Menu Button - Always visible */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  SpecChem Safety LMS
                </SheetTitle>
              </SheetHeader>

              {/* User Info */}
              <div className="mt-6 p-4 rounded-lg bg-neutral-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={getFullName()} />
                    <AvatarFallback className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                      {getFullName() ? getInitials(getFullName()) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getFullName()}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user?.email}
                    </p>
                    {userRole && (
                      <p className="text-xs text-neutral-500">
                        {getRoleDisplayName(userRole)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="mt-6 space-y-2">
                {isAuthenticatedUser ? (
                  // Authenticated user navigation
                  filteredNavigation.map(item => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-12",
                            isActive && "bg-primary-100 text-primary-600"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-neutral-500">
                              {item.description}
                            </span>
                          </div>
                        </Button>
                      </Link>
                    );
                  })
                ) : (
                  // Public navigation for unauthenticated users
                  <>
                    <Link href="/">
                      <Button
                        variant={pathname === "/" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-12",
                          pathname === "/" && "bg-primary-100 text-primary-600"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Home className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Home</span>
                          <span className="text-xs text-neutral-500">
                            Return to homepage
                          </span>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/courses">
                      <Button
                        variant={pathname.startsWith("/courses") ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-12",
                          pathname.startsWith("/courses") && "bg-primary-100 text-primary-600"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BookOpen className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Training</span>
                          <span className="text-xs text-neutral-500">
                            Browse safety training modules
                          </span>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/help">
                      <Button
                        variant={pathname.startsWith("/help") ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-12",
                          pathname.startsWith("/help") && "bg-primary-100 text-primary-600"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <HelpCircle className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Help</span>
                          <span className="text-xs text-neutral-500">
                            Get support and assistance
                          </span>
                        </div>
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="mt-6 space-y-2">
                {isAuthenticatedUser ? (
                  // Authenticated user actions
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      asChild
                    >
                      <Link href="/profile">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      asChild
                    >
                      <Link href="/help">
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-red-600 hover:text-red-600"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  // Public user actions
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      asChild
                    >
                      <Link href="/auth/login">
                        <Settings className="h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      asChild
                    >
                      <Link href="/auth/register">
                        <UserCheck className="h-4 w-4" />
                        Register
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      asChild
                    >
                      <Link href="/help">
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
            </>
          ) : (
            // Public navigation actions for unauthenticated users
            <>
              {/* Sign In Button */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
              
              {/* Register Button */}
              <Button size="sm" className="px-6" asChild>
                <Link href="/auth/register">
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
