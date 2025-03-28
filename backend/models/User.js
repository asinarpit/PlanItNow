const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { 
      type: String,
      required: function() {
        return this.provider === 'local';
      }
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    eventsParticipated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    resetPasswordToken: String,
    resetPasswordExpire: Number,
    deviceTokens: [{ type: String }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.provider !== 'local') return next();
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude the password field when converting to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
