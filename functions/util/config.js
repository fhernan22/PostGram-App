const functions = require("firebase-functions");

module.exports = {
  apiKey: functions.config().config.api_key,
  authDomain: functions.config().auth_domain,
  projectId: functions.config().project_id,
  storageBucket: functions.config().storage_bucket,
  messagingSenderId: functions.config().messaging_id,
  appId: functions.config().app_id,
  measurementId: functions.config().measurement_id,
};
