const express = require("express");
const router = express.Router();
const Job = require("../mongodb/jobschema");
const contact=require('../mongodb/contactschema');
router.post("/add-job", async (req, res) => {
  try {
    const job = await Job.create(req.body);
     console.log(job);
    res.status(201).json({
      message: "Job Added Successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post('/queries',async(req,res)=>{
   console.log("POST /queries hit");  
  try{
        const { name, email, subject, message } = req.body;

await contact.create({
  name,
  email,
  subject,
  message,
});
        res.json({message:"successfully sented"});
    }catch(err){
         res.status(500).json({
      error: err.message,
    });
    }
})
router.get('/getqueries',async(req,res)=>{
  try{
    const queries=await contact.find();
    res.json(queries);
  }
  catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
})



module.exports = router;