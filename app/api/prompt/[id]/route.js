import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) {
      return new NextResponse({ error: "Prompt Not Found" }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new NextResponse(
      { error: "Error Fetching Prompts" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new NextResponse({ error: "Prompt Not Found" }, { status: 404 });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    const updatedPrompt = await existingPrompt.save();

    return new NextResponse(JSON.stringify(updatedPrompt), { status: 200 });
  } catch (error) {
    return new NextResponse(
      { error: "Error Updating Prompt" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    await Prompt.findByIdAndDelete(params.id);

    return new NextResponse("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse(
      { error: "Error Deleting Prompt" },
      { status: 500 }
    );
  }
};
