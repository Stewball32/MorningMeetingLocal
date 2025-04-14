/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_6xgTlEkOlR` ON `student_dailies` (\n  `date`,\n  `student`\n)"
    ],
    "name": "student_dailies"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_6xgTlEkOlR` ON `student_entries` (\n  `date`,\n  `student`\n)"
    ],
    "name": "student_entries"
  }, collection)

  return app.save(collection)
})
