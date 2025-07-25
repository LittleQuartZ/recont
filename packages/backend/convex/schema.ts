import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  counters: defineTable({
    name: v.string(),
    count: v.number(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
