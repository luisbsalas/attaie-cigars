import type { Express } from "express";
import type { Server } from "http";
import path from "path";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get('/download-project', (req, res) => {
    const filePath = path.resolve(process.cwd(), 'attaie-cigars-project.tar.gz');
    res.download(filePath, 'attaie-cigars-project.tar.gz');
  });
  
  app.get(api.products.list.path, async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const featured = req.query.featured === 'true';
    const products = await storage.getProducts(category, featured);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length > 0) return;

  const attaieProducts = [
    {
      name: "Attaie Reserve Toro",
      description: "A masterful blend offering notes of dark chocolate, earth, and a hint of spice. The perfect evening companion for moments of reflection and celebration.",
      price: "28.00",
      imageUrl: "https://images.unsplash.com/photo-1596637508086-4c40590a5996?auto=format&fit=crop&q=80&w=800",
      category: "Cigars",
      origin: "Dominican Republic",
      strength: "Medium-Full",
      format: "Toro",
      featured: true
    },
    {
      name: "Attaie Reserve Robusto",
      description: "Creamy and smooth with a nutty finish. Aged for 5 years in cedar vaults for unparalleled richness and depth.",
      price: "24.00",
      imageUrl: "https://images.unsplash.com/photo-1627807452654-72944b58e7f1?auto=format&fit=crop&q=80&w=800",
      category: "Cigars",
      origin: "Nicaragua",
      strength: "Medium",
      format: "Robusto",
      featured: true
    },
    {
      name: "Attaie Reserve Black",
      description: "Our boldest offering. Rich, sweet, and complex with a dark oily wrapper delivering intense flavor for the true aficionado.",
      price: "32.00",
      imageUrl: "https://images.unsplash.com/photo-1550953613-2cb979b0091c?auto=format&fit=crop&q=80&w=800",
      category: "Cigars",
      origin: "Nicaragua",
      strength: "Full",
      format: "Gordo",
      featured: true
    },
    {
      name: "Attaie Reserve Platinum",
      description: "Mild and elegant. Notes of cedar, cream, and vanilla create a refined experience perfect for any occasion.",
      price: "26.00",
      imageUrl: "https://images.unsplash.com/photo-1521193077363-228795906b3a?auto=format&fit=crop&q=80&w=800",
      category: "Cigars",
      origin: "Honduras",
      strength: "Mild",
      format: "Churchill",
      featured: false
    },
    {
      name: "Attaie Reserve Private",
      description: "Our most exclusive blend. A perfectly balanced medium-bodied cigar with notes of leather, coffee, and subtle sweetness.",
      price: "38.00",
      imageUrl: "https://images.unsplash.com/photo-1596637508086-4c40590a5996?auto=format&fit=crop&q=80&w=800",
      category: "Cigars",
      origin: "Dominican Republic",
      strength: "Medium",
      format: "Torpedo",
      featured: false
    },
    {
      name: "Attaie Reserve Corona",
      description: "The classic format. Perfect for a quick but satisfying smoke with rich tobacco flavors and a smooth finish.",
      price: "18.00",
      imageUrl: "https://images.unsplash.com/photo-1627807452654-72944b58e7f1?auto=format&fit=crop&q=80&w=800",
      category: "Cigars",
      origin: "Nicaragua",
      strength: "Medium",
      format: "Corona",
      featured: false
    }
  ];

  for (const p of attaieProducts) {
    await storage.createProduct(p);
  }
}
