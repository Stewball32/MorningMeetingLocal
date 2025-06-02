/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // remove field
  collection.fields.removeById("bool4257000983")

  // add field
  collection.fields.addAt(3, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool4257000983",
    "name": "present",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("select2971371416")

  return app.save(collection)
})
