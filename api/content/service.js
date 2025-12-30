const db = require('../../database/db');

class ContentService {
  /**
   * Get homepage content including featured products, categories, and stats
   */
  async getHomepageContent() {
    try {
      // Get featured products (top selling or recently added)
      const featuredProductsResult = await db.query(`
        SELECT p.*, 
          COALESCE((
            SELECT SUM(oi.quantity) 
            FROM order_items oi 
            WHERE oi.product_id = p.id
          ), 0) as total_sales
        FROM products p
        WHERE p.is_active = true
        ORDER BY total_sales DESC, p.created_at DESC
        LIMIT 8
      `);

      // Get product categories with counts
      const categoriesResult = await db.query(`
        SELECT 
          category,
          COUNT(*) as product_count,
          MIN(price) as min_price,
          MAX(price) as max_price,
          ARRAY_AGG(DISTINCT sub_category) FILTER (WHERE sub_category IS NOT NULL) as subcategories
        FROM products
        WHERE is_active = true
        GROUP BY category
        ORDER BY product_count DESC
      `);

      // Get platform statistics
      const statsResult = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
          (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
          (SELECT COUNT(*) FROM orders WHERE status = 'delivered') as total_orders,
          (SELECT COUNT(DISTINCT category) FROM products WHERE is_active = true) as total_categories
      `);

      // Get newest products
      const newProductsResult = await db.query(`
        SELECT *
        FROM products
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT 6
      `);

      // Get best selling products
      const bestSellersResult = await db.query(`
        SELECT p.*,
          COALESCE(SUM(oi.quantity), 0) as total_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        WHERE p.is_active = true
        GROUP BY p.id
        ORDER BY total_sold DESC
        LIMIT 6
      `);

      return {
        featuredProducts: featuredProductsResult.rows,
        categories: categoriesResult.rows,
        stats: statsResult.rows[0] || {
          total_products: 0,
          total_customers: 0,
          total_orders: 0,
          total_categories: 0
        },
        newProducts: newProductsResult.rows,
        bestSellers: bestSellersResult.rows,
        hero: {
          title: "Welcome to Namecheap Marketplace",
          subtitle: "Discover Premium Quality Products at Unbeatable Prices",
          description: "Your trusted e-commerce destination for health, wellness, and beauty products",
          cta: {
            primary: {
              text: "Shop Now",
              link: "/products"
            },
            secondary: {
              text: "Learn More",
              link: "/about"
            }
          }
        }
      };
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      throw error;
    }
  }

  /**
   * Get about page content
   */
  async getAboutContent() {
    return {
      title: "About Namecheap Marketplace",
      mission: "Our mission is to provide high-quality, affordable products that enhance your health, wellness, and beauty routine.",
      vision: "To become the most trusted e-commerce platform for natural and organic products worldwide.",
      values: [
        {
          title: "Quality First",
          description: "We source only the finest products from trusted suppliers",
          icon: "quality"
        },
        {
          title: "Customer Satisfaction",
          description: "Your happiness is our top priority",
          icon: "satisfaction"
        },
        {
          title: "Transparency",
          description: "Clear pricing, honest reviews, and authentic products",
          icon: "transparency"
        },
        {
          title: "Sustainability",
          description: "Eco-friendly products and packaging",
          icon: "sustainability"
        }
      ],
      story: "Founded with a passion for natural wellness, Namecheap Marketplace brings together the best health, wellness, and beauty products from around the world. Our carefully curated selection ensures that every product meets our high standards for quality and effectiveness.",
      team: {
        size: "50+ dedicated professionals",
        description: "Our team of experts is committed to bringing you the best shopping experience"
      }
    };
  }

  /**
   * Get features/benefits for marketing pages
   */
  async getFeaturesContent() {
    return {
      title: "Why Choose Namecheap Marketplace?",
      subtitle: "Experience the difference with our premium features",
      features: [
        {
          title: "Free Shipping",
          description: "Free shipping on orders over $50",
          icon: "shipping",
          highlight: true
        },
        {
          title: "Secure Payments",
          description: "100% secure payment processing with multiple payment options",
          icon: "security",
          highlight: false
        },
        {
          title: "Easy Returns",
          description: "30-day hassle-free return policy",
          icon: "returns",
          highlight: true
        },
        {
          title: "24/7 Support",
          description: "Our customer service team is always here to help",
          icon: "support",
          highlight: false
        },
        {
          title: "Quality Guarantee",
          description: "All products are verified for authenticity and quality",
          icon: "quality",
          highlight: true
        },
        {
          title: "Fast Delivery",
          description: "Quick processing and delivery to your doorstep",
          icon: "fast-delivery",
          highlight: false
        }
      ]
    };
  }

  /**
   * Get testimonials/reviews
   */
  async getTestimonials() {
    return {
      title: "What Our Customers Say",
      testimonials: [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Verified Customer",
          rating: 5,
          comment: "Amazing products and excellent customer service! I've been shopping here for months and never disappointed.",
          date: "2024-01-15",
          avatar: "https://i.pravatar.cc/150?img=1"
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Verified Customer",
          rating: 5,
          comment: "The quality of products is outstanding. Fast shipping and great prices too!",
          date: "2024-01-10",
          avatar: "https://i.pravatar.cc/150?img=2"
        },
        {
          id: 3,
          name: "Emma Williams",
          role: "Verified Customer",
          rating: 4,
          comment: "Great selection of natural products. The website is easy to navigate and checkout is smooth.",
          date: "2024-01-05",
          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 4,
          name: "David Martinez",
          role: "Verified Customer",
          rating: 5,
          comment: "Best online shopping experience! Love the variety and the customer support is top-notch.",
          date: "2023-12-28",
          avatar: "https://i.pravatar.cc/150?img=4"
        }
      ]
    };
  }

  /**
   * Get FAQ content
   */
  async getFAQContent() {
    return {
      title: "Frequently Asked Questions",
      categories: [
        {
          category: "Orders & Shipping",
          questions: [
            {
              question: "How long does shipping take?",
              answer: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days delivery."
            },
            {
              question: "Do you ship internationally?",
              answer: "Currently, we ship within the United States. International shipping is coming soon!"
            },
            {
              question: "How can I track my order?",
              answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard."
            }
          ]
        },
        {
          category: "Returns & Refunds",
          questions: [
            {
              question: "What is your return policy?",
              answer: "We offer a 30-day return policy on most items. Products must be unused and in original packaging."
            },
            {
              question: "How do I return an item?",
              answer: "Contact our support team to initiate a return. We'll provide you with a return label and instructions."
            },
            {
              question: "When will I receive my refund?",
              answer: "Refunds are processed within 5-7 business days after we receive your return."
            }
          ]
        },
        {
          category: "Products",
          questions: [
            {
              question: "Are your products organic?",
              answer: "Many of our products are organic and natural. Each product page clearly indicates if it's organic, natural, or conventional."
            },
            {
              question: "Do you test on animals?",
              answer: "No, we do not sell any products that have been tested on animals. We're committed to cruelty-free products."
            }
          ]
        },
        {
          category: "Account & Payment",
          questions: [
            {
              question: "Do I need an account to place an order?",
              answer: "While you can checkout as a guest, creating an account allows you to track orders, save favorites, and enjoy faster checkout."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, debit cards, and PayPal."
            },
            {
              question: "Is my payment information secure?",
              answer: "Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details."
            }
          ]
        }
      ]
    };
  }

  /**
   * Get promotional banners
   */
  async getPromotionalBanners() {
    const activeBannersResult = await db.query(`
      SELECT code, description, discount_type, discount_value, valid_until
      FROM discounts
      WHERE is_active = true
      AND valid_from <= CURRENT_TIMESTAMP
      AND valid_until >= CURRENT_TIMESTAMP
      ORDER BY discount_value DESC
      LIMIT 3
    `);

    const banners = activeBannersResult.rows.map(discount => ({
      title: discount.description,
      code: discount.code,
      discountType: discount.discount_type,
      discountValue: discount.discount_value,
      validUntil: discount.valid_until,
      cta: "Shop Now"
    }));

    // Add default promotional banners if no active discounts
    if (banners.length === 0) {
      banners.push(
        {
          title: "New Customer Special",
          subtitle: "Get 10% off your first order",
          code: "WELCOME10",
          cta: "Start Shopping"
        },
        {
          title: "Free Shipping",
          subtitle: "On orders over $50",
          cta: "Shop Now"
        }
      );
    }

    return banners;
  }
}

module.exports = new ContentService();
