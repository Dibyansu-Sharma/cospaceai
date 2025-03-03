import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST (req){
    const {prompt} = await req.json();

    try{
        const res = await chatSession.sendMessage(prompt);
        const response = res.response.text();
        
        return NextResponse.json({result: response});
    }catch(e){
        return NextResponse.error({error: e})
    }
}