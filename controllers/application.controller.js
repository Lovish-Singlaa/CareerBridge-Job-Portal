import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js"

export const applyJobs = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(404).json({
                message: "Job Id not found",
                success: false
            })
        }

        const existedApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existedApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        })
        job.application.push(newApplication._id);
        await job.save();

        return res.status(200).json({
            message: "Job applied successfully",
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const appliedJobs = await Application.find({ applicant: userId }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "companyId",
                options: { sort: { createdAt: -1 } }
            }
        })

        if (!appliedJobs) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        }

        return res.status(200).json({
            appliedJobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//to find the list of users who applied for the specific job
export const getApplicants = async (req,res)=>{
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path: "application",
        options: {sort:{createdAt:-1}},
        populate:{
            path:"applicant",
            options: {sort:{createdAt:-1}}
        }
    });

    if(!job){
        return res.status(404).json({
            message: "Job not found",
            success: false
        })
    }

    return res.status(200).json({
        job,
        success: true
    })
}

export const updateStatus = async (req,res)=>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;

        if(!status){
            return res.status(404).json({
                message: "Status is required",
                success: false
            })
        }

        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status Updated successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}