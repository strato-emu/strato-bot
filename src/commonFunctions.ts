import { Snowflake, User, Guild, Message } from "discord.js";
import fs from "node:fs";

/** This enumerates all of the access levels a user can have */
export enum AccessLevel {
    User = 0,
    Helper = 1,
    Moderator = 2,
    Admin = 3
}

/** 
 * @param string The string to test
 * @returns If the tested string is a snowflake or not
 */
export function isSnowflake(testString: string) {
    return (/^\d{17,19}$/.test(testString));
}

/** 
 * @param level The AccessLevel to lookup the role of
 * @returns The Snowflake that corresponds to the role of the supplied AccessLevel
 */
export function getAccessLevelRole(level: AccessLevel): Snowflake {
    let role = "";
    switch (level) {
        case AccessLevel.Admin:
            role = process.env.ADMIN_ROLE!;
            break;
        case AccessLevel.Moderator:
            role = process.env.MODERATOR_ROLE!;
            break;
        case AccessLevel.Helper:
            role = process.env.HELPER_ROLE!;
            break;
    }
    return role;
}

/** 
 * @param user The user to check the permissions of
 * @param guild The guild to check permissions in
 * @param level The access level to check if the user has
 * @returns If the supplied user has the specified access level in the specified guild 
 */
export function userHasAccess(user: User, guild: Guild, level: AccessLevel) {
    if (level == AccessLevel.User)
        return true;

    let roles = (guild?.members.cache.get(user.id)!!).roles;
    for (let index = level; index <= AccessLevel.Admin; index++) {
        let levelRole = getAccessLevelRole(index);
        if (roles.cache.has(levelRole))
            return true;
    }

    return false;
}

/** 
 * @param user The user to check the permissions of
 * @param guild The guild to check permissions in
 * @returns If the supplied user is a normal user
 */
export function isNormalUser(user: User, guild: Guild) {
    return (!userHasAccess(user, guild, AccessLevel.Admin) && !userHasAccess(user, guild, AccessLevel.Moderator) && !userHasAccess(user, guild, AccessLevel.Helper));
}

/** 
 * @param message The message to serialize
 * @returns The message in a format that can be displayed
 */
export function serializeMessage(message: Message) {
    let contents = "";

    if (message.content.length)
        contents += message.content;

    let index = 0;
    if (message.embeds.length) {
        message.embeds.forEach(embed => {
            contents += `\n* Embed #${index++}: ${embed.title}${embed.description ? ` - ${embed.description}` : ""}${embed.image ? `\n* ${embed.image.url}` : ""}`;

            embed.fields.forEach(field => {
                contents += `\n* * ${field.name} - ${field.value}`;
            });

            if (embed.footer)
                contents += `\n* ${embed.footer}`;
        });
    }

    index = 0;
    if (message.attachments.size) {
        message.attachments.forEach(attachment => {
            contents += `\n* Attachment #${index++}: ${attachment.name} (${attachment.size} bytes) - ${attachment.url}`;
        });
    }

    return contents;
}

/** 
 * @param text The text to add to the console log
 */
export function logToFile(text: string) {
    const timestamp = new Date(Date.now());
    let time = `[${timestamp.toLocaleString()}]`;
    console.log(`${time} ${text}`);
    fs.appendFile("./console.log", `${time} ${text}\n`, (err) => {
        if (err)
            console.log(err);
    });
}
