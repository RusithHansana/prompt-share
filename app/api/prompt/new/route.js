import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { userId, prompt, tags } = await req.json();

  try {
    await connectToDB();

    const newPrompt = await Prompt.create({
      creator: userId,
      prompt,
      tags,
    });

    await newPrompt.save();

    return new NextResponse(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse({ error: "Error Creating Post" }, { status: 500 });
  }
};
