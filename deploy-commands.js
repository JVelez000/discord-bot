require("dotenv").config();
const { REST, Routes } = require("discord.js");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Missing environment variables: DISCORD_TOKEN, CLIENT_ID, GUILD_ID");
  process.exit(1);
}

const commands = [
  { name: "ping", description: "Replies with pong" },
  { name: "register", description: "Shows the steps to register" },
  { name: "dashboard", description: "Explains the Dashboard" },
  { name: "tasks", description: "Explains Tasks" },
  { name: "calendar", description: "Explains Calendar" },
  { name: "notes", description: "Explains Notes" },
  { name: "forum", description: "Explains Forum" },
  { name: "help", description: "Shows all available commands" }
];

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering guild commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("Commands registered successfully");
  } catch (err) {
    console.error("Error registering commands:", err);
    process.exit(1);
  }
})();