/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_6xgTlEkOlR` ON `student_logs` (\n  `date`,\n  `student`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2553608578")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
