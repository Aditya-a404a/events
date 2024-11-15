
const events =[] 
// Middleware for checking JWT token
const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Create Event
exports.createEvent = (req, res) => {
    const { title, description, date, location } = req.body;
    const event = { id: events.length + 1, title, description, date, location, createdBy: req.user.username };
    events.push(event);

    res.status(201).json(event);
};

// Get All Events
exports.getEvents = (req, res) => {
    res.json(events);
};

// Get Event by ID
exports.getEvent = (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
};

// Update Event
exports.updateEvent = (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy !== req.user.username) return res.status(403).json({ message: "Unauthorized" });

    const { title, description, date, location } = req.body;
    Object.assign(event, { title, description, date, location });

    res.json(event);
};

// Delete Event
exports.deleteEvent = (req, res) => {
    const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id));
    if (eventIndex === -1) return res.status(404).json({ message: "Event not found" });

    const event = events[eventIndex];
    if (event.createdBy !== req.user.username) return res.status(403).json({ message: "Unauthorized" });

    events.splice(eventIndex, 1);
    res.json({ message: "Event deleted" });
};

module.exports.authenticate = authenticate;
