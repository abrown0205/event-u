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

// Updates the likes of an event in the database.
router.post("/updateLikes", async (req, res) => {
    try {
        // Set corresponding variables as necessary.
        const { _id, likes } = req.body;
        let query = { _id: _id };
        let update = { likes: likes };

        // Uses the findByIdAndUpdate() function to search an event based on its id.
        // Then it updates the likes section of the event to whatever we set it to.
        // Calls a function in its third parameter to handle any errors, if there are
        // any.
        const addEvent = await Event.findByIdAndUpdate(query, update, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Updated likes: " + docs);
            }
        });

        // Posts the change made to the database.
        res.status(200).json(addEvent);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;