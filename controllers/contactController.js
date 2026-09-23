const Contact = require("../models/contact");

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Check required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required",
            });
        }

        // Remove extra spaces
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();

        // Name length validation
        if (cleanName.length < 2 || cleanName.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 50 characters",
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
            });
        }

        // Message length validation
        if (cleanMessage.length < 10 || cleanMessage.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Message must be between 10 and 1000 characters",
            });
        }

        // Save validated data
        const contact = await Contact.create({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage,
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contact,
        });
    } catch (error) {
        console.error("Contact error:", error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

module.exports = {
    createContact,
};