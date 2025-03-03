import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db.query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (existingUser) {
            console.log("User already exists:", existingUser);
            return existingUser._id;
        }

        // Insert new user and return _id
        const newUserId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            picture: args.picture,
            uid: args.uid,
        });

        console.log("Created new user:", newUserId);
        return newUserId; 
    },
});

export const GetUser=query({
    args:{
        email: v.string()
    },
    handler: async(ctx, args) => {
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), args.email)).collect();
        return user[0];
    }
})