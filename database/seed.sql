-- Sample seed data for testing the e-commerce platform
-- WARNING: For development/testing only! Do NOT use in production!

-- Insert sample admin user (password: password123)
-- Hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '1234567890', 'admin');

-- Insert Namecheap admin user (password: password123)
-- Hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@namecheap.to', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Namecheap', 'Admin', '1234567890', 'admin');

-- Insert sample customer user (password: password123)  
-- Hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '9876543210', 'customer');

-- Insert sample products with high-quality images
INSERT INTO products (name, description, price, category, sub_category, stock_quantity, image_url) VALUES
-- Health & Wellness Products
('Natural Honey', 'Pure organic honey from local farms. Rich in antioxidants and natural enzymes. Perfect for sweetening tea or as a natural energy boost.', 29.99, 'Health & Wellness', 'Natural Products', 100, 'https://images.unsplash.com/photo-1587049352846-4a222e784226?w=400'),
('Herbal Tea Collection', 'Premium herbal tea blend for wellness. Includes chamomile, peppermint, and green tea. Caffeine-free relaxation in every cup.', 19.99, 'Beverages', 'Tea', 150, 'https://images.unsplash.com/photo-1597318181274-9f7f2c1b3a24?w=400'),
('Wellness Supplement Pack', 'Complete vitamin and mineral supplement. Includes Vitamin D, B12, and Omega-3. Daily health support in convenient capsules.', 49.99, 'Health & Wellness', 'Supplements', 80, 'https://images.unsplash.com/photo-1526494631344-8c2c09ea0ce6?w=400'),
('Green Tea Extract', 'Pure green tea extract capsules. 500mg per serving. Supports metabolism and provides natural antioxidants.', 34.99, 'Health & Wellness', 'Supplements', 90, 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400'),
('Essential Oil Set', 'Collection of therapeutic essential oils. Includes lavender, eucalyptus, and tea tree. Perfect for aromatherapy and relaxation.', 59.99, 'Health & Wellness', 'Aromatherapy', 60, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
('Organic Turmeric Capsules', 'High-potency turmeric with black pepper extract. Anti-inflammatory support. 1000mg per serving.', 39.99, 'Health & Wellness', 'Supplements', 120, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'),
('Protein Powder - Vanilla', 'Plant-based protein powder. 25g protein per serving. Made from organic peas and brown rice. Delicious vanilla flavor.', 44.99, 'Health & Wellness', 'Supplements', 85, 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400'),
('Vitamin C Serum', 'Powerful antioxidant serum with 20% Vitamin C. Brightens skin and reduces fine lines. Dermatologist recommended.', 32.99, 'Health & Wellness', 'Supplements', 95, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'),

-- Beauty & Skincare Products
('Organic Face Cream', 'Natural face cream with essential oils. Hydrates and nourishes all skin types. Non-greasy, fast-absorbing formula.', 39.99, 'Beauty', 'Skin Care', 75, 'https://images.unsplash.com/photo-1556228578-dd3a07c7b8a8?w=400'),
('Hair Oil Treatment', 'Nourishing hair oil with natural ingredients. Repairs damaged hair and adds shine. Enriched with argan and coconut oil.', 24.99, 'Beauty', 'Hair Care', 120, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400'),
('Natural Soap Set', 'Handmade soap with organic ingredients. 6-piece collection with lavender, oatmeal, and charcoal varieties.', 15.99, 'Beauty', 'Bath & Body', 200, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'),
('Moisturizing Lotion', 'Natural body lotion for all skin types. Infused with shea butter and vitamin E. Deeply hydrating, non-sticky formula.', 27.99, 'Beauty', 'Skin Care', 110, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400'),
('Charcoal Face Mask', 'Detoxifying charcoal face mask. Removes impurities and unclogs pores. Suitable for all skin types, especially oily skin.', 22.99, 'Beauty', 'Skin Care', 140, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'),
('Rosehip Facial Oil', 'Pure organic rosehip oil. Rich in vitamins A and C. Anti-aging properties, reduces scars and fine lines.', 36.99, 'Beauty', 'Skin Care', 88, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'),
('Shampoo & Conditioner Set', 'Sulfate-free shampoo and conditioner. Infused with argan oil and keratin. For healthy, shiny, manageable hair.', 45.99, 'Beauty', 'Hair Care', 100, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400'),
('Luxury Bath Bomb Set', '12-piece handmade bath bomb collection. Natural ingredients with essential oils. Transform your bath into a spa experience.', 28.99, 'Beauty', 'Bath & Body', 150, 'https://images.unsplash.com/photo-1608181671725-cdf91082e2d4?w=400'),
('Organic Lip Balm Set', 'Natural lip balm trio. Beeswax and coconut oil formula. Flavors: vanilla, mint, and berry. Long-lasting hydration.', 12.99, 'Beauty', 'Skin Care', 180, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'),

-- Additional Wellness Products
('Collagen Powder', 'Hydrolyzed collagen peptides. Supports skin, hair, and joint health. Unflavored, mixes easily in drinks.', 54.99, 'Health & Wellness', 'Supplements', 70, 'https://images.unsplash.com/photo-1591506789555-735f5c5d6d29?w=400'),
('Probiotic Complex', 'Advanced probiotic formula with 10 billion CFU. Supports digestive health and immune system. 30-day supply.', 42.99, 'Health & Wellness', 'Supplements', 95, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
('Organic Matcha Powder', 'Premium ceremonial grade matcha. Rich in antioxidants. Perfect for lattes, smoothies, and baking.', 38.99, 'Beverages', 'Tea', 110, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400'),
('Lavender Pillow Spray', 'Natural sleep aid with pure lavender essential oil. Promotes relaxation and better sleep. 100ml bottle.', 18.99, 'Health & Wellness', 'Aromatherapy', 130, 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400'),
('Magnesium Supplement', 'Highly absorbable magnesium glycinate. Supports muscle function, sleep, and relaxation. 400mg per capsule.', 29.99, 'Health & Wellness', 'Supplements', 115, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
('Detox Tea Blend', 'Organic detox tea with dandelion, ginger, and lemon. Supports natural cleansing. Refreshing and energizing.', 24.99, 'Beverages', 'Tea', 125, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'),

-- Additional Beauty Products
('Retinol Night Cream', 'Anti-aging night cream with retinol and hyaluronic acid. Reduces wrinkles and improves skin texture.', 52.99, 'Beauty', 'Skin Care', 65, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400'),
('Natural Deodorant', 'Aluminum-free natural deodorant. Long-lasting freshness with coconut oil and baking soda. Fresh citrus scent.', 14.99, 'Beauty', 'Bath & Body', 160, 'https://images.unsplash.com/photo-1622542796254-5b9c46ab0d2f?w=400'),
('Eye Serum', 'Intensive eye serum with caffeine and peptides. Reduces dark circles and puffiness. Brightens under-eye area.', 34.99, 'Beauty', 'Skin Care', 92, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'),
('Hair Growth Serum', 'Advanced hair growth serum with biotin and castor oil. Promotes thicker, healthier hair. Clinically tested.', 48.99, 'Beauty', 'Hair Care', 78, 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400'),
('Jade Roller & Gua Sha Set', 'Natural jade facial tools. Reduces puffiness and promotes lymphatic drainage. Includes storage pouch.', 26.99, 'Beauty', 'Skin Care', 105, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400');

-- Insert sample discount codes
INSERT INTO discounts (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_from, valid_until) VALUES
('WELCOME10', 'Welcome discount - 10% off', 'percentage', 10, 0, 50, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('SAVE20', 'Save $20 on orders over $100', 'fixed', 20, 100, NULL, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('SUMMER25', 'Summer sale - 25% off', 'percentage', 25, 50, 100, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days');

-- Insert a cart for the customer user (user_id = 2)
INSERT INTO carts (user_id) VALUES (2);

-- NOTE: These are development/testing credentials only!
-- Both accounts use password: 'password123'
-- In production, always use strong, unique passwords and never commit credentials!
