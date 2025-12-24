/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3607937828")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1874629670",
    "maxSelect": 3,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "guest",
      "calendar",
      "emotion"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3607937828")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1874629670",
    "maxSelect": 1,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "guest",
      "calendar",
      "emotion"
    ]
  }))

  return app.save(collection)
})
