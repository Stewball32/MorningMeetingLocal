/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "",
    "deleteRule": "",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2862495610",
        "max": 0,
        "min": 0,
        "name": "date",
        "pattern": "^\\d{4}-(\\d{1,2})-(\\d{1,2})$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2056856411",
        "max": 0,
        "min": 0,
        "name": "guest_name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text709616437",
        "max": 0,
        "min": 0,
        "name": "avatar_str",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select2971371416",
        "maxSelect": 1,
        "name": "here",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "present",
          "absent"
        ]
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_155896558",
        "hidden": false,
        "id": "relation1225036535",
        "maxSelect": 999,
        "minSelect": 0,
        "name": "feelings",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_4221468678",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_SKPwrroDQD` ON `guest_dailies` (\n  `date`,\n  `guest_name`,\n  `avatar_str`\n)"
    ],
    "listRule": "",
    "name": "guest_dailies",
    "system": false,
    "type": "base",
    "updateRule": "",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4221468678");

  return app.delete(collection);
})
