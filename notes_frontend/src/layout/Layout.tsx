import NavLink from "@/components/mine/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/user";
import { LogOutIcon } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col">
      <nav className="container flex items-center gap-4 py-4">
        <div>
          <Avatar>
            <AvatarImage src="/logo.png" alt="@notes" />
            <AvatarFallback>ppvan</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <NavLink to="/">My Notes</NavLink>
        </div>

        {isAuthenticated && !user?.is_superuser && (
          <div>
            <NavLink to="/shared/">Share with me</NavLink>
          </div>
        )}
        <div className="flex-grow"></div>
        {!isAuthenticated && (
          <div className="flex gap-2">
              <Button variant={"secondary"}>
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button variant={"default"}>
                <Link to="/auth/sign-up">Sign Up</Link>
              </Button>
          </div>
        )}
        {user?.is_superuser && (
          <div className="mx-5">
            <NavLink to="/admin/roles">Roles</NavLink>
          </div>
        )}

        {user?.is_superuser && (
          <div className="mx-5">
            <NavLink to="/admin/permissions">Assign</NavLink>
          </div>
        )}

        {isAuthenticated && (
          <div>
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarFallback>
                    {user?.username.slice(0, 2).toUpperCase() ?? "GT"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <div>
                  <Button variant={"secondary"}>
                    <Link className="flex gap-2 items-center" to="/auth/logout">
                      <LogOutIcon />
                      <span>Log Out</span>
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </nav>
      <main className="container flex-1 min-h-screen">
        <Outlet />
      </main>
      <Separator />
      <footer className="bg-muted h-24 flex items-center justify-center gap-24 text-muted-foreground">
        <div>
          Powered by{" "}
          <Link
            to={"https://react.dev"}
            className="underline hover:text-primary "
          >
            React
          </Link>
        </div>
      </footer>
    </div>
  );
}
