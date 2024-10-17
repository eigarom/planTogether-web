const express = require("express");
const router = express.Router();
const HttpError = require("../error/HttpError");
const FamilyQueries = require("../queries/FamilyQueries");
const { familySchema } = require("../schemas/familySchemas");

router.post("/", async (req, res, next) => {
    const { error } = familySchema.validate(req.body);
    if (error) {
        return next(new HttpError(400, error.message));
    }

    const newFamily = {
        name: "" + req.body.name,
        color: "" + req.body.color,
        imageContent: "" + req.body.imageContent,
        imageContentType: "" + req.body.imageContentType,
    };
    try {
        const family = await FamilyQueries.insertFamily(newFamily);
        res.status(201).json(family);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
