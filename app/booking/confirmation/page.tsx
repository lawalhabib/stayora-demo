
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reference = searchParams.get("reference");

  const successful = status === "success";

  return (
    <main className="details-page">
      <div
        className="details-container"
        style={{
          maxWidth: "650px",
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <div className="booking-panel">
          {successful ? (
            <>
              <h1>Payment successful!</h1>
              <p>
                Your payment has been verified and your booking is confirmed.
              </p>
              <p>
                <strong>Payment reference:</strong>
              </p>
              <p>{reference}</p>
            </>
          ) : (
            <>
              <h1>Payment not confirmed</h1>
              <p>
                We could not confirm your payment. If you were charged,
                please contact Stayora with your payment reference.
              </p>
              {reference && (
                <p>
                  <strong>Reference:</strong> {reference}
                </p>
              )}
            </>
          )}

          <Link
            href="/apartments"
            className="book-button"
            style={{
              display: "inline-block",
              textDecoration: "none",
              marginTop: "20px",
            }}
          >
            Browse apartments
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BookingConfirmation() {
  return (
    <Suspense
      fallback={
        <main className="details-page">
          <div className="details-container">
            <div className="booking-panel">
              <p>Loading booking confirmation...</p>
            </div>
          </div>
        </main>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
