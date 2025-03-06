"use client";
import Lookup from "@/data/Lookup";
import React, { useContext, useEffect, useState } from "react";
import { ArrowUp, Link } from "lucide-react";
import Colors from "@/data/Colors";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
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
  useEffect(() => {
    if (!userDetail?._id) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?._id) {
        setUserDetail(storedUser);
      }
    }
  }, []);

  const onGenerate = async (input) => {
    // Ensure user is logged in
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }

    if (!userDetail?._id) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?._id) {
        setUserDetail(storedUser);
      } else {
        console.error("User ID is missing. Please log in again.");
        return;
      }
    }

    setMessages([{ role: "user", content: input }]);
    const msg = { role: "user", content: input };

    const workspaceId = await CreateWorkspace({
      user: userDetail._id || JSON.parse(localStorage.getItem("user"))?._id,
      messages: [msg],
    });

    router.push("/workspace/" + workspaceId);
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
