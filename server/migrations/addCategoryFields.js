import { Event } from "../src/models/event.model.js";
import connectDB from "../src/utils/connecttodb.js";
import { configDotenv } from "dotenv";
configDotenv();

export const addCategoryField = async () => {
  try {
    await connectDB();
    await Event.updateMany(
      {},
      { $set: { category: "Social Events", subCategory: "Reunions" } }
    );
    console.log("Migration Complete");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

addCategoryField();
