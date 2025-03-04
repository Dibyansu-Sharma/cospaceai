"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar"; //  Import Sidebar Hook

function WorkspaceHistory() {
  const [workspaces, setWorkspaces] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const router = useRouter();
  const { toggleSidebar } = useSidebar(); //  Sidebar Hook

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspaces();
    }
  }, [userDetail]);

  const GetAllWorkspaces = async () => {
    try {
      const res = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetail?._id,
      });
      setWorkspaces(res);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const handleNavigation = (workspaceId) => {
    toggleSidebar(); //  Close sidebar before navigating
    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <div>
      <h2 className="text-medium text-large mb-4">Chat History</h2>

      <div>
        {workspaces?.length > 0 ? (
          workspaces.map((chat, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(chat._id)}
              className="p-3 border rounded-md bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition"
            >
              {chat?.messages[0]?.content || "Untitled Workspace"}
            </div>
          ))
        ) : (
          <p>No workspaces found.</p>
        )}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
