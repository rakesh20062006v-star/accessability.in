const express = require('express');
const cors = require('cors');
const connectDB = require('./mongodb/monoconnection');
const LoginRoutes = require('./loginbased/login');
const User=require('./mongodb/mongoschema');
const JobRoutes=require('./jobmanagment/jobapply');
const app = express();
const admin=require('./mongodb/adminschema');
const AddRoutes=require('./jobmanagment/addjob')
const ApplicationRouter=require('./jobmanagment/application');
const contact =require('./mongodb/contactschema');
app.use(express.json());
app.use(cors());

 async function startServer() {
    
await connectDB();

    app.use('/api/auth', LoginRoutes);
    app.use('/api/jobs',JobRoutes);
   app.use("/api/jobsadd", AddRoutes);
   app.use('/api/application',ApplicationRouter);
  app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
}

startServer();