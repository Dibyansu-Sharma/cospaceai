"use client";
import Lookup from "@/data/Lookup";
import React, { useContext, useState } from "react";
import { ArrowUp, Link } from "lucide-react";
import Colors from "@/data/Colors";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./signInDialog";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();
  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    setMessages({ role: "user", content: input });
    const msg = { role: "user", content: input };
    console.log("userDetail her0", userDetail);
    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages: [msg],
    });
    console.log("workspaceId", workspaceId);
    router.push('/workspace/'+workspaceId);
  };
  return (
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="w-full h-12 max-h-24 resize-none p-2 focus:outline-none"
            onChange={(event) => setUserInput(event.target.value)}
          />
          {userInput && (
            <ArrowUp
              onClick={() => onGenerate(userInput)}
              className="bg-black-500 p-2 h-10 w-10 text-gray-400 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div>
          <Link className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center">
        {Lookup?.SUGGESTIONS.map((suggestion, index) => {
          return (
            <h2
              key={index}
              className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
              onClick={() => onGenerate(suggestion)}
            >
              {suggestion}
            </h2>
          );
        })}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(false)}
      />
    </div>
  );
}

export default Hero;
