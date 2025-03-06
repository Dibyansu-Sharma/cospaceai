"use client";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import Header from "@/components/custom/Header";
import React from "react";

function Workspace() {
  return (
    <div className="p-10">
      <Header showOptions={true} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* ChatView */}
        <ChatView />

        {/* CodeView */}
        <div className="col-span-2">
          <CodeView />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
