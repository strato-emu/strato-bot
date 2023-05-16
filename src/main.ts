import dotenv from "dotenv";
dotenv.config();
import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import { AccessLevel } from "./commonFunctions.js";
import fs from "node:fs";

// Get the command files from the commands directory
const commands = [];
const commandFiles = fs.readdirSync("./build/commands").filter(file => file.endsWith(".js"));

// Get the output of each command's data for updating
for (const file of commandFiles) {
    const { command } = await import(`../build/commands/${file}`);
    switch (command.level) {
        case AccessLevel.Admin:
            command.data.setDefaultMemberPermissions(8); //Administrator
            break;
        case AccessLevel.Moderator:
            command.data.setDefaultMemberPermissions(8322); //View Audit Log, Kick Members, Manage Messages
            break;
        case AccessLevel.Helper:
            command.data.setDefaultMemberPermissions(8194); // Kick Members, Manage Messages
            break;
        case AccessLevel.User:
            break;
        case undefined:
            throw console.error(`\nNo AccessLevel provided for "${command.data.name}" command; add "level" property to command file`);
        default:
            let options = Object.keys(AccessLevel).filter((v) => isNaN(Number(v)));
            options.forEach((value, index) => options.splice(index, 1, `AccessLevel.${value}`));
            throw console.error(`\nAccessLevel provided for "${command.data.name}" command is invalid; valid options are ${options.join(", ")}`);
    }
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

// Fully update all commands
(async () => {
    try {
        console.log(`Started updating ${commands.length} slash commands`);

        const data : any = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            { body: commands }, // To delete registered commands: { body : [] }
        );

        console.log(`Successfully updated ${data.length} slash commands`);
    } catch (error) {
        console.error(error);
    }
})();

declare module "discord.js" {
    interface Client {
    	commands: Collection<unknown, any>
    }
}

// Create a new client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
});

// Read command files
client.commands = new Collection();
const commandFiles2 = fs.readdirSync("./build/commands").filter(file => file.endsWith(".js"));

// Retrieving all the command files
for (const file of commandFiles2) {
    const { command } = await import(`./commands/${file}`);

    client.commands.set(command.data.name, command);
}
// Read event files
const eventFiles = fs.readdirSync("./build/events").filter(file => file.endsWith(".js"));

// Retrieving all the event files
for (const file of eventFiles) {
    const { event } = await import(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Login to Discord
client.login(process.env.TOKEN!);
