/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2158022801")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2907260911",
    "hidden": false,
    "id": "relation886886774",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "person",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2502012209",
    "hidden": false,
    "id": "relation14597239",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "emotion",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2158022801")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2907260911",
    "hidden": false,
    "id": "relation886886774",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "person",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2502012209",
    "hidden": false,
    "id": "relation14597239",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "emotion",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
