import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json();

  try {
    await connectToDB();

    const newPrompt = await Prompt.create({
      creator: userId,
      prompt,
      tag,
    });

    await newPrompt.save();

    return NextResponse.json(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error Creating Post" }, { status: 500 });
  }
};
