
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    const formattedApartments = apartments.map((apartment) => ({
      id: apartment.id,
      name: apartment.name,
      location: apartment.location,
      price: apartment.price,
      type: apartment.price >= 180000 ? "Luxury" : "Modern",
      beds: apartment.bedrooms,
      baths: apartment.bathrooms,
      guests: apartment.maxGuests,
      image: apartment.photos[0] || "",
    }));

    return NextResponse.json(formattedApartments);
  } catch (error) {
    console.error("Apartments API error:", error);
    return NextResponse.json(
      { error: "Unable to load apartments" },
      { status: 500 }
    );
  }
}
