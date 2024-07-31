import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "~/components/ui/navigation-menu";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default function HeaderBar() {
  const routes = [
    {
      label: "Note",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Docs",
      href: "/",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-50">
      <div className="container h-16 flex justify-between items-center">
        <nav className="flex gap-3 items-center font-medium text-sm">
          {routes.map((item) => (
            <Link
              className="px-4 py-2 hover:bg-gray-100 rounded"
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
      <Separator></Separator>
    </header>
  );
}
