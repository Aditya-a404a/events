const express = require('express');
const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    authenticate
} = require('../controllers/eventController');
const router = express.Router();
router.use(express.json())
router.use(authenticate); // Protect all event routes

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
