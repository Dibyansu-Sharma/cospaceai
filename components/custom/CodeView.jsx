"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";
import SandpackPreviewClient from "./SandpackPreviewClient";

const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup.DEFAULT_FILE);
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext);
  const { id } = useParams();
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    if (userDetail?.email) {
      fetchUserToken(userDetail.email);
    }
  }, [userDetail?.email]);

  const fetchUserToken = async (email) => {
    try {
      const existingUser = await convex.query(api.users.GetUser, { email });

      if (existingUser) {
        setUserDetail(existingUser);
      } else {
        console.error("User not found in database.");
      }
    } catch (error) {
      console.error("Error fetching user token:", error);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "user") {
        GenerateAICode();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (id) GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    try {
      const res = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });

      if (!res?.fileData) {
        console.warn("No file data found, using default files.");
      }

      setFiles({ ...Lookup.DEFAULT_FILE, ...(res?.fileData || {}) });
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAICode = async () => {
    if (!userDetail) {
      console.error("User details missing. AI generation aborted.");
      return;
    }

    const currentToken = Number(userDetail?.token || 0);
    if (currentToken <= 0) {
      return;
    }

    setLoading(true);
    try {
      const lastMessage = messages[messages.length - 1]?.content;
      if (!lastMessage) {
        console.error("Last message content missing. AI generation aborted.");
        return;
      }

      const PROMPT = lastMessage + " " + Prompt.CODE_GEN_PROMPT;
      const res = await axios.post("/api/generate-ai-code", { prompt: PROMPT });

      if (!res?.data?.files) {
        console.error("AI response does not contain files. Aborting update.");
        return;
      }

      const aiRes = res.data;
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiRes.files };
      setFiles(mergedFiles);

      await UpdateFiles({ workspaceId: id, files: aiRes.files });

      // Calculate new token balance
      const usedTokens = countToken(JSON.stringify(aiRes));
      const updatedToken = Math.max(0, currentToken - usedTokens);

      // Update token count in DB
      await UpdateTokens({ userId: userDetail._id, token: updatedToken });
      setUserDetail({ ...userDetail, token: updatedToken });
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] w-full p-2 border rounded-md">
      {/* Tab Switcher */}
      <div className="flex items-center flex-wrap bg-black p-2 rounded-md w-max mx-auto gap-3">
        <button
          onClick={() => setActiveTab("code")}
          className={`text-sm px-4 py-1 rounded-full transition-colors duration-300 cursor-pointer ${
            activeTab === "code"
              ? "text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`text-sm px-4 py-1 rounded-full transition-colors duration-300 cursor-pointer ${
            activeTab === "preview"
              ? "text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Preview
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-500"></div>
        </div>
      ) : (
        <SandpackProvider
          files={files}
          template="react"
          theme="dark"
          customSetup={{ dependencies: { ...Lookup.DEPENDANCY } }}
          options={{ externalResources: ["https://unpkg.com/@tailwindcss/browser@4"] }}
        >
          <SandpackLayout className="border border-gray-700 rounded-md mt-4">
            {activeTab === "code" ? (
              <>
                <SandpackFileExplorer className="h-[80vh] border-r border-gray-700 bg-gray-900" />
                <SandpackCodeEditor className="h-[80vh] bg-gray-800" />
              </>
            ) : (
              <SandpackPreviewClient />
            )}
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
}

export default CodeView;
