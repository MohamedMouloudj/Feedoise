"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Building2 } from "lucide-react";
import { signOutUser } from "@/actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  userName: string;
  userEmail: string;
  organizationName?: string;
  role?: string;
}

export function UserDropdown({
  userName,
  userEmail,
  organizationName,
  role,
}: UserDropdownProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const result = await signOutUser();
      if (result.success) {
        toast.success("Signed out successfully");
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to sign out");
      }
    } catch (_error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Get initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg hover:bg-accent p-2 transition-colors outline-none">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {organizationName || "Personal"}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizationName && (
          <>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer"
            >
              <Building2 className="mr-2 h-4 w-4" />
              <span>{organizationName}</span>
              {role && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {role}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

