const mongoose = require("mongoose");
// const formatISO = require("date-fns/formatISO");
// const currentDate = formatISO(new Date());

const EventSchema = new mongoose.Schema(
    {
        title: {
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
            type: String,
            // require: true,
        },
        endTime: {
            type: String,
            // require: true,
        },
        createdBy: {
            type: String,
            description: ""
        },
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
            // min: 1,
            // max: 20,
        }
    },
    // {timestamps: true}
);

module.exports = mongoose.model("Event", EventSchema);