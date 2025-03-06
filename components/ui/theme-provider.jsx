"use client";

import React, { use, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "../custom/Header";
import { useState } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppSidebar } from "../custom/AppSidebar";
import { SidebarProvider } from "./sidebar";
import { ActionContext } from "@/context/ActionContext";

function Provider({ children }) {
  const [messages, setMessages] = useState();
  const [userDetail, setUserDetail] = useState();
  const [action, setAction] = useState();

  const convex = useConvex();

  useEffect(() => {
    isAuthenticated();
  }, []);
  const isAuthenticated = async () => {
    if (typeof window !== undefined) {
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);

      // fetch from database
      const result = await convex.query(api.users.GetUser, {
        email: parsedUser?.email || "",
      });

      setUserDetail(result);
    }
  };
  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
      >
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{action, setAction}}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                {children}
              </SidebarProvider>
            </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;
