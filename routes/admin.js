import express from 'express';
import {
  addLectures,
  createAssignment,
  createCourse,
  deleteAssignment,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  getAssignmentsByCourse,
  getAssignmentSubmissions,
  submitAssignment,
  updateRole,
  updateSubmissionMarks,
  getCourseLectures,
} from '../controller/admin.js';
import {
  createMeeting,
  deleteMeeting,
  getMeetings,
  updateMeeting,
} from '../controller/meeting.js';
import { isAdmin, isAuth, isInstructorOrAdmin } from '../middlewares/isAuth.js';
import { uploadFiles } from '../middlewares/multer.js';
import Payout from '../models/instructor.js';
import { Courses } from '../models/courses.js';
import { User } from '../models/user.js';

const router = express.Router();

// Admin-only routes (create/delete courses, lectures, meetings)
router.post('/course/new', isAuth, isAdmin, uploadFiles, createCourse);
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures); // Updated to isAdmin
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture); // Updated to isAdmin
router.get('/course/:id/lectures', isAuth, isInstructorOrAdmin, getCourseLectures); // Added
router.post('/course/:courseId/meeting', isAuth, isAdmin, createMeeting);
router.post('/lecture/:lectureId/meeting', isAuth, isAdmin, createMeeting);
router.delete('/course/:courseId/meeting/:meetingId', isAuth, isAdmin, deleteMeeting);

// Instructor or Admin routes (viewing stats, users, updating meetings, assignments)
router.get('/stats', isAuth, isInstructorOrAdmin, getAllStats);
router.get('/users', isAuth, isInstructorOrAdmin, getAllUser);
router.put('/meeting/:meetingId', isAuth, isInstructorOrAdmin, updateMeeting);
router.get('/course/:courseId/meetings', isAuth, isInstructorOrAdmin, getMeetings);

// Assignment routes
router.post('/course/:courseId/assignment', isAuth, isInstructorOrAdmin, createAssignment);
router.get('/course/:courseId/assignments', isAuth, getAssignmentsByCourse);
router.post('/assignment/:assignmentId/submit', isAuth, submitAssignment);
router.delete('/assignment/:assignmentId', isAuth, isInstructorOrAdmin, deleteAssignment);

// Submission management routes
router.get('/assignment/:assignmentId/submissions', isAuth, isInstructorOrAdmin, getAssignmentSubmissions);
router.put('/assignment/:assignmentId/submission/:submissionId', isAuth, isInstructorOrAdmin, updateSubmissionMarks);

// Role update (admin only)
router.put('/user/:id', isAuth, isAdmin, updateRole);

// Route for assigning/de-assigning instructors
router.put('/course/:id/assign', isAuth, isAdmin, async (req, res) => {
  try {
    const { instructorId } = req.body;
    const course = await Courses.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (instructorId) {
      const instructor = await User.findById(instructorId);
      if (!instructor || instructor.role !== 'instructor') {
        return res.status(400).json({
          success: false,
          message: 'Invalid instructor ID or user is not an instructor',
        });
      }
      course.assignedTo = instructorId;
    } else {
      course.assignedTo = null; // De-assign instructor
    }

    await course.save();
    res.status(200).json({
      success: true,
      message: 'Course assignment updated successfully',
    });
  } catch (error) {
    console.error('Error updating course assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// Withdrawal request routes
router.get('/withdrawal-requests', isAuth, isAdmin, async (req, res) => {
  try {
    const requests = await Payout.find()
      .populate('instructorId', 'name email')
      .sort({ dateRequested: -1 });

    const formattedRequests = requests.map(req => ({
      _id: req._id,
      instructorId: req.instructorId ? req.instructorId._id : null,
      instructorName: req.instructorId ? req.instructorId.name : 'Unknown',
      instructorEmail: req.instructorId ? req.instructorId.email : 'Unknown',
      amount: req.amount,
      status: req.status,
      dateRequested: req.dateRequested,
      dateProcessed: req.dateProcessed,
    }));

    res.status(200).json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal requests' });
  }
});

router.put('/withdrawal-requests/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value: ${status}. Must be one of: pending, processed, approved, rejected`,
      });
    }

    const withdrawalRequest = await Payout.findById(id);

    if (!withdrawalRequest) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
    }

    withdrawalRequest.status = status;

    if (withdrawalRequest.status !== 'pending' && !withdrawalRequest.dateProcessed) {
      withdrawalRequest.dateProcessed = new Date();
    }

    await withdrawalRequest.save();

    res.status(200).json({
      success: true,
      message: `Withdrawal request ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`,
    });
  } catch (error) {
    console.error('Error updating withdrawal request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update withdrawal request',
      error: error.message,
    });
  }
});

export default router;