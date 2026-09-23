const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    })
);

app.use(express.json({ limit: "10kb" }));
app.use(helmet());

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many contact requests. Please try again later.",
    },
});

// Contact API
app.use("/api/contact", contactLimiter, contactRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Tooba Portfolio API is running");
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend is working",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

// Check MongoDB URI
console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });