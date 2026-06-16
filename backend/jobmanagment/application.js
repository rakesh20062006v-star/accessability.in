const Application = require("../mongodb/applicationschema");
const Job = require("../mongodb/jobschema");
const express = require("express");
 const {sendJobDetailsMail}=require('../emailsupport/mails');
const router = express.Router();
const User=require('../mongodb/mongoschema');

/* ==========================
   APPLY FOR A JOB
========================== */

router.post("/apply", async (req, res) => {
  try {
    const { username, jobId } = req.body;
        const user = await User.findOne({
          username
        });
        const email=user.email;
       
    
    const existing = await Application.findOne({
      username,
      jobId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    const application = await Application.create({
      username,
      jobId,
    });
    const job = await Job.findById(jobId);
      if (job) {
      await sendJobDetailsMail(user.email, job);
    }
    res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================
   GET ALL JOBS
========================== */

router.get("/jobdetails", async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json({
      message: "successful",
      data: jobs,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================
   GET ALL APPLICATIONS
========================== */

router.get("/details", async (req, res) => {
  try {
    const applications = await Application.find();

    const newdata = (
      await Promise.all(
        applications.map(async (elem) => {
          const jobd = await Job.findById(elem.jobId);

          // Skip if job not found
          if (!jobd) {
            return null;
          }

          return {
            _id: elem._id,
            username: elem.username,
            jobId: elem.jobId,

            jobname: jobd.title,
            companyname: jobd.company,
            location: jobd.location,
            type: jobd.type,
            disability: jobd.disability,
            salary: jobd.salary,
            lastDate: jobd.lastDate,
            description: jobd.description,
          };
        })
      )
    ).filter((item) => item !== null);

    res.status(200).json({
      message: "successful",
      newdata,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================
   GET SINGLE APPLICATION
========================== */

router.get("/application/:id", async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      application,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================
   GET SINGLE JOB
========================== */

router.get("/job/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "successful",
      job,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================
   UPDATE APPLICATION
========================== */

router.put("/update/:id", async (req, res) => {
  try {
    const updatedApplication =
      await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application updated successfully",
      updatedApplication,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================
   DELETE APPLICATION
========================== */
router.delete("/deletejob/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(
      req.params.id
    );

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json({
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
router.get("/:username", async (req, res) => { 
  try { const applications = await Application.find({ 
    username: req.params.username, });
   const jobIds = applications.map((app) => app.jobId);
    res.json({ jobIds }); }
     catch (err) {
       res.status(500).json({ 
        error: err.message, }); } });

module.exports = router;