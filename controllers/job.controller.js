import { Job } from "../models/job.model.js";

export const jobPost = async (req, res) => {
    try {
        const { title, description, requirements, salary, experience, location, jobType, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !experience || !location || !jobType || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary,
            experienceLevel: experience,
            location,
            jobType,
            position,
            companyId,
            created_by: userId
        })

        return res.status(200).json({
            message: "New job created successfully",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }
        const jobs = await Job.find(query).populate({
            path: "companyId"
        }).sort({createdAt:-1});

        if (!jobs) {
            return res.status(404).json({
                message: "Something is missing",
                success: false
            })
        }

        return res.status(200).json({
            message: "Jobs found",
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getJobsById = async (req, res) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path: "application"
    })
    if (!jobId) {
        return res.status(400).json({
            message: "Somethig is missing",
            success: false
        })
    }

    // const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            message: "Job not found!",
            success: false
        })
    }

    return res.status(200).json({
        job,
        success: true,
    })
}

export const getRecruiterJobs = async (req, res) => {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
        path: 'companyId',
        createdAt: -1
    })
    if (!jobs) {
        return res.status(404).json({
            message: "Job not found!",
            success: false
        })
    }

    return res.status(200).json({
        jobs,
        success: true
    })
}