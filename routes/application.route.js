import express from "express"
import { applyJobs, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated,applyJobs);
router.route("/appliedjobs").get(isAuthenticated,getAppliedJobs);
router.route("/applicants/:id").get(isAuthenticated,getApplicants);
router.route("/update/:id").post(isAuthenticated,updateStatus);

export default router
