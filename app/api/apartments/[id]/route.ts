
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const apartment = await prisma.apartment.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: apartment.id,
      name: apartment.name,
      location: apartment.location,
      price: apartment.price,
      beds: apartment.bedrooms,
      baths: apartment.bathrooms,
      guests: apartment.maxGuests,
      image: apartment.photos[0] || "",
      description: apartment.description,
      amenities: apartment.amenities,
    });
  } catch (error) {
    console.error("Apartment details API error:", error);

    return NextResponse.json(
      { error: "Unable to load apartment details" },
      { status: 500 }
    );
  }
}
