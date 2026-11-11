
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Apartment = {
  id: string;
  name: string;
  location: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  image: string;
};

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApartments() {
      try {
        const response = await fetch("/api/apartments");

        if (!response.ok) {
          throw new Error("Unable to load apartments.");
        }

        const data = await response.json();
        setApartments(data);
      } catch (err) {
        setError("We couldn't load apartments. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadApartments();
  }, []);

  const filteredApartments = apartments.filter((apartment) => {
    const matchesCategory =
      category === "All" || apartment.type === category;

    const matchesSearch =
      apartment.name.toLowerCase().includes(search.toLowerCase()) ||
      apartment.location.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="apartments-page">
      <nav className="apartments-nav">
        <Link href="/" className="stayora-logo">
          stayora<span>.</span>
        </Link>

        <div className="apartments-nav-links">
          <Link href="/">Home</Link>
          <Link href="/apartments">Apartments</Link>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="apartments-heading">
        <p className="eyebrow">FIND YOUR PERFECT STAY</p>
        <h1>Discover exceptional places to stay.</h1>
        <p>
          Explore carefully selected apartments designed for comfort,
          privacy and memorable experiences.
        </p>
      </section>

      <section className="apartment-controls">
        <input
          type="search"
          placeholder="Search by apartment or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="category-filters">
          {["All", "Luxury", "Modern"].map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="apartment-results">
        <div className="results-heading">
          <h2>Available apartments</h2>
          <span>{filteredApartments.length} properties</span>
        </div>

        {loading ? (
          <p>Loading apartments...</p>
        ) : error ? (
          <div className="no-apartments">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : filteredApartments.length > 0 ? (
          <div className="apartment-grid">
            {filteredApartments.map((apartment) => (
              <article className="apartment-card" key={apartment.id}>
                <div className="apartment-image">
                  <img src={apartment.image} alt={apartment.name} />
                  <span className="apartment-tag">{apartment.type}</span>
                </div>

                <div className="apartment-info">
                  <p className="apartment-location">
                    {apartment.location}
                  </p>

                  <h3>{apartment.name}</h3>

                  <div className="apartment-features">
                    <span>{apartment.beds} bedrooms</span>
                    <span>{apartment.baths} bathrooms</span>
                    <span>{apartment.guests} guests</span>
                  </div>

                  <div className="apartment-card-bottom">
                    <p>
                      <strong>
                        ₦{apartment.price.toLocaleString("en-NG")}
                      </strong>
                      <span> / night</span>
                    </p>

                    <Link href={`/apartments/${apartment.id}`}>
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-apartments">
            <h3>No apartments found</h3>
            <p>Try another search or choose a different category.</p>
          </div>
        )}
      </section>

      <footer className="apartments-footer" id="contact">
        <Link href="/" className="stayora-logo">
          stayora<span>.</span>
        </Link>

        <p>Exceptional stays. Memorable experiences.</p>

        <span>© 2026 Stayora. All rights reserved.</span>
      </footer>
    </main>
  );
}
