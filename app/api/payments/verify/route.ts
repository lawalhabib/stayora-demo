
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const { searchParams, origin } = new URL(request.url);

    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref");

    if (!secretKey || !reference) {
      return NextResponse.redirect(
        new URL("/booking/confirmation?status=failed", origin)
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      return NextResponse.redirect(
        new URL("/booking/confirmation?status=failed", origin)
      );
    }

    const verificationResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const result = await verificationResponse.json();

    if (
      !verificationResponse.ok ||
      !result.status ||
      result.data?.status !== "success" ||
      result.data?.amount !== payment.amount * 100 ||
      result.data?.currency !== "NGN"
    ) {
      return NextResponse.redirect(
        new URL(
          `/booking/confirmation?status=failed&reference=${encodeURIComponent(reference)}`,
          origin
        )
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { reference },
        data: {
          status: "SUCCESSFUL",
          gatewayResponse: JSON.stringify(result.data),
          paidAt: new Date(),
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "CONFIRMED",
        },
      });
    });

    return NextResponse.redirect(
      new URL(
        `/booking/confirmation?status=success&reference=${encodeURIComponent(reference)}`,
        origin
      )
    );
  } catch (error) {
    console.error("Payment verification error:", error);

    const origin = new URL(request.url).origin;

    return NextResponse.redirect(
      new URL("/booking/confirmation?status=failed", origin)
    );
  }
}
