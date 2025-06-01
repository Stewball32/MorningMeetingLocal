/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // remove field
  collection.fields.removeById("relation1225036535")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json1843596689",
    "maxSize": 0,
    "name": "attendance",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_155896558",
    "hidden": false,
    "id": "relation1225036535",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "feelings",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("json1843596689")

  return app.save(collection)
})
