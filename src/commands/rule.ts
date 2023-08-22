import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { AccessLevel } from "../commonFunctions.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("rule")
        .setDescription("Sends an embed that corresponds to a rule")
        .addIntegerOption(option =>
            option
                .setName("index")
                .setDescription("Index of the rule to retrieve")
                .setRequired(true)),
    level: AccessLevel.User,
    async execute(interaction: ChatInputCommandInteraction) {
        let ruleId = interaction.options.getInteger("index");
    	let embed = new EmbedBuilder().setColor("Red");
        switch (ruleId) {
            case 1:
                embed.setTitle("1️⃣ Piracy is completely prohibited");
                embed.setDescription(`Asking, linking or helping someone download ROMs or other copyrighted content in any way is NOT allowed. Failing to comply will result in losing access to emulation-related channels.`);
                break;

            case 2:
                embed.setTitle("2️⃣ Be respectful toward other people");
                embed.setDescription(`Be respectful toward other people. It's fine to disagree, it's not fine to insult or attack other people.
                * You may disagree with anyone or anything you like, but you should try to keep it to opinions, and not people.
                * The use of derogatory slurs (Racist, sexist, homophobic, transphobic, etc) is not allowed.`);
                break;

            case 3:
                embed.setTitle("3️⃣ Spamming is not allowed");
                embed.setDescription(`If you do have rather lengthy messages you want to send, and you feel like it might be considered spam, please do so in <#1109121227286659133>.`);
                break;

            case 4:
                embed.setTitle("4️⃣ Please keep offtopic conversations in ⁠<#1104386571664371842>.");
                break;

            case 5:
                embed.setTitle("5️⃣ Please keep the discussion in English");
                embed.setDescription(`This ensures a common medium to communicate and eases understanding for other server members.`);
                break;
                
            case 6:
                embed.setTitle("6️⃣ Do not distribute or discuss custom builds");
                embed.setDescription(`If you made changes to the emulator that you want to showcase, you can do so in ⁠<#1105607582560829511> or <#⁠1104386537975713832>, but clearly label the post as a custom build.`);
                break;
                
            default:
                return interaction.reply({ content: "The specified rule wasn't recognized", ephemeral: true });
        }
        embed.setFooter({ text: "Multiple violations of the above rules may lead to temporary and eventually permanent mutes."});
    	interaction.reply({embeds: [embed]});
    }
};
