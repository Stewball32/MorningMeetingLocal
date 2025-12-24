/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // remove field
  collection.fields.removeById("number3890873463")

  // remove field
  collection.fields.removeById("number921739630")

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number3890873463",
    "max": null,
    "min": null,
    "name": "bday_month",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number921739630",
    "max": null,
    "min": null,
    "name": "bday_day",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("select1466534506")

  return app.save(collection)
})
