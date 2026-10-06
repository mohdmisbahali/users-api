const express = require('express');

const router = express.Router();

const { getAllUsers, getUserById, createUser, updateUser, updateUser2, deleteUser } = require('../controllers/usresController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id', updateUser2);
router.delete('/:id', deleteUser);

module.exports = router;
