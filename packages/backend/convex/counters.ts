import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("counters")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .collect();
  },
});

export const getOne = query({
  args: {
    id: v.id("counters"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const counter = await ctx.db.get(id);

    if (!counter || counter.tokenIdentifier !== identity.tokenIdentifier) {
      throw new Error("Counter not found");
    }

    return counter;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const newCounterId = await ctx.db.insert("counters", {
      tokenIdentifier: identity.tokenIdentifier,
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const counter = await ctx.db.get(args.id);

    if (!counter || counter.tokenIdentifier !== identity.tokenIdentifier) {
      throw new Error("Counter not found");
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const counter = await ctx.db.get(args.id);

    if (!counter || counter.tokenIdentifier !== identity.tokenIdentifier) {
      throw new Error("Counter not found");
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const counter = await ctx.db.get(args.id);

    if (!counter || counter.tokenIdentifier !== identity.tokenIdentifier) {
      throw new Error("Counter not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
