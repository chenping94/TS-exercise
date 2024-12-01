// import express from 'express';

// const app = express();
// const PORT = 8001;

// app.get('/', (req, res) => res.send('Express + TypeScript Server'));

// app.listen(PORT, () =>
// {
//   console.log(`⚡️ Server is running at https://localhost:${PORT}`);
// });

import express from 'express';
import { StockAnalysis } from './stocks';
import { SongAnalysis } from './songs';

const app = express();
const PORT = 8080;

// app.get('/', (req, res) => res.send('Lookme + TypeScript Server'));
app.get('/', async (req, res) => {
  // const analysis = new StockAnalysis();
  const analysis = new SongAnalysis();

  const rendered = await analysis.render();
  res.send(rendered);
});

app.get('/monthly/:month', async (req, res) => {
  try {
    const month = req.params.month;
    
    // const analysis = new StockAnalysis();
    const analysis = new SongAnalysis();

    // const monthlyDetail = await analysis.getMonthlyDetail(month);
    const monthlyDetail = await analysis.getSongDetail(month);

    res.send(monthlyDetail);
　} catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing your request');
　}
});

app.listen(PORT, () =>
{
  console.log(`⚡️ Server is running at https://localhost:${PORT}`);
});





