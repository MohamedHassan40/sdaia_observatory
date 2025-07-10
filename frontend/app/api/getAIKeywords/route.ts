import { AIKeywords } from "@/constants/aiKeywords";

export async function GET() {
  try {
    return Response.json({
      success: true,
      keywords: AIKeywords.keywords,
      count: AIKeywords.keywords.length
    });
  } catch (error) {
    console.error("Error serving AI keywords:", error);
    return Response.json(
      { 
        error: "Failed to serve AI keywords", 
        message: "Internal server error"
      }, 
      { status: 500 }
    );
  }
} 