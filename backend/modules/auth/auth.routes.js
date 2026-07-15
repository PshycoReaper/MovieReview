const express = require("express");
const router = express.Router();

const asyncHandler = require("../../utils/async-handler.util");
const { authenticateAdmin } = require("./auth.service");

router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const result = await authenticateAdmin(req.body);
        res.status(200).json(result);
    })
);

module.exports = router;
