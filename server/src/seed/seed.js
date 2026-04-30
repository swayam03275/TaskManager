import dotenv from "dotenv";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { hashPassword } from "../utils/passwords.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@demo.com",
    passwordHash: await hashPassword("Password123!"),
    role: "admin",
  });

  const member = await User.create({
    name: "Member User",
    email: "member@demo.com",
    passwordHash: await hashPassword("Password123!"),
    role: "member",
  });

  const project = await Project.create({
    name: "Launch Website",
    description: "Marketing site launch",
    owner: admin._id,
    members: [
      { user: admin._id, role: "owner" },
      { user: member._id, role: "member" },
    ],
  });

  await Task.insertMany([
    {
      project: project._id,
      title: "Design landing page",
      description: "Create hero section and layout",
      status: "in_progress",
      priority: "high",
      assignee: member._id,
      createdBy: admin._id,
    },
    {
      project: project._id,
      title: "Set up analytics",
      status: "todo",
      priority: "medium",
      assignee: admin._id,
      createdBy: admin._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log("Seed complete");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Seed failed", error);
  mongoose.disconnect();
  process.exit(1);
});
