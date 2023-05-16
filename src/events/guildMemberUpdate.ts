import { Events, GuildMember } from "discord.js";

export const event = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember: GuildMember, newMember: GuildMember) {
        let edge = newMember.guild.roles.cache.get(process.env.EDGE_ROLE!)!;
        let exEdge = newMember.guild.roles.cache.get(process.env.EX_EDGE_ROLE!)!;

        if (!oldMember.roles.cache.has(edge.id) && newMember.roles.cache.has(edge.id)) {
            await oldMember.roles.remove(exEdge);
        }
        if (oldMember.roles.cache.has(edge.id) && !newMember.roles.cache.has(edge.id)) {
            await oldMember.roles.add(exEdge);
        }
    }
};
