/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_856668217",
    "hidden": false,
    "id": "relation3072569139",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "student",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // remove field
  collection.fields.removeById("relation1225036535")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_856668217",
    "hidden": false,
    "id": "relation3072569139",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "student",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
