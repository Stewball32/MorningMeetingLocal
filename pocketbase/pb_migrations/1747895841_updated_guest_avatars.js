/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_423132189")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_UJLcWE3gXq` ON `icons` (\n  `name`,\n  `emoji`\n)"
    ],
    "name": "icons"
  }, collection)

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool2073182358",
    "name": "for_guests",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool726321236",
    "name": "for_calendar",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_423132189")

  // update collection data
  unmarshal({
    "indexes": [],
    "name": "guest_avatars"
  }, collection)

  // remove field
  collection.fields.removeById("bool2073182358")

  // remove field
  collection.fields.removeById("bool726321236")

  return app.save(collection)
})
