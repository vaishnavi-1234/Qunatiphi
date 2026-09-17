const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper to check user is project member or owner
const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const userIdStr = userId.toString();
  const isOwner = project.owner.toString() === userIdStr;
  const isMember = project.members.some((m) => m.toString() === userIdStr);

  if (!isOwner && !isMember) return false;
  return project;
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      project: projectId,
      assignedTo,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const project = await verifyProjectAccess(projectId, req.user._id);
    if (project === null) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    if (project === false) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not a member of this project',
      });
    }

    // If assignedTo is provided, verify user belongs to project
    if (assignedTo) {
      const isAssignedMember = project.members.some(
        (m) => m.toString() === assignedTo.toString()
      );
      if (!isAssignedMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a member of the project',
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'todo',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=:projectId&priority=:priority&status=:status
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project: projectId, priority, status } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project query parameter is required (?project=ID)',
      });
    }

    const project = await verifyProjectAccess(projectId, req.user._id);
    if (project === null) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    if (project === false) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this project',
      });
    }

    const filter = { project: projectId };

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name owner members');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project permission
    const hasAccess = await verifyProjectAccess(task.project._id, req.user._id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this task',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } =
      req.body;

    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const project = await verifyProjectAccess(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to modify this task',
      });
    }

    if (assignedTo !== undefined && assignedTo !== null) {
      const isAssignedMember = project.members.some(
        (m) => m.toString() === assignedTo.toString()
      );
      if (!isAssignedMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a member of the project',
        });
      }
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined)
      task.dueDate = dueDate ? new Date(dueDate) : null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const project = await verifyProjectAccess(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (drag & drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const patchTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['todo', 'in-progress', 'done'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${status}. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const project = await verifyProjectAccess(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to update this task',
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reassign task to another user
// @route   PATCH /api/tasks/:id/assign
// @access  Private
const patchTaskAssign = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const project = await verifyProjectAccess(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to reassign this task',
      });
    }

    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.toString() === assignedTo.toString()
      );
      if (!isMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a member of the project',
        });
      }
      task.assignedTo = assignedTo;
    } else {
      task.assignedTo = null;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  patchTaskStatus,
  patchTaskAssign,
};
