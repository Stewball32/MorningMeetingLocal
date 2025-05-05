/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4221468678")

  // remove field
  collection.fields.removeById("select2971371416")

  // remove field
  collection.fields.removeById("relation1225036535")

  // add field
  collection.fields.addAt(5, new Field({
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
  const collection = app.findCollectionByNameOrId("pbc_4221468678")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2971371416",
    "maxSelect": 1,
    "name": "here",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "present",
      "absent"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
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
