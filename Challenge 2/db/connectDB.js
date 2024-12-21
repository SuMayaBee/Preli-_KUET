import mongoose from "mongoose";

const uri = "mongodb+srv://arafathussain:6mnOp7Krgse7BEYf@kitchenbuddy0.dwzce.mongodb.net/?retryWrites=true&w=majority&appName=KitchenBuddy0";

const connectDB = async () => { 

  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;