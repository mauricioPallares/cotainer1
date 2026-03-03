import express, { Request, Response } from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/departments', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM departments ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching departments', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/employees', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
      SELECT e.*, d.name as department_name 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.id ASC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching employees', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/departments', async (req: Request, res: Response) => {
    try {
        const { name, code, budget, is_active, max_employees } = req.body;
        const result = await pool.query(
            'INSERT INTO departments (name, code, budget, is_active, max_employees) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, code, budget, is_active ?? true, max_employees]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating department', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/departments/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, budget, is_active, max_employees } = req.body;
        const result = await pool.query(
            'UPDATE departments SET name = $1, code = $2, budget = $3, is_active = $4, max_employees = $5 WHERE id = $6 RETURNING *',
            [name, code, budget, is_active, max_employees, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Department not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating department', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/departments/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Department not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting department', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/employees', async (req: Request, res: Response) => {
    try {
        const { department_id, first_name, last_name, hire_date, is_manager, salary } = req.body;
        const result = await pool.query(
            'INSERT INTO employees (department_id, first_name, last_name, hire_date, is_manager, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [department_id, first_name, last_name, hire_date, is_manager ?? false, salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating employee', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/employees/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { department_id, first_name, last_name, hire_date, is_manager, salary } = req.body;
        const result = await pool.query(
            'UPDATE employees SET department_id = $1, first_name = $2, last_name = $3, hire_date = $4, is_manager = $5, salary = $6 WHERE id = $7 RETURNING *',
            [department_id, first_name, last_name, hire_date, is_manager, salary, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating employee', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/employees/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting employee', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
