import { getUncachableStripeClient } from './stripeClient';

const CIGAR_PRODUCTS = [
  {
    name: 'Dominican Reserve Robusto',
    description: 'Full-bodied blend with notes of cedar, leather, and a hint of cocoa. Hand-rolled in the Dominican Republic.',
    metadata: { 
      strength: 'full',
      origin: 'Dominican Republic',
      wrapper: 'Habano',
      size: 'Robusto 5x50',
      featured: 'true'
    },
    images: ['https://images.unsplash.com/photo-1574027057065-cfff0e4e4d82?w=600'],
    price: 1895,
  },
  {
    name: 'Island Sunrise Toro',
    description: 'Medium-bodied with smooth vanilla, citrus, and toasted almond flavors. Perfect morning cigar.',
    metadata: {
      strength: 'medium',
      origin: 'Nicaragua',
      wrapper: 'Connecticut',
      size: 'Toro 6x52',
      featured: 'true'
    },
    images: ['https://images.unsplash.com/photo-1535683577427-75e8c571441f?w=600'],
    price: 1495,
  },
  {
    name: 'Midnight Maduro Churchill',
    description: 'Rich, dark Maduro wrapper with espresso, dark chocolate, and dried fruit notes.',
    metadata: {
      strength: 'medium-full',
      origin: 'Honduras',
      wrapper: 'Maduro',
      size: 'Churchill 7x48',
      featured: 'true'
    },
    images: ['https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600'],
    price: 2295,
  },
  {
    name: 'Tropicana Mild Corona',
    description: 'Light and creamy with gentle grass and honey notes. Excellent for newcomers.',
    metadata: {
      strength: 'mild',
      origin: 'Ecuador',
      wrapper: 'Connecticut Shade',
      size: 'Corona 5.5x44',
      featured: 'false'
    },
    images: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600'],
    price: 1195,
  },
  {
    name: 'Golden Lancero Limited Edition',
    description: 'Exclusive small-batch release with complex pepper, caramel, and aged tobacco flavors.',
    metadata: {
      strength: 'full',
      origin: 'Nicaragua',
      wrapper: 'Corojo',
      size: 'Lancero 7x38',
      featured: 'true'
    },
    images: ['https://images.unsplash.com/photo-1574027057065-cfff0e4e4d82?w=600'],
    price: 3495,
  },
  {
    name: 'Casa Verde Belicoso',
    description: 'Medium-full blend with earthy tones, black pepper, and sweet tobacco.',
    metadata: {
      strength: 'medium-full',
      origin: 'Dominican Republic',
      wrapper: 'Sumatra',
      size: 'Belicoso 6x52',
      featured: 'false'
    },
    images: ['https://images.unsplash.com/photo-1535683577427-75e8c571441f?w=600'],
    price: 1795,
  }
];

async function seedProducts() {
  console.log('Seeding cigar products to Stripe...');
  
  const stripe = await getUncachableStripeClient();
  
  for (const cigar of CIGAR_PRODUCTS) {
    try {
      const existingProducts = await stripe.products.search({
        query: `name:'${cigar.name}'`
      });
      
      if (existingProducts.data.length > 0) {
        console.log(`Product "${cigar.name}" already exists, skipping...`);
        continue;
      }
      
      const product = await stripe.products.create({
        name: cigar.name,
        description: cigar.description,
        images: cigar.images,
        metadata: cigar.metadata,
      });
      
      await stripe.prices.create({
        product: product.id,
        unit_amount: cigar.price,
        currency: 'usd',
      });
      
      console.log(`Created: ${cigar.name} - $${(cigar.price / 100).toFixed(2)}`);
    } catch (error: any) {
      console.error(`Error creating ${cigar.name}:`, error.message);
    }
  }
  
  console.log('Product seeding complete!');
}

seedProducts().catch(console.error);
