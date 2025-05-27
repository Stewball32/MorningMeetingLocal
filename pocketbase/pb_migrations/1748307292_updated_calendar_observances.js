/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_326962381")

  // remove field
  collection.fields.removeById("json168010472")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json3256082920",
    "maxSize": 0,
    "name": "dates",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_326962381")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json168010472",
    "maxSize": 0,
    "name": "reccurence_rules",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json3256082920",
    "maxSize": 0,
    "name": "fixed_dates",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
