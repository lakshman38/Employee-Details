const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

		await mongoose.connect(mongoUri);
		console.log("MongoDB Connected");
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
