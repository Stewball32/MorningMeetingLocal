/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dJXML46Z9Y` ON `teacher_logs` (\n  `date`,\n  `teacher`\n)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("relation3072569139")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2907260911",
    "hidden": false,
    "id": "relation2968954581",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "teacher",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dJXML46Z9Y` ON `teacher_logs` (\n  `date`,\n  `student`\n)"
    ]
  }, collection)

  // add field
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

  // remove field
  collection.fields.removeById("relation2968954581")

  return app.save(collection)
})
