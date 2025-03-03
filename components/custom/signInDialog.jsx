import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from 'uuid';

function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );
  
      console.log(userInfo);
      const user = userInfo.data;
  
      // Store user in database
      const newUser = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuidv4()
      });
      console.log("newUser==>", newUser);
      const storedUser = { ...user, _id: newUser };
      
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      
      setUserDetail(storedUser);
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{Lookup.SIGNIN_HEADING}</DialogTitle>
          <DialogDescription>{Lookup.SIGNIN_SUBHEADING}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Button
            className="w-48 variant-ghost text-black mt-3 cursor-pointer"
            onClick={googleLogin}
          >
            Sign In With Google
          </Button>
          <DialogDescription>{Lookup.SIGNIn_AGREEMENT_TEXT}</DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
