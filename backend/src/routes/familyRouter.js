const express = require("express");
const router = express.Router();
const HttpError = require("../error/HttpError");
const FamilyServices = require("../services/FamilyServices");
const { familySchema } = require("../schemas/familySchemas");
const verifyJWT = require("../auth/authMiddleware");

router.post("/",verifyJWT , async (req, res, next) => {
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
    const userId = req.user.userId;
    try {
        const family = await FamilyServices.createFamily(newFamily,userId);
        res.status(201).json(family);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
