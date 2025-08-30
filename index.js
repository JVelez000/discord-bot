// index.js
require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

// Leer variables de entorno
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const FAQ_CHANNEL_ID = process.env.FAQ_CHANNEL_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !FAQ_CHANNEL_ID) {
  console.error("ERROR: faltan variables en .env. Revisa DISCORD_TOKEN, CLIENT_ID, GUILD_ID, FAQ_CHANNEL_ID");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Mensajes/respuestas (personaliza el texto si quieres)
const RESPONSES = {
  register: `📌 **Pasos para registrarte en la página:**\n\n` +
    `1️⃣ Crear cuenta\n` +
    `2️⃣ Nombre\n` +
    `3️⃣ Correo\n` +
    `4️⃣ Contraseña (mínimo 8 caracteres: mayúscula, minúscula y número)\n` +
    `5️⃣ Confirmar contraseña\n` +
    `6️⃣ Recordarme (checkbox)\n` +
    `7️⃣ ¿Olvidaste tu contraseña? (link para recuperar)\n` +
    `8️⃣ Registrarme / Continuar con Google (OAuth)\n` +
    `9️⃣ ¿Ya tienes cuenta? Inicia sesión (link)\n\n` +
    `**Notas sobre contraseña:** la contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula y número. Puedes permitir mostrar/ocultar la contraseña con un icono ojo en el campo.\n`,

  dashboard: `📊 **Dashboard**:\nResumen general con métricas principales, accesos rápidos a tareas, calendario y notificaciones. Widgets configurables: actividad reciente, tareas urgentes, próximos eventos.`,

  tasks: `📝 **Tareas**:\nLista de tareas con estados (todo, doing, done), prioridad, fecha de entrega. Permite crear, editar, asignar usuario, marcar completada y filtros por etiqueta/fecha.`,

  calendar: `📅 **Calendario**:\nVisualización por mes/semana/día. Integración de eventos (tarea con fecha, examen, recordatorio). Permite crear eventos, notificaciones y sincronizar con Google Calendar si corresponde.`,

  notes: `📒 **Notas**:\nNotas personales con título y contenido rich-text (o markdown). Carpetas o tags para organizar. Borrador autosave y búsqueda.`,

  forum: `💬 **Foro**:\nEspacio de discusión por temas; posts con respuestas, votos y moderación. Categorías, etiquetas y búsqueda. Notificaciones cuando alguien responde a tu post.`
};

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot conectado como ${c.user.tag}`);
});

// Handler para comandos tipo "!" en canal FAQ
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;

    // solo responder en canal FAQ configurado por ID
    if (message.channel.id !== FAQ_CHANNEL_ID) return;

    const text = message.content.trim();

    // Comandos exactos
    if (text === "!register") {
      return message.reply(RESPONSES.register);
    }
    if (text === "!dashboard") {
      return message.reply(RESPONSES.dashboard);
    }
    if (text === "!tasks") {
      return message.reply(RESPONSES.tasks);
    }
    if (text === "!calendar") {
      return message.reply(RESPONSES.calendar);
    }
    if (text === "!notes") {
      return message.reply(RESPONSES.notes);
    }
    if (text === "!forum") {
      return message.reply(RESPONSES.forum);
    }
  } catch (err) {
    console.error("Error handling message:", err);
  }
});

// Opcional: soportar slash commands si los registras (deployed)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    const name = interaction.commandName;

    // Responder con los mismos textos (solo si el comando se usó en el guild configurado)
    if (name === "register") return interaction.reply(RESPONSES.register);
    if (name === "dashboard") return interaction.reply(RESPONSES.dashboard);
    if (name === "tasks") return interaction.reply(RESPONSES.tasks);
    if (name === "calendar") return interaction.reply(RESPONSES.calendar);
    if (name === "notes") return interaction.reply(RESPONSES.notes);
    if (name === "forum") return interaction.reply(RESPONSES.forum);
    if (name === "ping") return interaction.reply("🏓 Pong!");
  } catch (err) {
    console.error("Interaction error:", err);
  }
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// Conectar
client.login(TOKEN).catch((err) => {
  console.error("Login failed (token inválido?):", err);
  process.exit(1);
});
