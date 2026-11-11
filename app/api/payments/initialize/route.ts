
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const bookingCode = body.bookingCode;

    if (typeof bookingCode !== "string" || !bookingCode.trim()) {
      return NextResponse.json(
        { error: "A valid booking reference is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: bookingCode.trim() },
      include: {
        customer: true,
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "This booking cannot be paid for." },
        { status: 400 }
      );
    }

    if (booking.payment?.status === "SUCCESSFUL") {
      return NextResponse.json(
        { error: "This booking has already been paid for." },
        { status: 400 }
      );
    }

    const reference =
      booking.payment?.reference ||
      `STY${randomUUID().replace(/-/g, "")}`;

    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {},
      create: {
        bookingId: booking.id,
        reference,
        amount: booking.totalAmount,
        status: "PENDING",
      },
    });

    const callbackUrl = new URL(
      "/api/payments/verify",
      request.url
    ).toString();

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: booking.customer.email,
          amount: String(booking.totalAmount * 100),
          currency: "NGN",
          reference,
          callback_url: callbackUrl,
          metadata: {
            booking_code: booking.bookingCode,
            apartment: booking.apartmentId,
          },
        }),
      }
    );

    const result = await paystackResponse.json();

    if (!paystackResponse.ok || !result.status) {
      console.error("Paystack initialization failed:", result);

      return NextResponse.json(
        { error: "Unable to initialize payment. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    return NextResponse.json(
      { error: "Something went wrong while initializing payment." },
      { status: 500 }
    );
  }
}
