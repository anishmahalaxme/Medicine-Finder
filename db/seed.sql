-- Sample data for MVP demo (adjust lat/lng to your city if needed)

INSERT INTO medical_store (store_name, phone, latitude, longitude, address) VALUES
('HealthPlus Pharmacy', '9876543210', 12.971599, 77.594566, 'MG Road, Bengaluru'),
('Care & Cure Medicals', '9876501234', 12.935192, 77.624481, 'Koramangala, Bengaluru'),
('CityMed Store', '9876512345', 12.916575, 77.610116, 'Jayanagar, Bengaluru'),
('Apollo QuickMeds', '9876523456', 12.988156, 77.580643, 'Malleshwaram, Bengaluru');

INSERT INTO medicine (medicine_name, category, manufacturer) VALUES
('Paracetamol 500mg', 'Pain Relief', 'ACME Pharma'),
('Cetirizine 10mg', 'Allergy', 'WellCare Labs'),
('Amoxicillin 500mg', 'Antibiotic', 'GenMed'),
('Omeprazole 20mg', 'Gastro', 'Healix'),
('Vitamin C 500mg', 'Supplements', 'NutriLife');

-- Stock: store_id and medicine_id rely on auto-increment order from inserts above.
INSERT INTO stock (store_id, medicine_id, quantity, price) VALUES
(1, 1, 120, 18.00),
(1, 2, 40, 35.00),
(1, 4, 15, 72.00),
(2, 1, 10, 20.00),
(2, 3, 25, 110.00),
(2, 5, 0, 60.00),
(3, 2, 5, 30.00),
(3, 4, 22, 70.00),
(4, 1, 60, 19.00),
(4, 5, 12, 55.00);

