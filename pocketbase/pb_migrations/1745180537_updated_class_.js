/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2123897706")

  // update collection data
  unmarshal({
    "name": "class_dailies"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1928326754",
    "max": null,
    "min": null,
    "name": "slide",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2123897706")

  // update collection data
  unmarshal({
    "name": "class_"
  }, collection)

  // remove field
  collection.fields.removeById("number1928326754")

  // remove field
  collection.fields.removeById("number336246304")

  return app.save(collection)
})
