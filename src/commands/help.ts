import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { AccessLevel, logToFile, userHasAccess } from "../commonFunctions.js";
import fs from "node:fs";

export const command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Recieve this help embed in DMs"),
    level: AccessLevel.User,
    async execute(interaction: ChatInputCommandInteraction) {
        let embed = new EmbedBuilder({ title: "**Strato Bot Commands**" }).setColor("Green");

        const commandFiles = fs.readdirSync("./build/commands").filter(file => file.endsWith(".js"));

        for (const file of commandFiles){
            const { command } = await import(`./${file}`);
            if (userHasAccess(interaction.user, interaction.guild!, command.level)){
                embed.addFields({ name: command.data.name, value: command.data.description, inline: false});
            }
        }
        if (process.env.DM_RESPONSES == "true") {
            try {
                await interaction.user.send({ embeds: [embed] });
                await interaction.reply({ content: "Check DMs", ephemeral: true });
                await interaction.deleteReply();
            } catch (error) {
                logToFile(`Cannot send messages to ${interaction.user.tag}; replying ephemerally`);
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    }
};
