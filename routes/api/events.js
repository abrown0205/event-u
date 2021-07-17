const router = require("express").Router();
const Event = require("../../models/Event");

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
    try {
        // Gets all the events stored in the database
        // Passes a code of 200 if successful
        const events = await Event.find();
        res.status(200).json(events);

    } catch(err) {
        res.status(500).json(err);
    }
})


router.post("/inrange", async (req, res) => {
    try {
        // Gets all the events stored in the database within range in req.body.start req.body.end
        // Passes a code of 200 if successful
        //2021, 2022 for year
        //2021-07, 2021-08 for month
        //2021-07-17, 2021-07-18 for day
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

module.exports = router;
