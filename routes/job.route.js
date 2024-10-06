import express from "express"
import { getAllJobs, getJobsById, getRecruiterJobs, jobPost } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post(isAuthenticated ,jobPost);
router.route("/get").get(isAuthenticated ,getAllJobs);
router.route("/get/:id").get(isAuthenticated ,getJobsById);
router.route("/getrecruiterjobs").get(isAuthenticated ,getRecruiterJobs);

export default router
