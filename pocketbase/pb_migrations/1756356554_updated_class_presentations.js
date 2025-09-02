/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3886664695")

  // update collection data
  unmarshal({
    "name": "presentations"
  }, collection)

  // remove field
  collection.fields.removeById("relation1232941213")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3886664695")

  // update collection data
  unmarshal({
    "name": "class_presentations"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2478702895",
    "hidden": false,
    "id": "relation1232941213",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "classroom",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
