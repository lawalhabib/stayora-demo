
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Apartment = {
  id: string;
  name: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  guests: number;
  image: string;
  description: string;
  amenities: string[];
};

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateNights(start: string, end: string) {
  if (!start || !end) return 0;

  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);

  const startDate = Date.UTC(startYear, startMonth - 1, startDay);
  const endDate = Date.UTC(endYear, endMonth - 1, endDay);

  return Math.round((endDate - startDate) / 86400000);
}

export default function ApartmentDetails() {
  const params = useParams();
  const id = params.id as string;

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingBookingCode, setPendingBookingCode] = useState("");

  useEffect(() => {
    async function loadApartment() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/apartments/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Apartment not found."
              : "Unable to load apartment details."
          );
        }

        const data = await response.json();
        setApartment(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadApartment();
    }
  }, [id]);

  const today = getLocalDate();
  const nights = calculateNights(checkIn, checkOut);
  const validDates = nights > 0;

  const minimumCheckout = checkIn
    ? (() => {
        const [year, month, day] = checkIn.split("-").map(Number);
        const date = new Date(year, month - 1, day + 1);
        const nextYear = date.getFullYear();
        const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
        const nextDay = String(date.getDate()).padStart(2, "0");

        return `${nextYear}-${nextMonth}-${nextDay}`;
      })()
    : today;

  async function initializePayment(bookingCode: string) {
    if (submitting) return;

    try {
      setSubmitting(true);
      setBookingError("");

      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start payment.");
      }

      if (!data.authorizationUrl) {
        throw new Error("Paystack did not return a checkout link.");
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Payment initialization failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function bookApartment() {
    if (!apartment || submitting) return;

    setBookingError("");

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setBookingError("Please enter your name, email and phone number.");
      return;
    }

    if (!validDates || checkIn < today) {
      setBookingError("Please select valid check-in and check-out dates.");
      return;
    }

    if (guests > apartment.guests) {
      setBookingError(
        `This apartment accommodates up to ${apartment.guests} guests.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apartmentId: apartment.id,
          fullName,
          email,
          phone,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to complete your booking.");
      }

      setPendingBookingCode(data.bookingCode);

      const paymentResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingCode: data.bookingCode,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.error || "Unable to start payment."
        );
      }

      if (!paymentData.authorizationUrl) {
        throw new Error("Paystack did not return a checkout link.");
      }

      window.location.href = paymentData.authorizationUrl;
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="details-page">
        <p>Loading apartment details...</p>
      </main>
    );
  }

  if (error || !apartment) {
    return (
      <main className="details-page">
        <h1>{error || "Apartment not found"}</h1>
        <Link href="/apartments">Back to apartments</Link>
      </main>
    );
  }

  return (
    <main className="details-page">
      <nav className="apartments-nav">
        <Link href="/" className="stayora-logo">
          stayora<span>.</span>
        </Link>

        <div className="apartments-nav-links">
          <Link href="/">Home</Link>
          <Link href="/apartments">Apartments</Link>
          <a href="#booking">Book a stay</a>
        </div>
      </nav>

      <div className="details-container">
        <Link href="/apartments" className="back-link">
          ← Back to apartments
        </Link>

        <div className="details-title">
          <div>
            <p className="apartment-location">{apartment.location}</p>
            <h1>{apartment.name}</h1>
          </div>

          <p className="details-price">
            ₦{apartment.price.toLocaleString("en-NG")}
            <span> / night</span>
          </p>
        </div>

        <div className="details-image">
          <img src={apartment.image} alt={apartment.name} />
        </div>

        <div className="details-content">
          <section className="details-description">
            <h2>About this apartment</h2>
            <p>{apartment.description}</p>

            <div className="details-features">
              <div>
                <strong>{apartment.beds}</strong>
                <span>Bedrooms</span>
              </div>

              <div>
                <strong>{apartment.baths}</strong>
                <span>Bathrooms</span>
              </div>

              <div>
                <strong>{apartment.guests}</strong>
                <span>Maximum guests</span>
              </div>
            </div>

            {apartment.amenities.length > 0 && (
              <div className="details-amenities">
                <h2>Amenities</h2>
                <ul>
                  {apartment.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <aside className="booking-panel" id="booking">
            <h2>Reserve your stay</h2>

            <p className="booking-rate">
              ₦{apartment.price.toLocaleString("en-NG")}
              <span> / night</span>
            </p>

            <label>Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              disabled={submitting}
            />

            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={submitting}
            />

            <label>Phone number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              disabled={submitting}
            />

            <label>Check-in</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                const value = event.target.value;
                setCheckIn(value);

                if (checkOut && value && checkOut <= value) {
                  setCheckOut("");
                }
              }}
              disabled={submitting}
            />

            <label>Check-out</label>
            <input
              type="date"
              min={minimumCheckout}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              disabled={submitting}
            />

            <label>Number of guests</label>
            <select
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              disabled={submitting}
            >
              {Array.from(
                { length: apartment.guests },
                (_, index) => index + 1
              ).map((number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>

            {validDates && (
              <div className="booking-total">
                <div>
                  <span>{nights} nights</span>
                  <strong>
                    ₦{(nights * apartment.price).toLocaleString("en-NG")}
                  </strong>
                </div>
              </div>
            )}

            {bookingError && (
              <p role="alert" className="booking-error">
                {bookingError}
              </p>
            )}

            <button
              className="book-button"
              onClick={() => {
                if (pendingBookingCode) {
                  initializePayment(pendingBookingCode);
                } else {
                  bookApartment();
                }
              }}
              disabled={submitting}
            >
              {submitting
                ? "Processing..."
                : pendingBookingCode
                  ? "Retry Payment"
                  : "Book Now"}
            </button>

            <p className="booking-note">
              Secure your preferred dates with Stayora.
            </p>
          </aside>
        </div>
      </div>

      <footer className="apartments-footer">
        <Link href="/" className="stayora-logo">
          stayora<span>.</span>
        </Link>

        <p>Exceptional stays. Memorable experiences.</p>

        <span>© 2026 Stayora. All rights reserved.</span>
      </footer>
    </main>
  );
}
