/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_856668217")

  // update collection data
  unmarshal({
    "name": "students"
  }, collection)

  // remove field
  collection.fields.removeById("select1466534506")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_856668217")

  // update collection data
  unmarshal({
    "name": "persons"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "teacher",
      "student"
    ]
  }))

  return app.save(collection)
})
