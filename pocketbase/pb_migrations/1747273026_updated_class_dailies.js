/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2123897706")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json1856610630",
    "maxSize": 0,
    "name": "calendar",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2123897706")

  // remove field
  collection.fields.removeById("json1856610630")

  return app.save(collection)
})
