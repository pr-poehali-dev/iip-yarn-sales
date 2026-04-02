
CREATE TABLE t_p99927583_iip_yarn_sales.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  fiber VARCHAR(200) NOT NULL,
  weight VARCHAR(100) NOT NULL,
  price_num INTEGER NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#F03E6E',
  tag VARCHAR(50) DEFAULT '',
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p99927583_iip_yarn_sales.orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200) DEFAULT '',
  city VARCHAR(200) DEFAULT '',
  address VARCHAR(500) DEFAULT '',
  delivery VARCHAR(50) NOT NULL DEFAULT 'cdek',
  payment VARCHAR(50) NOT NULL DEFAULT 'card',
  comment TEXT DEFAULT '',
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p99927583_iip_yarn_sales.products (name, fiber, weight, price_num, color, tag) VALUES
  ('Хлопок PURE',   'Хлопок 100%',           '100г / 200м', 590,  '#F03E6E', 'Хит'),
  ('Меринос SOFT',  'Меринос 100%',           '100г / 180м', 890,  '#2ECC8F', 'Новинка'),
  ('Лён NATURAL',   'Лён 100%',               '100г / 250м', 720,  '#FFD234', ''),
  ('Альпака CLOUD', 'Альпака 80%, Шёлк 20%',  '50г / 150м',  1290, '#7C3AED', 'Premium'),
  ('Бамбук BREEZE', 'Бамбук 100%',            '100г / 220м', 650,  '#FF6B35', ''),
  ('Кашемир LUXE',  'Кашемир 100%',           '50г / 120м',  2100, '#E91E8C', 'Лимит');
