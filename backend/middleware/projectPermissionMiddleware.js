const Project = require('../models/Project');

// Middleware to verify user is either owner or member of project
const checkProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.project;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const userIdStr = req.user._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isMember = project.members.some(
      (m) => m.toString() === userIdStr
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this project',
      });
    }

    req.project = project;
    req.isProjectOwner = isOwner;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to verify user is the owner of project
const checkProjectOwner = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const userIdStr = req.user._id.toString();
    if (project.owner.toString() !== userIdStr) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the project owner can perform this action',
      });
    }

    req.project = project;
    req.isProjectOwner = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkProjectMember, checkProjectOwner };
