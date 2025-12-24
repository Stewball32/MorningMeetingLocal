/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2158022801")

  // update collection data
  unmarshal({
    "name": "emotion_overrides"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2158022801")

  // update collection data
  unmarshal({
    "name": "emotions_override"
  }, collection)

  return app.save(collection)
})
