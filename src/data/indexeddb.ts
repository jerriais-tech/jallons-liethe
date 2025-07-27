import { openDB } from "idb";

const CURRENT_VERSION = 1;

const db = await openDB("jallons-liethe", CURRENT_VERSION, {
  upgrade(db) {
    const store = db.createObjectStore("cards", { keyPath: "hash" });
    store.createIndex("nextScheduledAssessment", "nextScheduledAssessment");
  },
});

export default db;
