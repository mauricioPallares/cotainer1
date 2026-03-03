CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code CHAR(5) NOT NULL UNIQUE,
    budget NUMERIC(15, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    max_employees INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    is_manager BOOLEAN DEFAULT false,
    salary NUMERIC(10, 2) NOT NULL
);

-- Insertar datos de prueba
INSERT INTO departments (name, code, budget, is_active, max_employees) VALUES
('Recursos Humanos', 'HR001', 50000.00, true, 10),
('Tecnología', 'IT002', 150000.00, true, 50),
('Ventas', 'SL003', 75000.00, true, 20);

INSERT INTO employees (department_id, first_name, last_name, hire_date, is_manager, salary) VALUES
(1, 'Ana', 'García', '2023-01-15', true, 5000.00),
(1, 'Luis', 'Pérez', '2023-05-20', false, 3000.00),
(2, 'Carlos', 'López', '2022-11-01', true, 8000.00),
(2, 'María', 'Rodríguez', '2023-02-10', false, 4500.00),
(2, 'Jorge', 'Martínez', '2023-08-05', false, 4200.00),
(3, 'Laura', 'Sánchez', '2024-01-10', true, 6000.00);
