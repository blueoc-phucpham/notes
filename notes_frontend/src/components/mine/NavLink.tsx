import { cn } from "@/lib/utils";
import { Link, LinkProps } from "react-router-dom";

type NavProps = LinkProps & React.RefAttributes<HTMLAnchorElement>;

export default function NavLink({ children, className, ...prop }: NavProps) {
  return <Link className={cn("font-medium hover:underline", className)} {...prop}>{children}</Link>;
}
