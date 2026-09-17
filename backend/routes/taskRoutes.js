const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  patchTaskStatus,
  patchTaskAssign,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', patchTaskStatus);
router.patch('/:id/assign', patchTaskAssign);

module.exports = router;
