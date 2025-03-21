/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_856668217")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select1287425730",
    "maxSelect": 1,
    "name": "pronoun",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "he",
      "she"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_856668217")

  // remove field
  collection.fields.removeById("text1579384326")

  // remove field
  collection.fields.removeById("select1287425730")

  return app.save(collection)
})
