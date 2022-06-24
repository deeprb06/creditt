import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connecDB from './config/connection';
import router from './routes';

// define port
const port = process.env.PORT;
const app = express();

// connect to database
connecDB();

// handling json middleware
app.use(express.json());

// handling cors error
app.use(cors());

// middleware
app.use('/api/user', router);

// error handling middleware
app.use((req, res, next) => {
  const error = new Error();
  error.status(404);
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 404);
  res.json({ message: 'Page Not Found' });
});

// listing request port
app.listen(port, () => console.log(`server up and running on port ${port}`));
