const express = require("express")
const router = express.Router()
const { create, getAllLocations } = require("../controllers/gameController")

router.post("/create", create)
router.get("/locations", getAllLocations)

module.exports = router
