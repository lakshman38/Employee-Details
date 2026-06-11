const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/employees",
    require("./routes/employeeRoutes")
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server Running On Port ${PORT}`);
    });
};

startServer();