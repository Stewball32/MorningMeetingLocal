/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4221468678")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_SKPwrroDQD` ON `guest_dailies` (\n  `date`,\n  `guest_name`,\n  `avatar`\n)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("text709616437")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_423132189",
    "hidden": false,
    "id": "relation376926767",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "avatar",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4221468678")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_SKPwrroDQD` ON `guest_dailies` (\n  `date`,\n  `guest_name`,\n  `avatar_str`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text709616437",
    "max": 0,
    "min": 0,
    "name": "avatar_str",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("relation376926767")

  return app.save(collection)
})
