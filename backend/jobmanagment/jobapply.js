const express = require("express");
const router = express.Router();
const Job = require("../mongodb/jobschema");
const contact=require('../mongodb/contactschema');
router.get("/jobapply", async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json({
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
     router.put("/read/:id", async (req, res) => {
         console.log("Route hit:", req.params.id);
       try {
         const query = await contact.findByIdAndUpdate(
           req.params.id,
           { status: "read" }
          
         );
     
         res.json({
           success: true,
           data: query,
         });
       } catch (err) {
         res.status(500).json({
           error: err.message,
         });
       }
     });

module.exports = router;