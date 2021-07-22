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

router.post("/editevent", async (req, res, next) => {
    try {
        const {event, editPayload} = req.body;
        let query={_id:event};
        console.log(query);
        const update = {
            title: editPayload.title,
            category: editPayload.category,
            address: editPayload.category,
            lat: editPayload.lat,
            long: editPayload.long,
            startTime: editPayload.startTime,
            endTime: editPayload.endTime,
            createdBy: editPayload.createdBy,
            description: editPayload.description,
            capacity: editPayload.capacity
        }
        console.log(update);
        const updatedEvent = Event.findOneAndUpdate(query, {"$set": update}).exec();
        res.status(200).json(updatedEvent);
    }
    catch(err) {
        res.status(500).json(err);
        console.log(err);
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
        console.log(err);
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

router.post("/userevents", async (req, res, next) => {
    try {
        const {likedEvents} = req.body;
        console.log(likedEvents);
        const events = await Event.find(
            {'_id': {$in: likedEvents}}
        );
        console.log(events);
        res.status(200).json(events);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})

module.exports = router;