const Job = require("../models/Job.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

// --- Nodemailer Transporter Configuration ---
// Define the transporter once at the top of the file for efficiency.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.HR_EMAIL,
    pass: process.env.HR_EMAIL_PASSWORD,
  },
  /**
   * --- FIX FOR 'SELF-SIGNED CERTIFICATE' ERROR ---
   * This is added to bypass certificate validation.
   * WARNING: This should only be used for development if you are behind a
   * corporate proxy or firewall. It disables a security feature.
   * Remove this in a production environment where the network is open.
   */
  tls: {
    rejectUnauthorized: false,
  },
});


// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// POST /api/jobs
const createJob = async (req, res) => {
  try {
    // UPDATED: Destructuring new fields for the job model
    const { title, location, timeType, summary, responsibilities, requirements } = req.body;
    const newJob = new Job({
      title,
      location,
      timeType,
      summary,
      responsibilities,
      requirements,
      postedDate: new Date(),
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to create job" });
  }
};

// PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const { title, location, timeType, summary, responsibilities, requirements } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.title = title;
    job.location = location;
    job.timeType = timeType;
    job.summary = summary;
    job.responsibilities = responsibilities;
    job.requirements = requirements;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};

const submitApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, locationName, jobTitle } =
      req.body;

    const resumeFile = req.file;

    await sendJobApplicationEmail({
      firstName,
      lastName,
      email,
      phone,
      locationName,
      jobTitle,
      resumeFile,
    });

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Error submitting application" });
  }
};

const sendJobApplicationEmail = async ({
  firstName,
  lastName,
  email,
  phone,
  locationName,
  jobTitle,
  resumeFile,
}) => {
  // The transporter is now defined globally, so we don't need to create it here.

  const currentYear = new Date().getFullYear();

  const mailOptions = {
    from: `"Job Portal" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL,
    subject: `New Application for ${jobTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);">
          <div style="background-color: #f0f8ff; padding: 30px; text-align: center; border-bottom: 1px solid #e0e0e0;">
              <h1 style="margin: 0; font-size: 30px; color: #1a73e8; font-weight: 700;">New Job Application Received!</h1>
              <p style="margin: 10px 0 0; font-size: 17px; color: #555555;">From Your Dedicated Job Portal</p>
          </div>

          <div style="padding: 35px;">
              <p style="font-size: 17px; line-height: 1.8; color: #333333; margin-bottom: 25px;">
                  Dear Hiring Team,
              </p>
              <p style="font-size: 17px; line-height: 1.8; color: #333333; margin-bottom: 30px;">
                  An exciting new application has just been submitted for the position of <strong style="color: #1a73e8;">${jobTitle}</strong>. Below are the details of the applicant:
              </p>

              <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 25px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <tr style="background-color: #f2f2f2;">
                      <td style="padding: 15px 20px; font-weight: bold; width: 35%; color: #444444; border-bottom: 1px solid #e0e0e0;">Applicant Name:</td>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">${firstName} ${lastName}</td>
                  </tr>
                  <tr style="background-color: #ffffff;">
                      <td style="padding: 15px 20px; font-weight: bold; color: #444444; border-bottom: 1px solid #e0e0e0;">Email:</td>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;"><a href="mailto:${email}" style="color: #1a73e8; text-decoration: none; word-break: break-all;">${email}</a></td>
                  </tr>
                  <tr style="background-color: #f2f2f2;">
                      <td style="padding: 15px 20px; font-weight: bold; color: #444444; border-bottom: 1px solid #e0e0e0;">Phone:</td>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">${phone}</td>
                  </tr>
                  <tr style="background-color: #ffffff;">
                      <td style="padding: 15px 20px; font-weight: bold; color: #444444; border-bottom: 1px solid #e0e0e0;">Location:</td>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">${locationName}</td>
                  </tr>
                  <tr style="background-color: #f2f2f2;">
                      <td style="padding: 15px 20px; font-weight: bold; color: #444444;">Applied Position:</td>
                      <td style="padding: 15px 20px;"><strong style="color: #1a73e8;">${jobTitle}</strong></td>
                  </tr>
              </table>

              <p style="font-size: 17px; line-height: 1.8; color: #333333; margin-top: 30px;">
                  The applicant's complete resume has been securely attached to this email for your detailed review.
              </p>
              <p style="font-size: 17px; line-height: 1.8; color: #333333; margin-top: 25px;">
                  Best regards,<br><strong style="color: #1a73e8;">The Job Portal Team</strong>
              </p>
          </div>

          <div style="background-color: #e6f7ff; color: #666666; padding: 20px; text-align: center; font-size: 13px; border-top: 1px solid #e0e0e0; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
              <p style="margin: 0 0 5px;">This is an automated notification. Please do not reply directly to this email.</p>
              <p style="margin: 0;">&copy; ${currentYear} Job Portal. All rights reserved.</p>
          </div>
      </div>
    `,
    attachments: [
      {
        filename: resumeFile.originalname,
        content: resumeFile.buffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { createJob, getJobs, updateJob, deleteJob, submitApplication };
