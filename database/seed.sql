-- Sample seed data for testing the e-commerce platform
-- WARNING: For development/testing only! Do NOT use in production!

-- Insert sample admin user (password: password123)
-- Hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '1234567890', 'admin');

-- Insert sample customer user (password: password123)  
-- Hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '9876543210', 'customer');

-- Insert sample products
INSERT INTO products (name, description, price, category, sub_category, stock_quantity, image_url) VALUES
('Natural Honey', 'Pure organic honey from local farms', 29.99, 'Health & Wellness', 'Natural Products', 100, 'https://via.placeholder.com/300'),
('Herbal Tea Collection', 'Premium herbal tea blend for wellness', 19.99, 'Beverages', 'Tea', 150, 'https://via.placeholder.com/300'),
('Organic Face Cream', 'Natural face cream with essential oils', 39.99, 'Beauty', 'Skin Care', 75, 'https://via.placeholder.com/300'),
('Hair Oil Treatment', 'Nourishing hair oil with natural ingredients', 24.99, 'Beauty', 'Hair Care', 120, 'https://via.placeholder.com/300'),
('Wellness Supplement Pack', 'Complete vitamin and mineral supplement', 49.99, 'Health & Wellness', 'Supplements', 80, 'https://via.placeholder.com/300'),
('Natural Soap Set', 'Handmade soap with organic ingredients', 15.99, 'Beauty', 'Bath & Body', 200, 'https://via.placeholder.com/300'),
('Green Tea Extract', 'Pure green tea extract capsules', 34.99, 'Health & Wellness', 'Supplements', 90, 'https://via.placeholder.com/300'),
('Moisturizing Lotion', 'Natural body lotion for all skin types', 27.99, 'Beauty', 'Skin Care', 110, 'https://via.placeholder.com/300'),
('Essential Oil Set', 'Collection of therapeutic essential oils', 59.99, 'Health & Wellness', 'Aromatherapy', 60, 'https://via.placeholder.com/300'),
('Charcoal Face Mask', 'Detoxifying charcoal face mask', 22.99, 'Beauty', 'Skin Care', 140, 'https://via.placeholder.com/300');

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
