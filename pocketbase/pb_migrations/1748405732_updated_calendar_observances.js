/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_326962381")

  // remove field
  collection.fields.removeById("bool3372590139")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select4187937467",
    "maxSelect": 1,
    "name": "school",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "none",
      "short",
      "full"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_326962381")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool3372590139",
    "name": "school_day",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("select4187937467")

  return app.save(collection)
})
