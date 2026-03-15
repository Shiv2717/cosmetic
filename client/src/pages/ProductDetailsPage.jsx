import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sampleProducts } from "../data/sampleProducts";
import { api } from "../lib/api";
import { isLoggedIn } from "../lib/auth";
import { pushRecentlyViewed } from "../lib/shoppingPrefs";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80";
const REVIEWS_KEY = "glowbeauty_reviews";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const data = await api.productById(id);
        if (active) {
          setProduct(data);
          await pushRecentlyViewed(data);
        }
      } catch (_err) {
        const fallback = sampleProducts.find((item) => item.id === id);
        if (active) {
          setProduct(fallback || null);
          if (fallback) {
            await pushRecentlyViewed(fallback);
          }
        }
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      setReviews(parsed[id] || []);
    } catch (_error) {
      setReviews([]);
    }
  }, [id]);

  async function onAddToCart() {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      await api.addToCart({ productId: product._id || product.id, quantity: qty });
      setMessage("Added to cart");
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  function onImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  function onSubmitReview(event) {
    event.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      setMessage("Please fill your name and review comment.");
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: reviewForm.name.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      createdAt: new Date().toISOString()
    };

    const nextReviews = [newReview, ...reviews].slice(0, 20);
    setReviews(nextReviews);

    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[id] = nextReviews;
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(parsed));
    } catch (_error) {
      setMessage("Could not save review. Try again.");
      return;
    }

    setReviewForm({ name: "", rating: 5, comment: "" });
    setMessage("Thanks! Your review was added.");
  }

  return (
    <section className="page">
      <img
        src={product.image || FALLBACK_IMAGE}
        alt={product.name}
        width="260"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={onImageError}
      />
      <h2>{product.name}</h2>
      <p>Brand: {product.brand}</p>
      <p>{product.description}</p>
      <p>Price: Rs {product.price}</p>
      <p>Rating: {product.rating}</p>
      <label htmlFor="qty">Quantity: </label>
      <input
        id="qty"
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />
      <div style={{ marginTop: "0.8rem" }}>
        <button className="btn" type="button" onClick={onAddToCart}>Add to Cart</button>
      </div>

      <section className="review-section">
        <h3>Customer Reviews</h3>
        {reviews.length ? (
          <div className="review-list">
            {reviews.map((review) => (
              <article key={review.id} className="review-item">
                <div className="review-head">
                  <strong>{review.name}</strong>
                  <span>{review.rating}/5</span>
                </div>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </article>
            ))}
          </div>
        ) : (
          <p className="notice">No reviews yet. Be the first to review this product.</p>
        )}

        <form className="review-form" onSubmit={onSubmitReview}>
          <h4>Add Your Review</h4>
          <input
            type="text"
            placeholder="Your Name"
            value={reviewForm.name}
            onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
          <textarea
            rows="3"
            placeholder="Share your experience"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
            required
          />
          <button className="btn" type="submit">Submit Review</button>
        </form>
      </section>
      {message && <p>{message}</p>}
    </section>
  );
}
