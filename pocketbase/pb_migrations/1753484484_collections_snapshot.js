/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const snapshot = [
    {
      "createRule": null,
      "deleteRule": null,
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
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1582905952",
          "max": 0,
          "min": 0,
          "name": "method",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_2279338944",
      "indexes": [
        "CREATE INDEX `idx_mfas_collectionRef_recordRef` ON `_mfas` (collectionRef,recordRef)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_mfas",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": null,
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
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 8,
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 0,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "",
          "hidden": true,
          "id": "text3866985172",
          "max": 0,
          "min": 0,
          "name": "sentTo",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_1638494021",
      "indexes": [
        "CREATE INDEX `idx_otps_collectionRef_recordRef` ON `_otps` (collectionRef, recordRef)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_otps",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
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
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2462348188",
          "max": 0,
          "min": 0,
          "name": "provider",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1044722854",
          "max": 0,
          "min": 0,
          "name": "providerId",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_2281828961",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_externalAuths_record_provider` ON `_externalAuths` (collectionRef, recordRef, provider)",
        "CREATE UNIQUE INDEX `idx_externalAuths_collection_provider` ON `_externalAuths` (collectionRef, provider, providerId)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_externalAuths",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
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
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4228609354",
          "max": 0,
          "min": 0,
          "name": "fingerprint",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_4275539003",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_authOrigins_unique_pairs` ON `_authOrigins` (collectionRef, recordRef, fingerprint)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_authOrigins",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "authAlert": {
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "Login from a new location"
        },
        "enabled": true
      },
      "authRule": "",
      "authToken": {
        "duration": 86400
      },
      "confirmEmailChangeTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Confirm your {APP_NAME} new email address"
      },
      "createRule": null,
      "deleteRule": null,
      "emailChangeToken": {
        "duration": 1800
      },
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
          "cost": 0,
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 8,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "[a-zA-Z0-9]{50}",
          "hidden": true,
          "id": "text2504183744",
          "max": 60,
          "min": 30,
          "name": "tokenKey",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "hidden": false,
          "id": "email3885137012",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": true,
          "system": true,
          "type": "email"
        },
        {
          "hidden": false,
          "id": "bool1547992806",
          "name": "emailVisibility",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "bool256245529",
          "name": "verified",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "fileToken": {
        "duration": 180
      },
      "id": "pbc_3142635823",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_tokenKey_pbc_3142635823` ON `_superusers` (`tokenKey`)",
        "CREATE UNIQUE INDEX `idx_email_pbc_3142635823` ON `_superusers` (`email`) WHERE `email` != ''"
      ],
      "listRule": null,
      "manageRule": null,
      "mfa": {
        "duration": 1800,
        "enabled": false,
        "rule": ""
      },
      "name": "_superusers",
      "oauth2": {
        "enabled": false,
        "mappedFields": {
          "avatarURL": "",
          "id": "",
          "name": "",
          "username": ""
        }
      },
      "otp": {
        "duration": 180,
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "OTP for {APP_NAME}"
        },
        "enabled": false,
        "length": 8
      },
      "passwordAuth": {
        "enabled": true,
        "identityFields": [
          "email"
        ]
      },
      "passwordResetToken": {
        "duration": 1800
      },
      "resetPasswordTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Reset your {APP_NAME} password"
      },
      "system": true,
      "type": "auth",
      "updateRule": null,
      "verificationTemplate": {
        "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Verify your {APP_NAME} email"
      },
      "verificationToken": {
        "duration": 259200
      },
      "viewRule": null
    },
    {
      "authAlert": {
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "Login from a new location"
        },
        "enabled": true
      },
      "authRule": "",
      "authToken": {
        "duration": 604800
      },
      "confirmEmailChangeTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Confirm your {APP_NAME} new email address"
      },
      "createRule": "",
      "deleteRule": "id = @request.auth.id",
      "emailChangeToken": {
        "duration": 1800
      },
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
          "cost": 0,
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 8,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "[a-zA-Z0-9]{50}",
          "hidden": true,
          "id": "text2504183744",
          "max": 60,
          "min": 30,
          "name": "tokenKey",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "hidden": false,
          "id": "email3885137012",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": true,
          "system": true,
          "type": "email"
        },
        {
          "hidden": false,
          "id": "bool1547992806",
          "name": "emailVisibility",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "bool256245529",
          "name": "verified",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1579384326",
          "max": 255,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "file376926767",
          "maxSelect": 1,
          "maxSize": 0,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "name": "avatar",
          "presentable": false,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": null,
          "type": "file"
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
      "fileToken": {
        "duration": 180
      },
      "id": "_pb_users_auth_",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)",
        "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''"
      ],
      "listRule": "id = @request.auth.id",
      "manageRule": null,
      "mfa": {
        "duration": 1800,
        "enabled": false,
        "rule": ""
      },
      "name": "users",
      "oauth2": {
        "enabled": false,
        "mappedFields": {
          "avatarURL": "avatar",
          "id": "",
          "name": "name",
          "username": ""
        }
      },
      "otp": {
        "duration": 180,
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "OTP for {APP_NAME}"
        },
        "enabled": false,
        "length": 8
      },
      "passwordAuth": {
        "enabled": true,
        "identityFields": [
          "email"
        ]
      },
      "passwordResetToken": {
        "duration": 1800
      },
      "resetPasswordTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Reset your {APP_NAME} password"
      },
      "system": false,
      "type": "auth",
      "updateRule": "id = @request.auth.id",
      "verificationTemplate": {
        "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Verify your {APP_NAME} email"
      },
      "verificationToken": {
        "duration": 259200
      },
      "viewRule": "id = @request.auth.id"
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "hidden": false,
          "id": "file376926767",
          "maxSelect": 1,
          "maxSize": 0,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "name": "avatar",
          "presentable": true,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": [],
          "type": "file"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2478702895",
          "hidden": false,
          "id": "relation3981121951",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "classroom",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "bool2287856061",
          "name": "hidden",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text700514382",
          "max": 0,
          "min": 0,
          "name": "video_id",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "number270228525",
          "max": null,
          "min": 0,
          "name": "video_start",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number4200986293",
          "max": null,
          "min": 0,
          "name": "video_end",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "select1287425730",
          "maxSelect": 1,
          "name": "pronoun",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "he",
            "she"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1191818290",
          "max": 0,
          "min": 0,
          "name": "birthday",
          "pattern": "^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json1070327867",
          "maxSize": 0,
          "name": "config",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_856668217",
      "indexes": [],
      "listRule": "",
      "name": "students",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "hidden": false,
          "id": "file376926767",
          "maxSelect": 1,
          "maxSize": 0,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "name": "avatar",
          "presentable": true,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": [],
          "type": "file"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2478702895",
          "hidden": false,
          "id": "relation3981121951",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "classroom",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "bool2287856061",
          "name": "hidden",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text700514382",
          "max": 0,
          "min": 0,
          "name": "video_id",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "number270228525",
          "max": null,
          "min": 0,
          "name": "video_start",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number4200986293",
          "max": null,
          "min": 0,
          "name": "video_end",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "select1287425730",
          "maxSelect": 1,
          "name": "pronoun",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "he",
            "she"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1191818290",
          "max": 0,
          "min": 0,
          "name": "birthday",
          "pattern": "^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
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
      "id": "pbc_2907260911",
      "indexes": [],
      "listRule": "",
      "name": "teachers",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
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
          "id": "text3058431538",
          "max": 0,
          "min": 0,
          "name": "emoji",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text236760427",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "file3309110367",
          "maxSelect": 1,
          "maxSize": 0,
          "mimeTypes": [],
          "name": "image",
          "presentable": false,
          "protected": false,
          "required": true,
          "system": false,
          "thumbs": [],
          "type": "file"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2478702895",
          "hidden": false,
          "id": "relation1232941213",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "classroom",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "bool2073182358",
          "name": "for_guests",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "bool726321236",
          "name": "for_calendar",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
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
      "id": "pbc_423132189",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_UJLcWE3gXq` ON `class_icons` (\n  `name`,\n  `emoji`,\n  `classroom`\n)"
      ],
      "listRule": "",
      "name": "class_icons",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
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
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_423132189",
          "hidden": false,
          "id": "relation1704208859",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "icon",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2478702895",
          "hidden": false,
          "id": "relation2516147650",
          "maxSelect": 999,
          "minSelect": 0,
          "name": "classrooms",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "select2363381545",
          "maxSelect": 1,
          "name": "type",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "public",
            "bank",
            "school",
            "optional",
            "observance"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1843675174",
          "max": 0,
          "min": 0,
          "name": "description",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "bool458715613",
          "name": "hidden",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "json3256082920",
          "maxSize": 0,
          "name": "dates",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select4187937467",
          "maxSelect": 1,
          "name": "school_day",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "none",
            "min",
            "full"
          ]
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
      "id": "pbc_326962381",
      "indexes": [],
      "listRule": "",
      "name": "calendar",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
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
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1587448267",
          "max": 0,
          "min": 0,
          "name": "location",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json3565825916",
          "maxSize": 0,
          "name": "config",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "bool2287856061",
          "name": "hidden",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
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
      "id": "pbc_2478702895",
      "indexes": [],
      "listRule": "",
      "name": "classrooms",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
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
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "select2363381545",
          "maxSelect": 1,
          "name": "component",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "attendance",
            "calendar",
            "title",
            "video",
            "addition",
            "subtraction",
            "multiplication",
            "poll",
            "quiz"
          ]
        },
        {
          "hidden": false,
          "id": "bool2287856061",
          "name": "hidden",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "json35658259162",
          "maxSize": 0,
          "name": "config",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json3565825916",
          "maxSize": 0,
          "name": "data",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_537142831",
      "indexes": [],
      "listRule": "",
      "name": "deck_slides",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "cascadeDelete": false,
          "collectionId": "pbc_3886664695",
          "hidden": false,
          "id": "relation2607212691",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "presentation",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_537142831",
          "hidden": false,
          "id": "relation1928326754",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "slide",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2918445923",
          "maxSize": 0,
          "name": "data",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_844190096",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_IsRf98owbD` ON `classroom_activity` (\n  `slide`,\n  `presentation`\n)"
      ],
      "listRule": "",
      "name": "classroom_activity",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "cascadeDelete": false,
          "collectionId": "pbc_856668217",
          "hidden": false,
          "id": "relation3072569139",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "student",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3886664695",
          "hidden": false,
          "id": "relation2607212691",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "presentation",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_537142831",
          "hidden": false,
          "id": "relation1928326754",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "slide",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2918445923",
          "maxSize": 0,
          "name": "data",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_617737500",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_GyzNQzvUFf` ON `student_activity` (\n  `student`,\n  `slide`,\n  `presentation`\n)"
      ],
      "listRule": "",
      "name": "student_activity",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "cascadeDelete": false,
          "collectionId": "pbc_2047001084",
          "hidden": false,
          "id": "relation2897713717",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "guest",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3886664695",
          "hidden": false,
          "id": "relation2607212691",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "presentation",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_537142831",
          "hidden": false,
          "id": "relation1928326754",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "slide",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2918445923",
          "maxSize": 0,
          "name": "data",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_1841266520",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_XAMrkKFKjF` ON `guest_activity` (\n  `guest`,\n  `slide`,\n  `presentation`\n)"
      ],
      "listRule": "",
      "name": "guest_activity",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "cascadeDelete": false,
          "collectionId": "pbc_2907260911",
          "hidden": false,
          "id": "relation2968954581",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "teacher",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3886664695",
          "hidden": false,
          "id": "relation2607212691",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "presentation",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_537142831",
          "hidden": false,
          "id": "relation1928326754",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "slide",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2918445923",
          "maxSize": 0,
          "name": "data",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_18412665202",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_FUvCXpNhUA` ON `teacher_activity` (\n  `teacher`,\n  `slide`,\n  `presentation`\n)"
      ],
      "listRule": "",
      "name": "teacher_activity",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
      "createRule": "",
      "deleteRule": null,
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
          "cascadeDelete": false,
          "collectionId": "pbc_423132189",
          "hidden": false,
          "id": "relation376926767",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "avatar",
          "presentable": true,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2478702895",
          "hidden": false,
          "id": "relation1232941213",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "classroom",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "select1466534506",
          "maxSelect": 1,
          "name": "role",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "student",
            "teacher"
          ]
        },
        {
          "hidden": false,
          "id": "bool2287856061",
          "name": "hidden",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "select1287425730",
          "maxSelect": 1,
          "name": "pronoun",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "he",
            "she"
          ]
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
      "id": "pbc_2047001084",
      "indexes": [],
      "listRule": "",
      "name": "guests",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
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
          "id": "text1579384326",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_537142831",
          "hidden": false,
          "id": "relation3099598993",
          "maxSelect": 999,
          "minSelect": 0,
          "name": "slides",
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
      "id": "pbc_3531879269",
      "indexes": [],
      "listRule": "",
      "name": "decks",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    },
    {
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
          "cascadeDelete": false,
          "collectionId": "pbc_3531879269",
          "hidden": false,
          "id": "relation1336686135",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "deck",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2478702895",
          "hidden": false,
          "id": "relation1232941213",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "classroom",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
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
        },
        {
          "hidden": false,
          "id": "json2918445923",
          "maxSize": 0,
          "name": "data",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
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
      "id": "pbc_3886664695",
      "indexes": [],
      "listRule": "",
      "name": "class_presentations",
      "system": false,
      "type": "base",
      "updateRule": "",
      "viewRule": ""
    }
  ];

  return app.importCollections(snapshot, false);
}, (app) => {
  return null;
})
