"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, Loader2 } from "lucide-react";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const res = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(res?.messages);
    console.log("res get workspace", res);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") GetAiResponse();
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Allow DOM updates before scrolling
  }, [messages]);

  const GetAiResponse = async () => {
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    setLoading(true);
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });
    setLoading(false);
    setMessages((prev) => [...prev, { role: "ai", content: result.data.result }]);
    console.log("ai res", result);
  };

  return (
    <div className="relative flex flex-col h-screen px-4">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pb-40 pr-2 custom-scrollbar">
      {messages?.map((msg, index) => (
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
            <p className="text-sm leading-relaxed border rounded-xl px-4 py-2 w-full max-w-3xl shadow">
              {msg.content}
            </p>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 w-full max-w-3xl">
            <Loader2 className="animate-spin text-gray-500 w-5 h-5" />
            <span className="text-sm text-gray-500">Generating Response...</span>
          </div>
        )}

        {/* Empty div for auto-scroll */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Chat Input Box (Sticky at Bottom, Intuitive Placement) */}
      <div className="sticky bottom-0 left-0 right-0 p-4 w-full max-w-3xl mx-auto border rounded-xl shadow pt-2">
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
                setMessages((prev) => [...prev, { role: "user", content: userInput }]);
                setUserInput("");
              }}
              className="bg-gray-800 text-white p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatView;
