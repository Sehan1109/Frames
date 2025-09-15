import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/Item.js";

dotenv.config();

const fixItems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB connected");

        const items = await Item.find();
        for (const item of items) {
            if (item.coverImage?.startsWith("uploads/")) {
                item.coverImage = item.coverImage.replace("uploads/", "");
            }
            item.images = item.images.map((img) =>
                img.startsWith("uploads/") ? img.replace("uploads/", "") : img
            );
            await item.save();
        }

        console.log("✅ Fixed old items");
        process.exit();
    } catch (err) {
        console.error("❌ Error fixing items:", err);
        process.exit(1);
    }
};

fixItems();
