const Locations = require('../models/locationModel')
const slugify = require("slugify")

exports.create = (req, res) => {
  const { name, imageURL, roles } = req.body
  let slug = slugify(name)
  switch (true) {
    case !name:
      return res.status(400).json({ error: "Please Input Name" })
      break;
    case !imageURL:
      return res.status(400).json({ error: "Please Input ImageURL" })
      break;
  }
  Locations.create({ name, imageURL, roles, slug }).then((locations) => {
    res.json(locations)
  }).catch(err => {
    res.status(400).json({ error: err })
  })

}

exports.getAllLocations = (req, res) => {
  Locations.find({}).exec().then(result => {
    res.json({ result })
  }).catch(error => {
    console.log(error)
  })
}
