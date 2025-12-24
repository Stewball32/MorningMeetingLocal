/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_423132189")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_UJLcWE3gXq` ON `icons` (\n  `name`,\n  `emoji`,\n  `classroom`\n)"
    ],
    "name": "icons"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_423132189")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_UJLcWE3gXq` ON `class_icons` (\n  `name`,\n  `emoji`,\n  `classroom`\n)"
    ],
    "name": "class_icons"
  }, collection)

  return app.save(collection)
})
