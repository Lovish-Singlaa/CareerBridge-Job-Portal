import express, { application } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import dbConnect from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import companyRoute from './routes/company.route.js'
import jobRoute from './routes/job.route.js'
import applicationRoute from './routes/application.route.js'

dotenv.config({})
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  return res.status(200).json({
    message: "I am coming from backend",
    success: true
  })
})

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: "https://careerbridge-job-portal-frontend.onrender.com",
    credentials: true
}

app.use(cors({
  origin: 'https://careerbridge-job-portal-frontend.onrender.com',
  credentials: true,
}));

app.options('*', cors());
  
app.use("/api/v1/user", userRoute);  //localhost:8000/api/v1/user/register
app.use("/api/v1/company", companyRoute); //localhost:8000/api/v1/company/register
app.use("/api/v1/job", jobRoute); //localhost:8000/api/v1/job/post
app.use("/api/v1/application", applicationRoute)

app.listen(port, () => {
  dbConnect()
  console.log(`Server listening on port ${port}`)
})
