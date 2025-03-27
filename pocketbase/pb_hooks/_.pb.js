/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Event Hooks Template
 * Automatically logs event data for debugging.
 */

/**
 * Fires after a record is successfully created.
 * @param {core.record.idEvent} e
 */
onRecordAfterCreateSuccess((e) => {
	console.log("✅ Record Created:", e.record.id);
	e.next();
});

/**
 * Fires after a record update succeeds.
 * @param {core.record.idEvent} e
 */
onRecordAfterUpdateSuccess((e) => {
	console.log("✅ Record Updated:", e.record.id);
	e.next();
});

/**
 * Fires after a record deletion succeeds.
 * @param {core.record.idEvent} e
 */
onRecordAfterDeleteSuccess((e) => {
	console.log("❌ Record Deleted:", e.record.id);
	e.next();
});

/**
 * Fires after a collection is successfully created.
 * @param {core.collection.idEvent} e
 */
onCollectionAfterCreateSuccess((e) => {
	console.log("📂 Collection Created:", e.collection.id);
	e.next();
});

/**
 * Fires after a collection update succeeds.
 * @param {core.collection.idEvent} e
 */
onCollectionAfterUpdateSuccess((e) => {
	console.log("📂 Collection Updated:", e.collection.id);
	e.next();
});

/**
 * Fires after a collection is successfully deleted.
 * @param {core.collection.idEvent} e
 */
onCollectionAfterDeleteSuccess((e) => {
	console.log("🗑️ Collection Deleted:", e.collection.id);
	e.next();
});

/**
 * Fires after a backup is created.
 * @param {core.BackupEvent} e
 */
onBackupCreate((e) => {
	console.log("💾 Backup Created:", e);
	e.next();
});

/**
 * Fires after a backup is restored.
 * @param {core.BackupEvent} e
 */
onBackupRestore((e) => {
	console.log("🔄 Backup Restored:", e);
	e.next();
});

/**
 * Fires on system bootstrap.
 * @param {core.BootstrapEvent} e
 */
onBootstrap((e) => {
	console.log("🚀 PocketBase Bootstrapped");
	e.next();
});

/**
 * Fires when PocketBase is shutting down.
 * @param {core.TerminateEvent} e
 */
onTerminate((e) => {
	console.log("🛑 PocketBase Terminating");
	e.next();
});

/**
 * Fires on an authentication request.
 * @param {core.record.idAuthRequestEvent} e
 */
onRecordAuthRequest((e) => {
	console.log("🔐 Auth Request:", e);
	e.next();
});

/**
 * Fires after an authentication refresh.
 * @param {core.record.idAuthRefreshRequestEvent} e
 */
onRecordAuthRefreshRequest((e) => {
	console.log("🔄 Auth Refreshed:", e);
	e.next();
});

/**
 * Fires before a collection view request.
 * @param {core.collection.idRequestEvent} e
 */
onCollectionViewRequest((e) => {
	console.log("👀 Collection View Requested:", e);
	e.next();
});

/**
 * Fires before a record view request.
 * @param {core.record.idRequestEvent} e
 */
onRecordViewRequest((e) => {
	console.log("👀 Record View Requested:", e);
	e.next();
});

/**
 * Fires when a real-time connection is requested.
 * @param {core.RealtimeConnectRequestEvent} e
 */
onRealtimeConnectRequest((e) => {
	console.log("📡 Realtime Connection Requested:", e);
	e.next();
});

/**
 * Fires when a real-time subscription request occurs.
 * @param {core.RealtimeSubscribeRequestEvent} e
 */
onRealtimeSubscribeRequest((e) => {
	console.log("📡 Subscribed to Realtime:", e);
	e.next();
});

/**
 * Fires when a real-time message is sent.
 * @param {core.RealtimeMessageEvent} e
 */
onRealtimeMessageSend((e) => {
	console.log("📨 Realtime Message Sent:", e);
	e.next();
});
