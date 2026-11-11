const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const apartments = [
  {
    id: "1",
    name: "The Eko Residence",
    slug: "the-eko-residence",
    description: "A spacious luxury apartment in Victoria Island, designed for a comfortable and memorable stay.",
    location: "Victoria Island, Lagos",
    price: 180000,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    photos: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"],
    amenities: ["Wi-Fi", "Swimming pool", "Air conditioning", "Fully equipped kitchen"],
    isActive: true,
  },
  {
    id: "2",
    name: "The Haven Apartment",
    slug: "the-haven-apartment",
    description: "A stylish and welcoming apartment in Lekki Phase 1, ideal for business and leisure stays.",
    location: "Lekki Phase 1, Lagos",
    price: 125000,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    photos: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"],
    amenities: ["Wi-Fi", "Smart TV", "Air conditioning", "Kitchen"],
    isActive: true,
  },
  {
    id: "3",
    name: "The Grand Penthouse",
    slug: "the-grand-penthouse",
    description: "An elegant penthouse offering generous living spaces and a premium residential experience in Ikoyi.",
    location: "Ikoyi, Lagos",
    price: 250000,
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    photos: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"],
    amenities: ["Wi-Fi", "Swimming pool", "Gym", "Balcony", "Air conditioning"],
    isActive: true,
  },
  {
    id: "4",
    name: "Urban Comfort",
    slug: "urban-comfort",
    description: "A comfortable modern apartment in Chevron, perfect for guests seeking convenience and value.",
    location: "Chevron, Lagos",
    price: 95000,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    photos: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"],
    amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Smart TV"],
    isActive: true,
  },
  {
    id: "5",
    name: "The Royal Suite",
    slug: "the-royal-suite",
    description: "A refined three-bedroom apartment in Oniru, offering comfort, privacy and contemporary style.",
    location: "Oniru, Lagos",
    price: 200000,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    photos: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f"],
    amenities: ["Wi-Fi", "Swimming pool", "Gym", "Air conditioning"],
    isActive: true,
  },
  {
    id: "6",
    name: "City View Apartment",
    slug: "city-view-apartment",
    description: "A bright and practical apartment in Ikeja GRA, suitable for short business or leisure visits.",
    location: "Ikeja GRA, Lagos",
    price: 110000,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    photos: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"],
    amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Secure parking"],
    isActive: true,
  },
];

async function main() {
  for (const apartment of apartments) {
    await prisma.apartment.upsert({
      where: { id: apartment.id },
      update: apartment,
      create: apartment,
    });
  }

  console.log("Successfully added 6 Stayora apartments.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });