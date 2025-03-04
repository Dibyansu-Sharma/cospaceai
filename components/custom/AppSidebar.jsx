import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import Image from "next/image";
import WorkspaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Image
          src={"/CospaceAI_White_Logo_Cropped.png"}
          alt="CoSpaceAILogo"
          width={40}
          height={40}
        />
        <Button className="mt-5">
          {" "}
          <MessageCircleCode />
          Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <WorkspaceHistory />
        <SidebarGroup />
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
