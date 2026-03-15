import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";

const products = [
  {
    name: "Matte Lipstick",
    brand: "Lakme",
    price: 499,
    rating: 4.2,
    category: "Lips",
    image: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&w=600&q=80",
    description: "Long-lasting matte lipstick with smooth texture."
  },
  {
    name: "Liquid Foundation",
    brand: "Maybelline",
    price: 799,
    rating: 4.5,
    category: "Face",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    description: "Lightweight foundation for even skin tone."
  },
  {
    name: "Face Wash",
    brand: "Himalaya",
    price: 199,
    rating: 4.2,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
    description: "Gentle daily cleanser for fresh and soft skin."
  },
  {
    name: "Perfume",
    brand: "Skinn",
    price: 1299,
    rating: 4.7,
    category: "Fragrance",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    description: "Floral fragrance with long-lasting notes."
  },
  {
    name: "Nail Polish",
    brand: "Colorbar",
    price: 249,
    rating: 4.1,
    category: "Nails",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description: "Glossy finish nail color with quick dry formula."
  },
  {
    name: "Skin Care Kit",
    brand: "Mamaearth",
    price: 999,
    rating: 4.4,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80",
    description: "Complete daily skin care routine pack."
  },
  {
    name: "Hydrating Serum",
    brand: "Minimalist",
    price: 649,
    rating: 4.6,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80",
    description: "Hyaluronic acid serum for deep hydration and glow."
  },
  {
    name: "Vitamin C Gel",
    brand: "Plum",
    price: 599,
    rating: 4.3,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0f?auto=format&fit=crop&w=600&q=80",
    description: "Brightening gel cream with vitamin C and niacinamide."
  },
  {
    name: "Kajal Intense Black",
    brand: "Faces Canada",
    price: 299,
    rating: 4.2,
    category: "Eyes",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
    description: "Smudge-proof kajal for all-day bold definition."
  },
  {
    name: "Mascara Volume Lift",
    brand: "L'Oreal",
    price: 749,
    rating: 4.5,
    category: "Eyes",
    image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=600&q=80",
    description: "Lengthening and volumizing mascara with waterproof wear."
  },
  {
    name: "Compact Powder",
    brand: "Swiss Beauty",
    price: 349,
    rating: 4.0,
    category: "Face",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    description: "Oil-control compact for soft matte finish."
  },
  {
    name: "Highlighter Palette",
    brand: "Makeup Revolution",
    price: 899,
    rating: 4.4,
    category: "Face",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    description: "Glow palette with warm and cool shimmer shades."
  },
  {
    name: "BB Cream",
    brand: "Ponds",
    price: 299,
    rating: 4.1,
    category: "Face",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=600&q=80",
    description: "Daily BB cream with SPF and lightweight coverage."
  },
  {
    name: "Sunscreen SPF 50",
    brand: "Aqualogica",
    price: 549,
    rating: 4.6,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=600&q=80",
    description: "Broad-spectrum sunscreen with no white cast."
  },
  {
    name: "Body Mist Vanilla",
    brand: "The Body Shop",
    price: 1299,
    rating: 4.3,
    category: "Fragrance",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=80",
    description: "Sweet vanilla body mist for everyday freshness."
  },
  {
    name: "Hair Serum Argan",
    brand: "Streax",
    price: 429,
    rating: 4.4,
    category: "Hair Care",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80",
    description: "Light argan serum that controls frizz and adds shine."
  },
  {
    name: "Shampoo Anti Dandruff",
    brand: "Head & Shoulders",
    price: 389,
    rating: 4.0,
    category: "Hair Care",
    image: "https://images.unsplash.com/photo-1607603750909-408ad6195ec2?auto=format&fit=crop&w=600&q=80",
    description: "Gentle anti-dandruff shampoo for daily scalp care."
  },
  {
    name: "Conditioner Smooth Repair",
    brand: "Tresemme",
    price: 429,
    rating: 4.2,
    category: "Hair Care",
    image: "https://images.unsplash.com/photo-1626015319528-9c7e0f9a1330?auto=format&fit=crop&w=600&q=80",
    description: "Repair conditioner with keratin smooth technology."
  },
  {
    name: "Makeup Remover Balm",
    brand: "Dot & Key",
    price: 699,
    rating: 4.5,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=600&q=80",
    description: "Melting balm that removes waterproof makeup easily."
  },
  {
    name: "Lip & Cheek Tint",
    brand: "Etude",
    price: 579,
    rating: 4.2,
    category: "Lips",
    image: "https://images.unsplash.com/photo-1631214540242-56c0e5d2dcb4?auto=format&fit=crop&w=600&q=80",
    description: "Natural tint with blendable rosy color for cheeks and lips."
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products`);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
