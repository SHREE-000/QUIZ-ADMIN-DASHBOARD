import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Define the User interface
export interface IUser extends Document {
  email: string;
  username: string;
  isActive: boolean;
  isAdmin: boolean;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2️⃣ Define the schema
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 3️⃣ Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(this.password, saltOrRounds);
  this.password = hashedPassword;
});

// 4️⃣ Instance method for comparing passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5️⃣ Prevent model overwrite in Next.js hot-reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
