import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page")) || 1;
  const limit = parseInt(url.searchParams.get("limit")) || 9;

  const skip = (page - 1) * limit;

  try {
    await connectToDB();

    const prompts = await Prompt.find({})
      .populate("creator")
      .skip(skip)
      .limit(limit);

    return new NextResponse(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new NextResponse(
      { error: "Error Fetching Prompts" },
      { status: 500 }
    );
  }
};
