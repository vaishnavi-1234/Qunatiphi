const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    // Owner is automatically added to members list
    const project = await Project.create({
      name,
      description: description || '',
      owner: req.user._id,
      members: [req.user._id],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for current user (owned or member)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private (Owner or Member)
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const userIdStr = req.user._id.toString();
    const isOwner = project.owner._id.toString() === userIdStr;
    const isMember = project.members.some(
      (m) => m._id.toString() === userIdStr
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this project',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the project owner can update project details',
      });
    }

    project.name = name || project.name;
    if (description !== undefined) {
      project.description = description;
    }

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project and its tasks
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the project owner can delete this project',
      });
    }

    // Delete all tasks belonging to this project
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Owner only)
const addMember = async (req, res, next) => {
  try {
    const { userId, email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only project owner can add members',
      });
    }

    let userToAdd;
    if (userId) {
      userToAdd = await User.findById(userId);
    } else if (email) {
      userToAdd = await User.findOne({ email: email.toLowerCase() });
    }

    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User to add not found',
      });
    }

    // Check if already member
    const alreadyMember = project.members.some(
      (m) => m.toString() === userToAdd._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project',
      });
    }

    project.members.push(userToAdd._id);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: `${userToAdd.name} added to project`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Owner only)
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only project owner can remove members',
      });
    }

    const { userId } = req.params;

    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the project owner from project members',
      });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== userId
    );

    await project.save();

    // Optionally unassign tasks assigned to removed member
    await Task.updateMany(
      { project: project._id, assignedTo: userId },
      { $set: { assignedTo: null } }
    );

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member removed from project',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project members workload statistics
// @route   GET /api/projects/:projectId/workload
// @access  Private (Owner or Member)
const getProjectWorkload = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate(
      'members',
      'name email avatar'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify user is owner or member
    const userIdStr = req.user._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isMember = project.members.some(
      (m) => m._id.toString() === userIdStr
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this project workload',
      });
    }

    // Efficient Aggregation across all tasks in this project
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    const taskStats = await Task.aggregate([
      {
        $match: {
          project: projectObjectId,
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$assignedTo',
          totalTaskCount: { $sum: 1 },
          inProgressCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Map stats by user ID for quick lookup
    const statsMap = {};
    taskStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        totalTaskCount: stat.totalTaskCount,
        inProgressCount: stat.inProgressCount,
      };
    });

    // Build response for all project members
    const workloadData = project.members.map((member) => {
      const memberIdStr = member._id.toString();
      const stats = statsMap[memberIdStr] || {
        totalTaskCount: 0,
        inProgressCount: 0,
      };
      const inProgressCount = stats.inProgressCount;
      const totalTaskCount = stats.totalTaskCount;

      return {
        userId: memberIdStr,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
        inProgressCount,
        totalTaskCount,
        overloaded: inProgressCount > 5, // Requirement: if ANY user has >5 In Progress tasks
      };
    });

    res.status(200).json({
      success: true,
      data: workloadData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectWorkload,
};
