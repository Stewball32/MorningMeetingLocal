/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // remove field
  collection.fields.removeById("relation3981121951")

  // remove field
  collection.fields.removeById("bool2287856061")

  // remove field
  collection.fields.removeById("bool2897713717")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2478702895",
    "hidden": false,
    "id": "relation2516954544",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "classrooms_active",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2478702895",
    "hidden": false,
    "id": "relation3130712410",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "classrooms_guest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "student",
      "teacher"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2478702895",
    "hidden": false,
    "id": "relation3981121951",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "classroom",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2287856061",
    "name": "hidden",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool2897713717",
    "name": "guest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("relation2516954544")

  // remove field
  collection.fields.removeById("relation3130712410")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "student",
      "teacher"
    ]
  }))

  return app.save(collection)
})
