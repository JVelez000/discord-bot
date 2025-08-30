require("dotenv").config();
const { REST, Routes } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Faltan variables en .env (DISCORD_TOKEN, CLIENT_ID, GUILD_ID)");
  process.exit(1);
}

const commands = [
  { name: "ping", description: "Responde pong" },
  { name: "register", description: "Muestra los pasos para registrarse" },
  { name: "dashboard", description: "Explica el Dashboard" },
  { name: "tasks", description: "Explica Tareas" },
  { name: "calendar", description: "Explica Calendario" },
  { name: "notes", description: "Explica Notas" },
  { name: "forum", description: "Explica Foro" }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registrando comandos en el GUILD...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("Comandos registrados ✅");
  } catch (err) {
    console.error("Error registrando comandos:", err);
  }
})();
