import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("counters").collect();
  },
});

export const getOne = query({
  args: {
    id: v.id("counters"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const newCounterId = await ctx.db.insert("counters", {
      name,
      count: 0,
    });
    return await ctx.db.get(newCounterId);
  },
});

export const set = mutation({
  args: {
    id: v.id("counters"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const counter = await ctx.db.get(args.id);

    if (!counter) {
      return { success: false, error: "Counter not found" };
    }

    await ctx.db.patch(args.id, { count: args.count });
    return { success: true };
  },
});

export const rename = mutation({
  args: {
    id: v.id("counters"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const counter = await ctx.db.get(args.id);

    if (!counter) {
      return { success: false, error: "Counter not found" };
    }

    await ctx.db.patch(args.id, { name: args.name });
    return { success: true };
  },
});

export const deleteCounter = mutation({
  args: {
    id: v.id("counters"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
