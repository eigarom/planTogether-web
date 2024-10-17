const express = require("express");
const router = express.Router();
const HttpError = require("../error/HttpError");
const FamilyQueries = require("../queries/FamilyQueries");

router.post("/", (req, res, next) => {
    const name = req.body.name;
    if (!name || name === "") {
        return next(new HttpError(400, `Le champ nom est requis`));
    }

    const newFamily = {
        name: "" + name,
        color: "" + req.body.color,
        imageContent: "" + req.body.imageContent,
        imageContentType: "" + req.body.imageContentType,
        inviteCode: "" + req.body.inviteCode,
        inviteExpirationDate: "" + req.body.inviteExpirationDate,
    };

    FamilyQueries.insertFamily(newFamily)
        .then((family) => {
            res.json(family);
        })
        .catch((err) => {
            return next(err);
        });
});

module.exports = router;