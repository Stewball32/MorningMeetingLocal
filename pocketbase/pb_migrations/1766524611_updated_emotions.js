/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2502012209")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1874629670",
    "maxSelect": 9,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "positive",
      "neutral",
      "negative",
      "mild",
      "moderate",
      "severe",
      "health",
      "simple",
      "complex"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2502012209")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1874629670",
    "maxSelect": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "positive",
      "neutral",
      "negative",
      "mild",
      "moderate",
      "severe",
      "health",
      "simple",
      "complex"
    ]
  }))

  return app.save(collection)
})
