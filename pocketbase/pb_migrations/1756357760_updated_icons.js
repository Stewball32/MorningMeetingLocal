/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_423132189")

  // remove field
  collection.fields.removeById("bool2073182358")

  // remove field
  collection.fields.removeById("bool726321236")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json3565825916",
    "maxSize": 0,
    "name": "config",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_423132189")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2073182358",
    "name": "for_guests",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool726321236",
    "name": "for_calendar",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("json3565825916")

  return app.save(collection)
})
