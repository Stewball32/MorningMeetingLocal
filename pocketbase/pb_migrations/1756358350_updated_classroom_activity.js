/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_844190096")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_IsRf98owbD` ON `presentation_activity` (\n  `slide`,\n  `presentation`\n)"
    ],
    "name": "presentation_activity"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_844190096")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_IsRf98owbD` ON `classroom_activity` (\n  `slide`,\n  `presentation`\n)"
    ],
    "name": "classroom_activity"
  }, collection)

  return app.save(collection)
})
