import { OrganizationsService } from "@/services/Organizations";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "12");
    const searchQuery = searchParams.get("search") || undefined;

    const result = await OrganizationsService.findAllPublic({
      skip,
      take,
      searchQuery,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching public organizations:", error);
    return Response.json(
      { error: "Failed to fetch organizations" },
      { status: 500 },
    );
  }
}
