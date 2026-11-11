
import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      apartmentId,
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
    } = body;

    if (
      !apartmentId ||
      !fullName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !checkIn ||
      !checkOut ||
      !Number.isInteger(guests) ||
      guests < 1
    ) {
      return NextResponse.json(
        { error: "Please complete all booking details." },
        { status: 400 }
      );
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (
      !datePattern.test(checkIn) ||
      !datePattern.test(checkOut)
    ) {
      return NextResponse.json(
        { error: "Invalid booking dates." },
        { status: 400 }
      );
    }

    const startDate = new Date(`${checkIn}T00:00:00.000Z`);
    const endDate = new Date(`${checkOut}T00:00:00.000Z`);

    if (
      startDate.toISOString().slice(0, 10) !== checkIn ||
      endDate.toISOString().slice(0, 10) !== checkOut ||
      endDate <= startDate
    ) {
      return NextResponse.json(
        { error: "Check-out must be after check-in." },
        { status: 400 }
      );
    }

    const todayInLagos = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (checkIn < todayInLagos) {
      return NextResponse.json(
        { error: "Check-in cannot be in the past." },
        { status: 400 }
      );
    }

    const nights = Math.round(
      (endDate.getTime() - startDate.getTime()) / 86400000
    );

    const booking = await prisma.$transaction(
      async (tx) => {
        const apartment = await tx.apartment.findFirst({
          where: {
            id: apartmentId,
            isActive: true,
          },
        });

        if (!apartment) {
          throw new Error("APARTMENT_NOT_FOUND");
        }

        if (guests > apartment.maxGuests) {
          throw new Error("TOO_MANY_GUESTS");
        }

        const overlappingBooking = await tx.booking.findFirst({
          where: {
            apartmentId,
            status: {
              in: ["PENDING", "CONFIRMED"],
            },
            checkIn: { lt: endDate },
            checkOut: { gt: startDate },
          },
        });

        if (overlappingBooking) {
          throw new Error("DATES_UNAVAILABLE");
        }

        const customer = await tx.customer.create({
          data: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
          },
        });

        const totalAmount = apartment.price * nights;

        return tx.booking.create({
          data: {
            bookingCode: `STY-${randomUUID()
              .slice(0, 8)
              .toUpperCase()}`,
            apartmentId,
            customerId: customer.id,
            checkIn: startDate,
            checkOut: endDate,
            guests,
            nights,
            totalAmount,
            status: "PENDING",
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return NextResponse.json(
      {
        message: "Booking request received successfully.",
        bookingCode: booking.bookingCode,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "APARTMENT_NOT_FOUND") {
        return NextResponse.json(
          { error: "This apartment is no longer available." },
          { status: 404 }
        );
      }

      if (error.message === "TOO_MANY_GUESTS") {
        return NextResponse.json(
          { error: "Guest count exceeds apartment capacity." },
          { status: 400 }
        );
      }

      if (error.message === "DATES_UNAVAILABLE") {
        return NextResponse.json(
          { error: "These dates are already booked. Please choose other dates." },
          { status: 409 }
        );
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        { error: "Another booking is being processed. Please try again." },
        { status: 409 }
      );
    }

    console.error("Booking error:", error);

    return NextResponse.json(
      { error: "Unable to process booking. Please try again." },
      { status: 500 }
    );
  }
}
