import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { AccessLevel } from "../commonFunctions.js";
import { Octokit } from "@octokit/rest";

export const command = {
    data: new SlashCommandBuilder()
        .setName("release")
        .setDescription("Get the latest release from the Strato repository"),
    level: AccessLevel.User,
    async execute(interaction: ChatInputCommandInteraction) {
        const octokit = new Octokit();

        try{
            let release = await octokit.request("GET /repos/{owner}/{repo}/releases/latest", {
                owner: "strato-emu",
                repo: "strato",
            });

            if (release.data.assets[0] == undefined)
                return interaction.reply({ content: "No build attached to this release", ephemeral: true });
    
            let embed = new EmbedBuilder({
                "title": release.data.name ? release.data.name : release.data.tag_name,
                "description": release.data.body!,
                "url": release.data.html_url,
                "footer": {
                    text: release.data.tag_name,
                    icon_url: "https://raw.githubusercontent.com/strato-emu/branding/master/logo/strato-logo.png",
                },
                timestamp: Date.parse(release.data.created_at),
                "author": {
                    // We use this as a psuedo-heading rather than as an actual authorship field
                    "name": "Latest Strato Release Build",
                    "icon_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                },
                "fields": [{
                    "name": "Release Build",
                    "value": `[Download APK](${release.data.assets[0].browser_download_url})`
                }]
            });
    
            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            return interaction.reply({ content: "No releases found on the repository", ephemeral: true });
        }

        
    }
};
