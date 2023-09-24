import { EmbedBuilder, Events, Message } from "discord.js";
import { isNormalUser, selfDelete } from "../commonFunctions.js";
import fs from "node:fs";
import https from "https";
import Zip from "adm-zip";

export const event = {
    name: Events.MessageCreate,
    execute(message: Message) {
        // Showcase and save-files channel filter (for messages)
        if (JSON.parse(process.env.SHOWCASE_CHANNELS!).includes(message.channel.id) && isNormalUser(message.author, message.guild!) && !message.author.bot && message.attachments.size == 0 && !message.content.includes("http://") && !message.content.includes("https://"))
            return selfDelete(message, `Chatting is not allowed in showcase channels, your message will be deleted in ${3 * Number(process.env.DELETE_TIME)/1000}s`);
        // REVERT BELOW COMMENT ----------------------------------------------------------V
        if (JSON.parse(process.env.SAVEFILES_CHANNELS!).includes(message.channel.id) /* && isNormalUser(message.author, message.guild!) */ && !message.author.bot) {
            let embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Incorrect message format")
                .setDescription("All messages in <#1106383674225725440> must be following these rules:\n* There can only be one attachment on the message, a .zip file\n* The .zip file can only contain one folder named after the game's title ID\n* All save data must be contained within the folder in the root directory")
                .setFooter({text: `Your message will be deleted in ${3 * Number(process.env.DELETE_TIME)/1000}s`}); 
            if (message.attachments.size == 1) {
                let fileURL = message.attachments.first()!.url;
                if (fileURL.indexOf("zip", fileURL.length - "zip".length) != -1) {
                    https.get(fileURL, (res) => { 
                        const filePath = fs.createWriteStream(`${process.cwd()}/savefile.zip`);
                        res.pipe(filePath);
                        filePath.on('finish', () => {
                            filePath.close();
                            let zip = new Zip(`${process.cwd()}/savefile.zip`);
                            fs.rmSync(`${process.cwd()}/temp`, {recursive: true, force: true});
                            zip.extractAllTo(`${process.cwd()}/temp`, true);
                            fs.readdir(`${process.cwd()}/temp`, (err, files) => {
                                if (files.length != 1 || !(/^0100[\dA-Fa-f]{12}$/).test(files[0])) 
                                    return selfDelete(message, ``, embed);
                            });
                        })
                    })
                } else {
                    return selfDelete(message, ``, embed);
                }
            } else {
                return selfDelete(message, ``, embed);
            }
        }
    }
};
