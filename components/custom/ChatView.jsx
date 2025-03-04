"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, Loader2 } from "lucide-react";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import MarkdownRenderer from "./MarkdownReder";
import { useSidebar } from "../ui/sidebar";

const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fetchedWorkspace = useRef(false);
  const lastMessageRef = useRef(null);

  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { toggleSidebar } = useSidebar();

  // Fetch user details and token when user logs in
  useEffect(() => {
    if (userDetail?.email) {
      fetchUserToken(userDetail.email);
    }
  }, [userDetail?.email]);

  const fetchUserToken = async (email) => {
    try {
      const existingUser = await convex.query(api.users.GetUser, { email });

      if (existingUser) {
        // Ensure we have the latest token from the database
        setUserDetail(existingUser);
      } else {
        console.error("User not found in database.");
      }
    } catch (error) {
      console.error("Error fetching user token:", error);
    }
  };

  // Fetch workspace data only once
  useEffect(() => {
    if (id && !fetchedWorkspace.current) {
      GetWorkspaceData();
      fetchedWorkspace.current = true;
    }
  }, [id]);

  const GetWorkspaceData = async () => {
    try {
      const res = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      setMessages(res?.messages || []);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  // Detect new user messages and trigger AI response
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "user" &&
      lastMessage !== lastMessageRef.current
    ) {
      lastMessageRef.current = lastMessage;
      GetAiResponse();
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const GetAiResponse = async () => {
    if (!userDetail) {
      console.error("User details are missing. AI response aborted.");
      return;
    }

    const currentToken = Number(userDetail?.token || 0);
    if (currentToken <= 0) {
      return;
    }

    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });

      if (!result?.data?.result) {
        console.error("AI response is empty. Skipping update.");
        return;
      }

      const aiRes = { role: "ai", content: result.data.result };
      setMessages((prev) => [...prev, aiRes]);

      await UpdateMessages({
        messages: [...messages, aiRes],
        workspaceId: id,
      });

      // Calculate remaining tokens
      const usedTokens = countToken(JSON.stringify(aiRes));
      const updatedToken = Math.max(0, currentToken - usedTokens);

      // Update token count in DB and UI
      await UpdateTokens({ userId: userDetail._id, token: updatedToken });
      setUserDetail({ ...userDetail, token: updatedToken });
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen px-4">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pb-48 pr-2 custom-scrollbar">
        {(messages || []).map((msg, index) => (
          <div key={index} className="flex gap-3 items-start px-2">
            {msg?.role === "user" && userDetail?.picture && (
              <Image
                src={userDetail.picture}
                alt="User"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <div className="text-sm leading-relaxed border rounded-xl px-4 py-2 w-full max-w-3xl shadow">
              <MarkdownRenderer content={msg.content} />
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 w-full max-w-3xl">
            <Loader2 className="animate-spin text-gray-500 w-5 h-5" />
            <span className="text-sm text-gray-500">
              Generating Response...
            </span>
          </div>
        )}

        {/* Empty div for auto-scroll */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Chat Input Box */}
      <div className="flex items-center gap-4 p-4 border-t w-full max-w-3xl mx-auto">
        {/* Profile Picture - Click to Toggle Sidebar */}
        {userDetail && (
          <Image
            src={userDetail?.picture}
            alt="User"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
          />
        )}

        {/* Chat Input Box */}
        <div className="flex-grow border rounded-xl shadow p-2">
          <div className="flex gap-3 items-end">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="w-full h-12 max-h-24 resize-none p-2 focus:outline-none rounded-lg"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
            />
            {userInput && (
              <ArrowUp
                onClick={() => {
                  const newUserMessage = { role: "user", content: userInput };
                  setMessages((prev) => [...prev, newUserMessage]);
                  setUserInput("");
                }}
                className="bg-gray-800 text-white p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
