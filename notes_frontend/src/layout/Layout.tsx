import NavLink from "@/components/mine/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/user";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const { isAuthenticated } = useAuth();

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
          <NavLink to="/">Notes</NavLink>
        </div>
        <div className="flex-grow"></div>
        {!isAuthenticated && (
          <div>
            <div>
              <Button variant={"secondary"}>
                <Link to="/auth/login">Login</Link>
              </Button>
            </div>
            <div>
              <Button variant={"default"}>
                <Link to="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <div>
            <div>
              <Button variant={"secondary"}>
                <Link to="/auth/logout">Log Out</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
      <main className="container flex-1 min-h-screen">
        <Outlet />
      </main>
      <Separator />
      <footer className="container bg-muted h-24 flex items-center justify-center gap-24 text-muted-foreground">
        <div>Powered by <Link to={"https://react.dev"} className="underline hover:text-primary ">React</Link></div>
      </footer>
    </div>
  );
}
