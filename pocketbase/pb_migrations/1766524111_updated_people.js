/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2502012209",
    "hidden": false,
    "id": "relation3580884264",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "emotions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // remove field
  collection.fields.removeById("relation3580884264")

  return app.save(collection)
})
