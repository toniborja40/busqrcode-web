import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Navbar_header from "../components/Navbar_Header";
import SideBar from "@/components/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { cookies } from "next/headers";
const jwtName = process.env.JWT_NAME;
if (!jwtName) {
  throw new Error("JWT_NAME is not defined in environment variables");
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}){
  const cookieStore = await cookies();
  const token: any = cookieStore.get(jwtName as any);
  let verification = true;
  try {
    jwt.verify(token.value, process.env.JWT_SECRET as Secret) as JwtPayload;
    verification = true;
  } catch (error) {
    verification = false
  }

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            {verification ?<> <Navbar_header />
            <div className="flex flex-row flex-grow">
             {/* <SideBar /> */}
              <main className="container flex-grow relative pt-8 px-6">
                {children}
              </main>
              </div></>
               : 
              <main className=" flex-grow relative pt-8 px-6">
              {children}
            </main>} 
            {/* <footer className="w-full flex items-center justify-center py-3">
              {/* colocar algo aquí después
            </footer> */}
          </div>
        </Providers>
        <ToastContainer autoClose={2000} />
      </body>
    </html>
  );
}
