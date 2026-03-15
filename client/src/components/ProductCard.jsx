import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isWishlisted, toggleWishlist } from "../lib/shoppingPrefs";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;
  const rating = Number(product.rating || 0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSaved() {
      const result = await isWishlisted(productId);
      if (active) {
        setSaved(result);
      }
    }
    loadSaved();
    return () => {
      active = false;
    };
  }, [productId]);

  function onImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  async function onToggleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();
    const { added } = await toggleWishlist(product);
    setSaved(added);
  }

  return (
    <article className="card product-card">
      <div className="product-image-wrap">
        <button
          type="button"
          className={`product-card__wishlist ${saved ? "active" : ""}`}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onToggleWishlist}
        >
          {saved ? "♥" : "♡"}
        </button>
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={onImageError}
        />
        <span className="product-category">{product.category || "General"}</span>
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted-text">{product.brand}</p>
        <p className="rating">{rating ? rating.toFixed(1) : product.rating} / 5</p>
        <div className="card-foot">
          <p className="price">Rs {product.price}</p>
          <Link to={`/product/${productId}`}>
            <button className="btn" type="button">View Product</button>
          </Link>
        </div>
        <p className="shipping">Free delivery on orders over Rs 999</p>
        <Link to={`/product/${productId}`}>
          <button className="btn btn-light" type="button">Quick View</button>
        </Link>
      </div>
    </article>
  );
}
