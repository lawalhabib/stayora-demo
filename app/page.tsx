
"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const stays = [
  {
    id: 1,
    name: "The Aurelia Residence",
    location: "Lekki Phase 1, Lagos",
    type: "2-bedroom apartment",
    price: "₦185,000",
    rating: "4.98",
    reviews: "124",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    tag: "GUEST FAVOURITE",
  },
  {
    id: 2,
    name: "The Palm House",
    location: "Victoria Island, Lagos",
    type: "1-bedroom apartment",
    price: "₦125,000",
    rating: "4.94",
    reviews: "86",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    tag: "DESIGNER PICK",
  },
  {
    id: 3,
    name: "The Ivory Penthouse",
    location: "Ikoyi, Lagos",
    type: "3-bedroom penthouse",
    price: "₦320,000",
    rating: "5.0",
    reviews: "59",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    tag: "PREMIUM STAY",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destination, setDestination] = useState("Lagos, Nigeria");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 guests");
  const [notice, setNotice] = useState("");
  const [favourites, setFavourites] = useState<number[]>([]);

  function search() {
    if (!checkIn || !checkOut) {
      setNotice("Please select your check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setNotice("Check-out must be after check-in.");
      return;
    }

    window.location.href = "/apartments";
  }

  function toggleFavourite(id: number) {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <main>
      <div className="announcement">
        <b>THE STAY, REIMAGINED</b>
        <span>✦</span> Thoughtful spaces. Memorable moments.
      </div>

      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>
            stayora<span className="brand-period">.</span>
          </span>
        </a>

        <nav className={menuOpen ? "main-nav nav-open" : "main-nav"}>
          <a href="/apartments" onClick={() => setMenuOpen(false)}>
            Explore stays
          </a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>
            The Stayora experience
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            Our story
          </a>
        </nav>

        <div className="header-actions">
          <a className="host-link" href="mailto:hello@stayora.example">
            List your property
          </a>
          <a className="sign-in" href="mailto:hello@stayora.example">
            Get in touch <ArrowRight size={15} />
          </a>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero">
        <div className="hero-image" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="eyebrow light">
            <span /> A BETTER WAY TO GET AWAY
          </div>

          <h1>
            Come for the stay.
            <br />
            <em>Stay for the feeling.</em>
          </h1>

          <p>
            Beautifully considered apartments for the moments that matter.
            Find your place to feel at home, wherever you go.
          </p>

          <a href="/apartments" className="hero-cta">
            Discover your stay <ArrowRight size={17} />
          </a>
        </div>

        <div className="hero-caption">
          <span>01 / 03</span>
          <span className="caption-line" />
          <span>THE ART OF STAYING WELL</span>
        </div>
      </section>

      <section className="search-wrap">
        <div className="search-card">
          <div className="search-field destination-field">
            <label>
              <MapPin size={14} /> DESTINATION
            </label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              aria-label="Destination"
            />
          </div>

          <div className="search-divider" />

          <div className="search-field">
            <label>
              <CalendarDays size={14} /> CHECK IN
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              aria-label="Check in date"
            />
          </div>

          <div className="search-divider" />

          <div className="search-field">
            <label>
              <CalendarDays size={14} /> CHECK OUT
            </label>
            <input
              type="date"
              min={checkIn || new Date().toISOString().split("T")[0]}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              aria-label="Check out date"
            />
          </div>

          <div className="search-divider" />

          <div className="search-field guests-field">
            <label>
              <Sparkles size={14} /> GUESTS
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              aria-label="Number of guests"
            >
              <option>1 guest</option>
              <option>2 guests</option>
              <option>3 guests</option>
              <option>4 guests</option>
              <option>5+ guests</option>
            </select>
          </div>

          <button className="search-button" onClick={search}>
            <Search size={17} /> Find a stay
          </button>
        </div>

        {notice && (
          <p className="search-notice" role="status">
            {notice}
          </p>
        )}
      </section>

      <section className="intro-section" id="about">
        <div className="eyebrow">
          <span /> A LITTLE MORE THAN A PLACE TO SLEEP
        </div>

        <div className="intro-grid">
          <h2>
            Space to slow down.
            <br />
            <em>Room to feel more.</em>
          </h2>

          <p>
            At Stayora, we believe where you stay shapes how you experience a
            place. That is why every home in our collection is chosen for its
            character, comfort and the little details that make a difference.
          </p>
        </div>
      </section>

      <section className="stays-section" id="stays">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> THE STAYORA COLLECTION
            </div>
            <h2>
              Find your <em>somewhere.</em>
            </h2>
          </div>

          <a className="text-link" href="/apartments">
            View all stays <ArrowRight size={16} />
          </a>
        </div>

        <div className="stay-grid">
          {stays.map((stay) => (
            <article className="stay-card" key={stay.id}>
              <div className="stay-photo-wrap">
                <a
                  href="/apartments"
                  className="stay-photo-link"
                  aria-label={`Explore ${stay.name}`}
                >
                  <img
                    src={stay.image}
                    alt={`${stay.name} interior`}
                    className="stay-photo"
                  />
                  <span className="stay-tag">{stay.tag}</span>
                </a>

                <button
                  className="heart-button"
                  aria-label={
                    favourites.includes(stay.id)
                      ? `Remove ${stay.name} from favourites`
                      : `Save ${stay.name}`
                  }
                  aria-pressed={favourites.includes(stay.id)}
                  onClick={() => toggleFavourite(stay.id)}
                  style={{
                    color: favourites.includes(stay.id)
                      ? "#b94b4b"
                      : undefined,
                  }}
                >
                  {favourites.includes(stay.id) ? "♥" : "♡"}
                </button>
              </div>

              <a href="/apartments" className="stay-info">
                <div className="stay-title-row">
                  <h3>{stay.name}</h3>
                  <span className="rating">
                    <Star size={13} fill="currentColor" /> {stay.rating}
                  </span>
                </div>

                <p className="stay-location">
                  <MapPin size={13} /> {stay.location}
                </p>

                <p className="stay-type">{stay.type}</p>

                <div className="stay-bottom">
                  <p>
                    <strong>{stay.price}</strong> <span>/ night</span>
                  </p>
                  <span className="reviews">{stay.reviews} reviews</span>
                </div>
              </a>
            </article>
          ))}
        </div>

        <p className="demo-disclaimer">
          Demo listings and prices are illustrative and will be replaced with
          the property owner's actual inventory.
        </p>
      </section>

      <section className="experience-section" id="experience">
        <div className="experience-image">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85"
            alt="Warm, refined apartment living space"
          />
        </div>

        <div className="experience-copy">
          <div className="eyebrow light">
            <span /> THE STAYORA DIFFERENCE
          </div>

          <h2>
            Considered in every detail.
            <br />
            <em>Made for real life.</em>
          </h2>

          <p>
            From the first enquiry to the moment you settle in, we make finding
            and booking your next stay feel effortless.
          </p>

          <div className="benefit">
            <ShieldCheck size={21} />
            <div>
              <strong>Stays you can feel good about</strong>
              <span>
                Thoughtfully selected spaces with comfort at their heart.
              </span>
            </div>
          </div>

          <div className="benefit">
            <Sparkles size={21} />
            <div>
              <strong>Little details, big difference</strong>
              <span>
                Practical comforts and welcoming touches, ready when you are.
              </span>
            </div>
          </div>

          <a href="/apartments" className="experience-link">
            Explore the collection <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="closing-cta">
        <div className="eyebrow">
          <span /> YOUR NEXT CHAPTER STARTS HERE
        </div>

        <h2>
          There is a place
          <br />
          with <em>your name on it.</em>
        </h2>

        <a href="/apartments" className="dark-cta">
          Find your Stayora <ArrowRight size={16} />
        </a>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <a className="brand footer-brand" href="/">
            <span className="brand-mark">S</span>
            <span>
              stayora<span className="brand-period">.</span>
            </span>
          </a>

          <p>Exceptional stays, thoughtfully chosen.</p>

          <a href="mailto:hello@stayora.example">
            hello@stayora.example
          </a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Stayora. Demo experience.</span>
          <span>Made for better stays.</span>
        </div>
      </footer>
    </main>
  );
}
