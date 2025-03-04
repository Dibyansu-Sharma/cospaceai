import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="p-4 flex justify-between items-center">
      <Image
        src={"/CospaceAI_White_Logo_Cropped.png"}
        alt="CoSpaceAILogo"
        width={40}
        height={40}
      ></Image>
      {!userDetail?.name && (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button variant="ghost">Get Started</Button>
        </div>
      )}
    </div>
  );
}

export default Header;
