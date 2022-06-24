import mongoose from 'mongoose';
const DB_url = process.env.DB;
// mongo connect function

const connecDB = async () => {
  try {
    await mongoose.connect(DB_url);
    console.log('mongo connected');
  } catch (error) {
    console.log(error);
  }
};
export default connecDB;
