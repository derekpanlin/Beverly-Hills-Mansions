const express = require('express');
const router = express.Router();
const apiRouter = require('./api')

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

// Prefixes all routes in the api router folder with /api
router.use('/api', apiRouter);


module.exports = router;
