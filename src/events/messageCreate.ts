import { Events, Message } from "discord.js";
import { isNormalUser } from "../commonFunctions.js";

export const event = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // Attachment-only channel filter (for messages)
        if (JSON.parse(process.env.ATTACHMENT_ONLY_CHANNELS!).includes(message.channel.id) && isNormalUser(message.author, message.guild!) && !message.author.bot && message.attachments.size == 0 && !message.content.includes("http://") && !message.content.includes("https://")) {
            let longDeleteTime = 3 * Number(process.env.DELETE_TIME);    
            let response = await message.reply(`Chatting is not allowed in this channel, your message will be deleted in ${(longDeleteTime)/1000}s`);
            setTimeout(async () => {
                try{
                    await response.delete();
                    await message.delete();
                } catch (err) {
                    console.log("User message in attachment-only channel has already been deleted");
                }
            }, longDeleteTime);
        }
    }
};
