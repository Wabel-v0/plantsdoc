import { type NextRequest, NextResponse } from "next/server";
import { analyzePlantImage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    // Extract the image data from the request
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the image file to base64
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const base64Image = `data:${imageFile.type};base64,${imageBuffer.toString(
      "base64"
    )}`;

    // Send the image to Gemini for analysis
    const analysisResult = await analyzePlantImage(base64Image);

    // Check if there was an error with the analysis
    if (analysisResult.error) {
      return NextResponse.json(
        { error: analysisResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    return NextResponse.json(
      { error: "Failed to analyze plant image" },
      { status: 500 }
    );
  }
}
