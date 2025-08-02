// server/index.ts
import express from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expenses';
import categoryRoutes from './routes/categories';
// import statsRoutes from './routes/stats' // if needed later

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
// app.use('/api/stats', statsRoutes) // optionally add stats later

app.get('/', (req, res) => {
  res.send('Hello from RexPense backend!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
