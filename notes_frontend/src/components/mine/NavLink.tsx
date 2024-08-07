import { cn } from "@/lib/utils";
import { NavLink as InnerNav, NavLinkProps } from "react-router-dom";

type NavProps = NavLinkProps & React.RefAttributes<HTMLAnchorElement>;

export default function NavLink({ children, className, ...prop }: NavProps) {


  return <InnerNav className={(navData) => cn("font-medium hover:underline", className, navData.isActive && "underline")} {...prop}>{children}</InnerNav>;
}
