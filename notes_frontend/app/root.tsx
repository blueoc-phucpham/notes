import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/globals.css?url";
import HeaderBar from "~/components/partials/NavigationBar";
import Footer from "./components/partials/Footer";
import { Toaster } from "~/components/ui/toaster";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <HeaderBar />
        <main className="container justify-center flex mx-auto flex-grow">
          <Outlet />
          <Toaster></Toaster>
        </main>
        <Footer
          author="https://github.com/ppvan"
          projectLink="https://github.com/blueoc-phucpham/notes"
        />
        <Scripts />
      </body>
    </html>
  );
}
