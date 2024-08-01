import NavLink from "@/components/mine/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav className="container flex items-center gap-4 py-4">
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/ppvan.png" alt="@ppvan" />
            <AvatarFallback>ppvan</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <NavLink to="/">Notes</NavLink>
        </div>
        <div className="flex-grow"></div>
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
      </nav>
      <main className="container">
        <Outlet />
      </main>
      <Separator />
      <footer className="container">
        <div>Built by ppvan with love</div>
      </footer>
    </div>
  );
}
