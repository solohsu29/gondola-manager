
import { useState } from "react";
import Link from "next/link";
import { useUserInfo } from "@/components/hooks/useUserInfo";
import { Bell, Search, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "../data/mockData";


interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [unreadCount] = useState(
    mockNotifications.filter((notif) => !notif.read).length
  );
  const { user, removeAllData } = useUserInfo();

  const handleLogout = () => {
    removeAllData();
    window.location.href = "/login";
  };

  console.log('user',user)
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gondola-800">Gondola Manager</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 space-x-2">
          <div className="hidden md:block relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-4 text-gray-400" />
          <Input
            placeholder="Search ..."
            className="pl-9"
           
          />
          </div>

          <div className="flex  gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-status-warning text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockNotifications.slice(0, 4).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
                    <div className="flex items-start space-x-2 w-full">
                      <div className={`h-2 w-2 mt-2 rounded-full ${
                        notification.type === 'info' ? 'bg-blue-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {notification.date.toLocaleDateString()} • {notification.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  <span className="text-sm text-center text-gondola-600 font-medium">View all notifications</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && user.email ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2 relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>{user.email[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/preferences">Preferences</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="ml-2">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="ml-2">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
