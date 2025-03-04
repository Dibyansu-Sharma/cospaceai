import ChatView from "@/components/custom/chatView";
import CodeView from "@/components/custom/codeView";
import React from "react";

function Workspace() {
  return (
    <div className="p-10">
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
