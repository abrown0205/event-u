const router = require("express").Router();
const Event = require("../../models/Event");

router.post("/newevent", async (req, res) => {
    const newEvent = new Event(req.body);
    try {
        // Save an event
        const savedEvent = await newEvent.save();

        // Pass code 200 for success if successful
        res.status(200).json(savedEvent);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get("/findevent", async (req, res) => {
    try {
        // Gets all the events stored in the database
        // Passes a code of 200 if successful

        
        const events = await Event.find();
        res.status(200).json(events);

    } catch(err) {
        res.status(500).json(err);
    }
})

router.post("/findcat", async (req, res, next) => {
    try {
        const {category} = req.body;
        const events = await Event.find({category:category}).exec();
        console.log(events);
        res.status(200).json(events);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;