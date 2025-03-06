"use client";

import React, { useContext, useEffect, useRef } from "react";
import {
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { ActionContext } from "@/context/ActionContext";

function SandpackPreviewClient() {
  const { sandpack } = useSandpack();
  const previewRef = useRef();
  const { action } = useContext(ActionContext);

  useEffect(() => {
    const checkClient = async () => {
      if (previewRef.current) {
        try {
          const client = await previewRef.current.getClient();
          console.log("client:", client);

          if (client) {
            const res = await client.getCodeSandboxURL();
            console.log("res:", res);

            if (action?.actionType === "deploy") {
              window.open(`https://${res?.sandboxId}.csb.app/`);
            } else if (action?.actionType === "export") {
              window.open(res?.editorUrl);
            }
          }
        } catch (error) {
          console.error("Error getting Sandpack client:", error);
        }
      }
    };

    // Wait for Sandpack to be ready before calling getClient()
    if (sandpack.status === "running") {
      setTimeout(checkClient, 1000); // Adding a slight delay ensures readiness
    }
  }, [sandpack.status, action]);

  return (
    <div>
      <SandpackPreview
        ref={previewRef}
        className="h-full border border-gray-700 rounded-md"
        showNavigator={true}
      />
    </div>
  );
}

export default SandpackPreviewClient;
