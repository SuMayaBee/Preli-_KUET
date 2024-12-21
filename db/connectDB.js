import mongoose from "mongoose";

const uri = "mongodb+srv://dippal513:hunter51302@@cluster0.uzftm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => { 

  try {
    const conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;