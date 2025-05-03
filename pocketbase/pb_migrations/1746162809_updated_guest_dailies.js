/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4221468678")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_SKPwrroDQD` ON `guest_dailies` (\n  `date`,\n  `name`,\n  `avatar`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(4, new Field({
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

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2056856411",
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4221468678")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_SKPwrroDQD` ON `guest_dailies` (\n  `date`,\n  `guest_name`,\n  `avatar`\n)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("select1287425730")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2056856411",
    "max": 0,
    "min": 0,
    "name": "guest_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
