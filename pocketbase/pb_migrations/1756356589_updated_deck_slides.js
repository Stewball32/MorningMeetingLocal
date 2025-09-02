/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_537142831")

  // update collection data
  unmarshal({
    "name": "slides"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_537142831")

  // update collection data
  unmarshal({
    "name": "deck_slides"
  }, collection)

  return app.save(collection)
})
