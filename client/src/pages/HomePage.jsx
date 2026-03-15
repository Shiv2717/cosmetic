import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { sampleProducts } from "../data/sampleProducts";
import { api } from "../lib/api";
import { syncRecentlyViewedFromServer } from "../lib/shoppingPrefs";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [brand, setBrand] = useState("All");
  const [minRating, setMinRating] = useState("0");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await api.products();
        if (active) {
          setProducts(data.length ? data : sampleProducts);
        }
      } catch (_err) {
        if (active) {
          setProducts(sampleProducts);
          setError("Showing sample products. Start server for live data.");
        }
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadRecentlyViewed() {
      const items = await syncRecentlyViewedFromServer();
      if (active) {
        setRecentlyViewed(items);
      }
    }

    loadRecentlyViewed();
    return () => {
      active = false;
    };
  }, [products]);

  const categories = useMemo(() => {
    const all = products.map((product) => product.category || "General");
    return ["All", ...new Set(all)];
  }, [products]);

  const brands = useMemo(() => {
    const all = products.map((product) => product.brand || "Unknown");
    return ["All", ...new Set(all)];
  }, [products]);

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return [];
    }

    return products
      .filter((product) => {
        const name = (product.name || "").toLowerCase();
        const brandName = (product.brand || "").toLowerCase();
        const categoryName = (product.category || "").toLowerCase();
        return name.includes(value) || brandName.includes(value) || categoryName.includes(value);
      })
      .slice(0, 6);
  }, [products, query]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const productCategory = product.category || "General";
      const matchesCategory = category === "All" || productCategory === category;
      const matchesBrand = brand === "All" || (product.brand || "") === brand;
      const matchesSearch = [product.name, product.brand, product.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const ratingValue = Number(product.rating || 0);
      const matchesRating = ratingValue >= Number(minRating || 0);
      const priceValue = Number(product.price || 0);
      const matchesMinPrice = minPrice === "" || priceValue >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || priceValue <= Number(maxPrice);

      return (
        matchesCategory &&
        matchesBrand &&
        matchesSearch &&
        matchesRating &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    const sorted = [...filtered];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popularity") {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return sorted;
  }, [products, category, brand, query, minRating, minPrice, maxPrice, sortBy]);

  const bestRated = useMemo(
    () => [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 4),
    [products]
  );

  const budgetPicks = useMemo(
    () => [...products].sort((a, b) => a.price - b.price).slice(0, 4),
    [products]
  );

  const spotlightItems = useMemo(() => products.slice(0, 6), [products]);
  const trendingItems = useMemo(() => [...products].slice(0, 3), [products]);

  function onImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  function applySuggestion(product) {
    setQuery(product.name);
    setShowSuggestions(false);
  }

  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-content">
          <p className="hero-kicker">GlowBeauty Store</p>
          <h1>Refresh Your Routine With A Smarter Beauty Home</h1>
          <p className="hero-subtitle">
            Shop skincare, makeup, and fragrance with discovery tools inspired by top ecommerce
            experiences and polished in a clean Material-inspired interface.
          </p>
          <div className="hero-actions">
            <a href="#catalog" className="btn">Start Shopping</a>
            <a href="#top-picks" className="btn btn-light">See Top Picks</a>
          </div>
          <div className="hero-badges">
            <span>4.8 Average Rating</span>
            <span>Secure Payments</span>
            <span>Easy Returns</span>
          </div>
        </div>
        <div className="hero-stat-grid">
          <div className="hero-stat">
            <strong>{products.length}</strong>
            <span>Products</span>
          </div>
          <div className="hero-stat">
            <strong>{categories.length - 1}</strong>
            <span>Categories</span>
          </div>
          <div className="hero-stat">
            <strong>24h</strong>
            <span>Fast shipping</span>
          </div>
        </div>
      </div>

      <section className="benefits">
        <article>
          <h3>Authentic Brands</h3>
          <p>Every product is sourced from verified sellers and trusted distributors.</p>
        </article>
        <article>
          <h3>Smart Discovery</h3>
          <p>Use dynamic category chips, search, and sorting to find products quickly.</p>
        </article>
        <article>
          <h3>Secure Checkout</h3>
          <p>Pay via cards, UPI, COD, and popular payment gateways with confidence.</p>
        </article>
      </section>

      <section className="trending-strip">
        {trendingItems.map((item) => (
          <article key={`trend-${item._id || item.id}`} className="trending-item">
            <img
              src={item.image || FALLBACK_IMAGE}
              alt={item.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={onImageError}
            />
            <div>
              <p className="muted-text">Trending Now</p>
              <h3>{item.name}</h3>
              <p className="notice">Rs {item.price}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="catalog" className="catalog-shell">
        <div className="results-head">
          <h2>Explore Catalog</h2>
          <p>{filteredProducts.length} items found</p>
        </div>

        <section className="catalog-controls">
          <div className="search-wrap">
            <input
              type="search"
              placeholder="Search products, brands, categories"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                window.setTimeout(() => setShowSuggestions(false), 120);
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete-list">
                {suggestions.map((item) => (
                  <button
                    key={`suggest-${item._id || item.id}`}
                    type="button"
                    className="autocomplete-item"
                    onClick={() => applySuggestion(item)}
                  >
                    <span>{item.name}</span>
                    <small>{item.brand}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popularity">Sort: Popularity</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((item) => (
              <option key={`brand-${item}`} value={item}>{item === "All" ? "All Brands" : item}</option>
            ))}
          </select>

          <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="0">Any Rating</option>
            <option value="4">4★ & up</option>
            <option value="3">3★ & up</option>
            <option value="2">2★ & up</option>
          </select>

          <input
            type="number"
            min="0"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </section>

        <div className="chip-row">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${item === category ? "chip-active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {error && <p className="notice">{error}</p>}
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="top-picks" className="section-block">
        <div className="results-head">
          <h2>Top Rated Picks</h2>
          <p>Chosen from highest customer ratings</p>
        </div>
        <div className="grid">
          {bestRated.map((product) => (
            <ProductCard key={`top-${product._id || product.id}`} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="results-head">
          <h2>Budget Beauty Finds</h2>
          <p>Quality products under friendly prices</p>
        </div>
        <div className="grid">
          {budgetPicks.map((product) => (
            <ProductCard key={`budget-${product._id || product.id}`} product={product} />
          ))}
        </div>
      </section>

      <section className="spotlight-strip">
        {spotlightItems.map((product) => (
          <article key={`spot-${product._id || product.id}`} className="spot-item">
            <img
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={onImageError}
            />
            <div>
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
              <strong>Rs {product.price}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="results-head">
          <h2>Recently Viewed</h2>
          <p>Your last seen products</p>
        </div>
        {recentlyViewed.length ? (
          <div className="recently-track">
            {recentlyViewed.map((item) => (
              <Link
                key={`recent-${item._id || item.id}`}
                to={`/product/${item._id || item.id}`}
                className="recently-mini-card"
              >
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={onImageError}
                />
                <h4>{item.name}</h4>
                <p>{item.brand}</p>
                <strong>Rs {item.price}</strong>
              </Link>
            ))}
          </div>
        ) : (
          <p className="notice">No recently viewed products yet.</p>
        )}
      </section>

      <section className="testimonial-strip">
        <article>
          <p>"Fast delivery and authentic products. My go-to beauty store now."</p>
          <span>- Priya, Bengaluru</span>
        </article>
        <article>
          <p>"Checkout is smooth and product quality is consistently excellent."</p>
          <span>- Meera, Chennai</span>
        </article>
      </section>
    </section>
  );
}
