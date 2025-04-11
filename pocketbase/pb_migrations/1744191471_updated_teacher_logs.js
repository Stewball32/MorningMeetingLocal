/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dJXML46Z9Y` ON `teacher_entries` (\n  `date`,\n  `teacher`\n)"
    ],
    "name": "teacher_entries"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2259412331")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dJXML46Z9Y` ON `teacher_logs` (\n  `date`,\n  `teacher`\n)"
    ],
    "name": "teacher_logs"
  }, collection)

  return app.save(collection)
})
