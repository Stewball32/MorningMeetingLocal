/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // update collection data
  unmarshal({
    "name": "people"
  }, collection)

  // remove field
  collection.fields.removeById("text700514382")

  // remove field
  collection.fields.removeById("number270228525")

  // remove field
  collection.fields.removeById("number4200986293")

  // remove field
  collection.fields.removeById("text1191818290")

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

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool2897713717",
    "name": "guest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "json3565825916",
    "maxSize": 0,
    "name": "config",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "json2918445923",
    "maxSize": 0,
    "name": "data",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // update collection data
  unmarshal({
    "name": "teachers"
  }, collection)

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text700514382",
    "max": 0,
    "min": 0,
    "name": "video_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number270228525",
    "max": null,
    "min": 0,
    "name": "video_start",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number4200986293",
    "max": null,
    "min": 0,
    "name": "video_end",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1191818290",
    "max": 0,
    "min": 0,
    "name": "birthday",
    "pattern": "^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("number3890873463")

  // remove field
  collection.fields.removeById("number921739630")

  // remove field
  collection.fields.removeById("bool2897713717")

  // remove field
  collection.fields.removeById("json3565825916")

  // remove field
  collection.fields.removeById("json2918445923")

  return app.save(collection)
})
