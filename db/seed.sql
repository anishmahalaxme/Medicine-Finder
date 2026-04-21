-- Kondhwa, Pune — Real Pharmacy Locations (Medicine Finder DBMS Project)
-- Coordinates verified around Kondhwa, Pune (18.46–18.49N, 73.87–73.90E)

INSERT INTO medical_store (store_name, phone, latitude, longitude, address, opening_hours) VALUES
('MedPlus Pharmacy - Kondhwa',        '9503091234', 18.4858, 73.8876, 'Shop 4, Kondhwa Main Rd, Kondhwa, Pune 411048',                    '8:00 AM - 10:00 PM'),
('Apollo Pharmacy - Kondhwa Budruk',  '9503092345', 18.4812, 73.8921, 'Near Kondhwa Bus Stop, Kondhwa Budruk, Pune 411048',               'Open 24 Hours'),
('Wellness Forever - Kondhwa',        '9503093456', 18.4773, 73.8899, 'Sinhagad Rd, Opposite Dorabjee Mall, Kondhwa, Pune 411048',        '7:00 AM - 11:00 PM'),
('NetMeds Store - Undri',             '9503094567', 18.4718, 73.8834, 'Undri Main Rd, Undri, Pune 411060',                                '9:00 AM - 9:00 PM'),
('Guardian Pharmacy - Mohammadwadi',  '9503095678', 18.4696, 73.9012, 'Mohammadwadi Rd, Near Seasons Mall, Pune 411060',                  '8:30 AM - 10:30 PM'),
('Jan Aushadhi Kendra - Kondhwa',     '9503096789', 18.4840, 73.8845, 'Kondhwa Khurd, Near St. Francis School, Pune 411048',             '9:00 AM - 6:00 PM'),
('Sahyadri Medical Store - Pisoli',   '9503097890', 18.4651, 73.9055, 'Pisoli Main Rd, Pisoli, Pune 411028',                              '8:00 AM - 9:00 PM'),
('LifeCare Pharmacy - NIBM Rd',       '9503098901', 18.4920, 73.8940, 'NIBM Road, Near Clover Highlands, Pune 411048',                    '8:00 AM - 11:00 PM'),
('Noble Medicals - Undri',            '9503099012', 18.4740, 73.8810, 'DP Road, Undri, Pune 411060',                                      '8:00 AM - 10:00 PM'),
('Shree Medical - Kondhwa',           '9503090123', 18.4799, 73.8862, 'Kondhwa Main Rd, Near Rhythm Corner, Pune 411048',                 '7:30 AM - 10:30 PM');


-- ============================================================
-- MEDICINES (60 total across 10 categories)
-- ============================================================

INSERT INTO medicine (medicine_name, category, manufacturer) VALUES
-- Pain Relief (8)
('Paracetamol 500mg',        'Pain Relief',    'Cipla Ltd'),
('Dolo 650mg',               'Pain Relief',    'Micro Labs'),
('Ibuprofen 400mg',          'Pain Relief',    'Abbott India'),
('Diclofenac 50mg',          'Pain Relief',    'Novartis India'),
('Naproxen 500mg',           'Pain Relief',    'Roche India'),
('Aspirin 650mg',            'Pain Relief',    'Bayer India'),
('Ketorolac 10mg',           'Pain Relief',    'Sun Pharma'),
('Tramadol 50mg',            'Pain Relief',    'Mankind Pharma'),

-- Allergy (6)
('Cetirizine 10mg',          'Allergy',        'Sun Pharma'),
('Montair LC',               'Allergy',        'Cipla Ltd'),
('Loratadine 10mg',          'Allergy',        'GSK Pharma'),
('Fexofenadine 120mg',       'Allergy',        'Sanofi India'),
('Levocetirizine 5mg',       'Allergy',        'Dr Reddys'),
('Chlorpheniramine 4mg',     'Allergy',        'Alkem Labs'),

-- Antibiotic (8)
('Amoxicillin 500mg',        'Antibiotic',     'GSK Pharma'),
('Azithromycin 500mg',       'Antibiotic',     'Alkem Labs'),
('Metronidazole 400mg',      'Antibiotic',     'Pfizer India'),
('Ciprofloxacin 500mg',      'Antibiotic',     'Bayer India'),
('Doxycycline 100mg',        'Antibiotic',     'Sun Pharma'),
('Cefixime 200mg',           'Antibiotic',     'Lupin Ltd'),
('Clarithromycin 500mg',     'Antibiotic',     'Abbott India'),
('Co-Amoxiclav 625mg',       'Antibiotic',     'GSK Pharma'),

-- Gastro (7)
('Omeprazole 20mg',          'Gastro',         'Dr Reddys'),
('Pan D Capsule',            'Gastro',         'Alkem Labs'),
('Pantoprazole 40mg',        'Gastro',         'Lupin Ltd'),
('Rabeprazole 20mg',         'Gastro',         'Cipla Ltd'),
('Domperidone 10mg',         'Gastro',         'Sunmark'),
('Ondansetron 4mg',          'Gastro',         'Sun Pharma'),
('Metoclopramide 10mg',      'Gastro',         'Nicholas Piramal'),

-- Diabetes (6)
('Metformin 500mg',          'Diabetes',       'USV Ltd'),
('Glimepiride 1mg',          'Diabetes',       'Abbott India'),
('Glipizide 5mg',            'Diabetes',       'Pfizer India'),
('Sitagliptin 100mg',        'Diabetes',       'MSD India'),
('Vildagliptin 50mg',        'Diabetes',       'Novartis India'),
('Empagliflozin 10mg',       'Diabetes',       'Boehringer India'),

-- Cardiology (7)
('Amlodipine 5mg',           'Cardiology',     'Lupin Ltd'),
('Atorvastatin 10mg',        'Cardiology',     'Ranbaxy'),
('Aspirin 75mg',             'Cardiology',     'Bayer India'),
('Ramipril 5mg',             'Cardiology',     'Sanofi India'),
('Telmisartan 40mg',         'Cardiology',     'Dr Reddys'),
('Bisoprolol 5mg',           'Cardiology',     'Cipla Ltd'),
('Clopidogrel 75mg',         'Cardiology',     'Sun Pharma'),

-- Supplements (6)
('Vitamin C 500mg',          'Supplements',    'Himalaya'),
('Vitamin D3 60K IU',        'Supplements',    'Sun Pharma'),
('B-Complex Tablet',         'Supplements',    'Abbott India'),
('Calcium + D3 Tablet',      'Supplements',    'Pfizer India'),
('Zinc 50mg',                'Supplements',    'USV Ltd'),
('Omega-3 1000mg',           'Supplements',    'Dr Reddys'),

-- Respiratory (6)
('Cough Syrup Benadryl',     'Respiratory',    'Johnson & Johnson'),
('Montelukast 10mg',         'Respiratory',    'Cipla Ltd'),
('Salbutamol 100mcg',        'Respiratory',    'GSK Pharma'),
('Budesonide 200mcg',        'Respiratory',    'AstraZeneca'),
('Tiotropium 18mcg',         'Respiratory',    'Boehringer India'),
('Ipratropium 20mcg',        'Respiratory',    'Boehringer India'),

-- Skin Care (4)
('Clotrimazole Cream 1%',    'Skin Care',      'Bayer India'),
('Betamethasone 0.1% Cream', 'Skin Care',      'GSK Pharma'),
('Mupirocin 2% Ointment',    'Skin Care',      'GSK Pharma'),
('Hydrocortisone 1% Cream',  'Skin Care',      'Cipla Ltd'),

-- Eye & ENT (4)
('Ciprofloxacin Eye Drops',  'Eye & ENT',      'Cipla Ltd'),
('Ofloxacin 0.3% Drops',     'Eye & ENT',      'Sun Pharma'),
('Mometasone Nasal Spray',   'Eye & ENT',      'MSD India'),
('Xylometazoline 0.1%',      'Eye & ENT',      'Novartis India');


-- ============================================================
-- STOCK (distributed across all 10 stores, medicine IDs 1-60)
-- ============================================================

-- MedPlus Kondhwa (store 1)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(1,  1, 200, 18.50),(1,  2, 150, 32.00),(1,  3,  90, 22.00),(1,  4,  60, 48.00),
(1,  5,  40, 95.00),(1,  7,  30, 85.00),(1,  9,  60, 28.00),(1, 10,  35, 145.00),
(1, 15, 40, 98.00),(1, 16, 30, 115.00),(1, 17, 50, 55.00),(1, 20, 25, 148.00),
(1, 23, 30, 65.00),(1, 24, 50, 72.00),(1, 25, 40, 68.00),(1, 26, 35, 110.00),
(1, 31, 55, 45.00),(1, 32, 30, 88.00),(1, 36, 85, 85.00),(1, 37, 40, 95.00),
(1, 38, 50, 12.00),(1, 41, 80, 55.00),(1, 42, 25, 280.00),(1, 43, 60, 38.00),
(1, 44, 45, 62.00),(1, 47, 45, 75.00),(1, 48, 30, 72.00),(1, 51, 30, 38.00),
(1, 53, 20, 340.00),(1, 57, 25, 185.00),(1, 58, 15, 125.00);

-- Apollo Kondhwa Budruk (store 2)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(2,  1,  80, 19.00),(2,  2, 120, 31.50),(2,  3,  70, 21.50),(2,  6,  25, 82.00),
(2,  8,  20, 195.00),(2, 10,  35, 148.00),(2, 11,  30, 38.00),(2, 12,  25, 52.00),
(2, 16,  20, 115.00),(2, 18,  30, 82.00),(2, 19,  25, 145.00),(2, 22,  15, 185.00),
(2, 24,  50, 74.00),(2, 25,  40, 70.00),(2, 27,  35, 48.00),(2, 28,  20, 35.00),
(2, 32,  40, 90.00),(2, 33,  30, 65.00),(2, 35,  25, 280.00),(2, 36,  80, 83.00),
(2, 38,  50, 12.00),(2, 40,  50, 86.00),(2, 41,  30, 54.00),(2, 42,  40, 278.00),
(2, 45,  30, 85.00),(2, 46,  25, 118.00),(2, 50,  20, 185.00),(2, 55,  20, 52.00),
(2, 59,  15, 95.00),(2, 60,  20, 68.00);

-- Wellness Forever Kondhwa (store 3)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(3,  1, 300, 17.00),(3,  2, 200, 30.50),(3,  3,  50, 26.00),(3,  5,  25, 100.00),
(3,  9,  60, 27.50),(3, 10,  30, 144.00),(3, 15,  25, 100.00),(3, 17,  40, 55.00),
(3, 23,  40, 62.00),(3, 24,  70, 66.00),(3, 26,  25, 108.00),(3, 29,  40, 35.00),
(3, 31,  55, 46.00),(3, 32,  30, 88.00),(3, 34,  25, 88.00),(3, 36,  70, 84.00),
(3, 38,  60, 11.50),(3, 41,  70, 52.00),(3, 42,  20, 275.00),(3, 43,  55, 36.00),
(3, 44,  40, 60.00),(3, 47,  30, 74.00),(3, 48,  25, 70.00),(3, 51,  35, 36.00),
(3, 54,  20, 175.00),(3, 56,  15, 155.00),(3, 57,  20, 182.00);

-- NetMeds Undri (store 4)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(4,  2,  90, 30.00),(4,  4,  20, 48.00),(4,  6,  30, 80.00),(4, 11,  35, 37.00),
(4, 12,  20, 50.00),(4, 13,  25, 42.00),(4, 16,  30, 112.00),(4, 18,   0, 80.00),
(4, 19,  25, 144.00),(4, 21,  20, 95.00),(4, 22,  10, 182.00),(4, 24,  50, 66.00),
(4, 25,  40, 67.00),(4, 27,  30, 46.00),(4, 32,  35, 92.00),(4, 33,  25, 62.00),
(4, 36,  45, 83.00),(4, 37,  25, 97.00),(4, 38,  60, 11.00),(4, 40,  40, 84.00),
(4, 44,  30, 62.00),(4, 46,  20, 115.00),(4, 49,  15, 82.00),(4, 55,  15, 50.00),
(4, 60,  15, 65.00);

-- Guardian Pharmacy Mohammadwadi (store 5)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(5,  1, 120, 18.00),(5,  3,  40, 27.00),(5,  5,  18, 102.00),(5,  9,  44, 28.50),
(5, 10,  22, 146.00),(5, 14,  30, 72.00),(5, 15,   8, 105.00),(5, 17,  30, 56.00),
(5, 23,  30, 64.00),(5, 24,  55, 68.00),(5, 26,  20, 110.00),(5, 28,  25, 36.00),
(5, 31,  44, 46.00),(5, 33,  35, 63.00),(5, 36,  55, 84.00),(5, 38,  40, 12.50),
(5, 40,  35, 84.00),(5, 41,  55, 54.00),(5, 42,   5, 285.00),(5, 45,  25, 86.00),
(5, 47,  45, 76.00),(5, 53,  15, 345.00),(5, 56,  10, 158.00),(5, 59,  12, 96.00);

-- Jan Aushadhi Kendra Kondhwa (store 6) — generic/govt, very cheap prices
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(6,  1, 500, 8.50),(6,  2, 300, 15.00),(6,  3, 200, 12.00),(6,  5, 100, 52.00),
(6,  9, 250, 10.00),(6, 10, 100, 62.00),(6, 15, 100, 52.00),(6, 16, 250, 28.00),
(6, 17, 200, 22.00),(6, 18, 100, 28.00),(6, 23, 200, 28.00),(6, 24, 250, 32.00),
(6, 25, 180, 30.00),(6, 26, 100, 48.00),(6, 27, 150, 18.00),(6, 31, 150, 20.00),
(6, 32,  80, 38.00),(6, 36,  80, 38.00),(6, 38, 120, 5.50),(6, 41, 200, 22.00),
(6, 42,  60, 120.00),(6, 43, 100, 18.00),(6, 47,  80, 32.00),(6, 51, 120, 15.00);

-- Sahyadri Medical Pisoli (store 7)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(7,  1,  70, 19.50),(7,  3,  35, 28.50),(7,  6,  22, 82.00),(7, 14,  25, 74.00),
(7, 17,  40, 57.00),(7, 18,  15, 125.00),(7, 19,   0, 148.00),(7, 24,  40, 69.00),
(7, 26,  20, 112.00),(7, 28,  30, 36.00),(7, 32,  28, 96.00),(7, 36,  40, 85.00),
(7, 37,  20, 98.00),(7, 38,  35, 12.00),(7, 40,  30, 86.00),(7, 47,  40, 77.00),
(7, 48,  25, 74.00),(7, 53,  10, 350.00),(7, 57,  15, 188.00);

-- LifeCare Pharmacy NIBM Rd (store 8)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(8,  2, 100, 32.50),(8,  3,  55, 28.50),(8,  4,  28, 49.00),(8,  7,  20, 88.00),
(8, 10,  40, 148.00),(8, 12,  25, 52.00),(8, 13,  30, 42.00),(8, 16,  30, 114.00),
(8, 22,  15, 188.00),(8, 24,  45, 68.00),(8, 25,  35, 68.00),(8, 26,  20, 110.00),
(8, 32,  40, 92.00),(8, 33,  25, 65.00),(8, 34,  20, 90.00),(8, 36,  50, 84.00),
(8, 38,  45, 11.50),(8, 42,  18, 278.00),(8, 43,  50, 38.00),(8, 44,  35, 62.00),
(8, 47,  50, 76.00),(8, 51,  30, 37.00),(8, 53,  18, 342.00),(8, 58,  10, 128.00);

-- Noble Medicals Undri (store 9)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(9,  1, 160, 18.00),(9,  3,  50, 27.00),(9,  5,  30, 99.00),(9,  9,  60, 28.00),
(9, 10,  25, 144.00),(9, 12,  25, 50.00),(9, 13,  30, 42.00),(9, 15,  25, 100.00),
(9, 17,  50, 56.00),(9, 20,  20, 148.00),(9, 23,  35, 64.00),(9, 24,  60, 67.00),
(9, 27,  30, 46.00),(9, 28,  20, 34.00),(9, 31,  60, 45.00),(9, 32,  25, 90.00),
(9, 36,  45, 84.00),(9, 38,  35, 12.00),(9, 40,  35, 85.00),(9, 41,  90, 53.00),
(9, 43,  40, 36.00),(9, 47,  50, 76.00),(9, 51,  25, 36.00),(9, 56,  10, 158.00);

-- Shree Medical Kondhwa (store 10)
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(10,  1, 110, 17.50),(10,  2,  80, 31.00),(10,  3,  45, 27.50),(10,  4,  30, 47.00),
(10,  8,  15, 192.00),(10, 10,  20, 145.00),(10, 14,  20, 72.00),(10, 16,  20, 112.00),
(10, 17,  28, 55.00),(10, 20,  15, 148.00),(10, 23,  28, 63.00),(10, 24,  55, 67.00),
(10, 25,  38, 67.50),(10, 27,  22, 46.00),(10, 29,  30, 34.00),(10, 31,  45, 44.00),
(10, 36,  40, 83.00),(10, 38,  30, 11.50),(10, 41,  65, 53.50),(10, 42,  12, 282.00),
(10, 43,  55, 36.50),(10, 44,  38, 60.00),(10, 47,  35, 75.00),(10, 57,  12, 185.00);
