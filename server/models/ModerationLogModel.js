const mongoose = require("mongoose");

const ModerationLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["BLOCK", "UNBLOCK", "APPEAL_REVIEWED"],
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ModerationLog", ModerationLogSchema);
