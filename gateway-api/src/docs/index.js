const authDocs = require("./auth.docs");
const chatDocs = require("./chat.docs");
const historyDocs = require("./history.docs");
const profileDocs = require("./profile.docs");

module.exports = {
  paths: {
    ...authDocs,
    ...chatDocs,
    ...historyDocs,
    ...profileDocs,
  },
};