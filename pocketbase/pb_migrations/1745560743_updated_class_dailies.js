/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2123897706")

  // remove field
  collection.fields.removeById("number336246304")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2123897706")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number336246304",
    "max": null,
    "min": null,
    "name": "page",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
