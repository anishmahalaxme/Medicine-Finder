-- Online Medical Store Finder (MVP) - MySQL 8+
-- Normalized to 3NF with a junction table (stock) for store<->medicine.

CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS medical_store (
  store_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_name VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  address VARCHAR(255) NOT NULL,
  opening_hours VARCHAR(100) NOT NULL DEFAULT '8:00 AM - 10:00 PM',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (store_id),
  KEY idx_store_lat_lng (latitude, longitude),
  KEY idx_store_name (store_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS medicine (
  medicine_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  medicine_name VARCHAR(190) NOT NULL,
  category VARCHAR(120) NOT NULL,
  manufacturer VARCHAR(190) NOT NULL,
  PRIMARY KEY (medicine_id),
  KEY idx_medicine_name (medicine_name),
  KEY idx_medicine_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS stock (
  stock_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id BIGINT UNSIGNED NOT NULL,
  medicine_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (stock_id),
  CONSTRAINT fk_stock_store FOREIGN KEY (store_id) REFERENCES medical_store(store_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_stock_medicine FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_stock_store_medicine (store_id, medicine_id),
  KEY idx_stock_store (store_id),
  KEY idx_stock_medicine (medicine_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Optional table for later: search history (not used by MVP backend yet)
CREATE TABLE IF NOT EXISTS search_history (
  search_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  query VARCHAR(190) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (search_id),
  KEY idx_search_user_created (user_id, created_at),
  CONSTRAINT fk_search_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

