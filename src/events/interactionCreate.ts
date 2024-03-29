import { Events, GuildTextBasedChannel, Interaction } from "discord.js";
import { isNormalUser, logToFile } from "../commonFunctions.js";

export const event = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        logToFile(`${interaction.user.tag} used the /${interaction.commandName} command in #${(interaction.channel as GuildTextBasedChannel).name}`);

        //Showcase and save-files channel filter (for commands)
        if (JSON.parse(process.env.SHOWCASE_CHANNELS!).includes(interaction.channel!.id) && isNormalUser(interaction.user, interaction.guild!))
            return interaction.reply({ content: "Commands cannot be used in showcase channels", ephemeral: true });
        if (JSON.parse(process.env.SAVEFILES_CHANNELS!).includes(interaction.channel!.id) && isNormalUser(interaction.user, interaction.guild!))
            return interaction.reply({ content: "Commands cannot be used in save-files channels", ephemeral: true });

        //If it's a command, execute it
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }
};
