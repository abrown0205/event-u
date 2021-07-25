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
    // grabs all the events a user has liked and returns them to be put in local storage
    // utilized for when the page updates with new liked events
    try {
        const {likedEvents} = req.body;
        console.log(likedEvents);
        const events = await Event.find(
            {'_id': {$in: likedEvents}}
        );
        res.status(200).json(events);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})

router.post("/inrange", async (req, res) => {
    try {
        // Gets all the events stored in the database within range in req.body.start req.body.end
        // Passes a code of 200 if successful
        //2021 for year
        //2021-07 for month
        //2021-07-17 for day
        const events = await Event.find( {startTime: { $gte: req.body.start, $lte: req.body.end} } )
                                  .sort({startTime: 1});
        res.status(200).json(events);

    } catch(err) {
        res.status(500).json(err);
    }
})




router.post("/delete", async (req, res) => {
    try {
        // Tries to delete event by _id
        // Passes a code of 200 if successful

        Event.findOneAndDelete( {_id: req.body._id }, function (err, docs){
            if (err){
                console.log(err)
            }
            else{
                if(docs === null){
                    res.status(500).json("error: no event found with id: " + req.body._id)
                } else {
                    console.log("Deleted Event : ", docs);
                    res.status(200).json("Deleted event with id: " + req.body._id);
                }

            }
        });

    } catch(err) {
        res.status(500).json(err);
    }
})

router.post("/search", async (req, res, next) => {
    const {search} = req.body; // gets the event query and the specific method of searching

    try
    {
        const events = await Event.find({title: search}).exec();
        res.status(200).json(events);
    }
    catch(err)
    {
        res.status(500).json(err);
    }

})

module.exports = router;
