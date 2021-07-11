const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        category: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        lat: {
            type: Number,
            require: true,
        },
        long: {
            type: Number,
            require: true,
        },
        startTime: {
            type: Date,
            // require: true,
        },
        endTime: {
            type: Date,
            // require: true,
        },
        createdBy: mongoose.ObjectId,
        description: {
            type: String,
        },
        likes: {
            type: Number,
            require: true,
            min: 0,
        },
        capacity: {
            type: Number,
            require: true,
            min: 1,
            max: 20,
        }
    },
    // {timestamps: true}
);

module.exports = mongoose.model("Event", EventSchema);