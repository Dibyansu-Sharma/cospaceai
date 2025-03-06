import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Download, Rocket } from "lucide-react";
import { ActionContext } from "@/context/ActionContext";

function Header({ showOptions = false }) {
  const { userDetail } = useContext(UserDetailContext);
  const {action, setAction} = useContext(ActionContext);

  const onActionButton= (action)=>{
    setAction({
      actionType:action,
      timeStamp: Date.now()
    })
  }
  return (
    <div className="p-4 flex justify-between items-center">
      {!showOptions && (
        <Image
          src={"/CospaceAI_White_Logo_Cropped.png"}
          alt="CoSpaceAILogo"
          width={40}
          height={40}
        />
      )}

      {/* Show Export/Deploy buttons if showOptions is true, otherwise show Sign In/Get Started */}
      {showOptions ? (
        <div className="flex gap-5">
          <Button className='cursor-pointer' variant="ghost"  onClick={()=>onActionButton('export')}>
            <Download />
            Export
          </Button>
          <Button  className='cursor-pointer' variant="ghost" onClick={()=>onActionButton('deploy')}>
            <Rocket />
            Deploy
          </Button>
        </div>
      ) : (
        !userDetail?.name && (
          <div className="flex gap-5">
            <Button variant="ghost">Sign In</Button>
            <Button variant="ghost">Get Started</Button>
          </div>
        )
      )}
    </div>
  );
}

export default Header;
