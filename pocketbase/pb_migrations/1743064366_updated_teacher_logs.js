/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // remove field
  collection.fields.removeById("date2862495610")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2862495610",
    "max": 0,
    "min": 0,
    "name": "date",
    "pattern": "^\\d{4}-(\\d{1,2})-(\\d{1,2})$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("text2862495610")

  return app.save(collection)
})
