require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, FAQ_CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID || !FAQ_CHANNEL_ID) {
  console.error("Missing environment variables: DISCORD_TOKEN, CLIENT_ID, GUILD_ID, FAQ_CHANNEL_ID");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const RESPONSES = Object.freeze({
  register: "**Pasos para registrarte en la pagina:**\n" +
    "1️⃣ Crear cuenta\n" +
    "2️⃣ Nombre\n" +
    "3️⃣ Correo electrónico\n" +
    "4️⃣ Contraseña (mínimo 8 caracteres: mayúscula, minúscula y número)\n" +
    "5️⃣ Confirmar contraseña\n" +
    "6️⃣ Recordarme (checkbox)\n" +
    "7️⃣ ¿Olvidaste tu contraseña? (enlace de recuperación)\n" +
    "8️⃣ Registrarse / Continuar con Google (OAuth)\n" +
    "9️⃣ ¿Ya tienes cuenta? Inicia sesión aquí\n\n" +
    "**Notas sobre la contraseña:** Debe tener al menos 8 caracteres, incluir mayúscula, minúscula y un número. También puedes activar mostrar/ocultar contraseña.",

  dashboard: "**Panel de control:** Vista general con métricas clave, acceso rápido a tareas, calendario y notificaciones. Widgets configurables: actividad reciente, tareas urgentes, próximos eventos.",

  tasks: "🗂️ **Tareas:** Tu organizador personal para mantener al día todas tus tareas académicas con un diseño moderno oscuro que no cansa la vista durante largas sesiones de estudio.\n\n" +
  "✨ ¿Qué puedes hacer?\n\n" +
  "✏️ Crear, editar y eliminar tareas fácilmente\n" +
  "⏱️ Timer Pomodoro para estudiar en bloques de 25 o 50 minutos\n" +
  "🏷️ Organizar por materias (Matemáticas, Física, Química, etc.)\n" +
  "🚨 Marcar prioridad: Alta (rojo), Media (amarillo), Baja (verde)\n" +
  "✅ Tachar tareas completadas y ver tu progreso\n" +
  "📊 Ver estadísticas: cuántas tareas completaste y tu racha de estudio\n" +
  "🔍 Filtrar por: tareas de hoy, esta semana, pendientes o vencidas\n" +
  "📱 Funciona perfectamente en celular y computadora",

  calendar: "📆 **Calendario:** Tu calendario personal para no perderte ningún examen, tarea o proyecto con vistas que se adaptan a tu forma de planificar.\n\n" +
  "✨ ¿Qué puedes hacer?\n\n" +
  "📅 Ver tu mes completo, semana, día o lista de próximos eventos\n" +
  "➕ Agregar exámenes, tareas y proyectos con un click\n" +
  "🎨 Cada materia tiene su color para identificarla rápidamente\n" +
  "📥 Descargar tu calendario para imprimirlo o agregarlo a Google Calendar\n" +
  "📂 Subir eventos desde archivos de otros calendarios\n" +
  "🖨️ Imprimir tu calendario mensual\n" +
  "⏩ Navegar rápidamente a cualquier mes del año\n" +
  "🔔 Configurar recordatorios para no olvidar nada",

  notes: "📝 **Notas:** Crea notas personales con título y contenido en texto enriquecido/markdown. Organízalas por carpetas o etiquetas. Guarda borradores automáticamente y búscalas fácilmente.",

  forum: "💬 **Foro:** Espacio de discusión por temas; publicaciones con respuestas, votos y moderación. Incluye categorías, etiquetas, búsqueda y notificaciones cuando alguien responde.",

  help: "**Comandos disponibles:**\n" +
    "`!register` → Pasos para registrarse\n" +
    "`!dashboard` → Información del panel de control\n" +
    "`!tasks` → Información sobre tareas\n" +
    "`!calendar` → Información del calendario\n" +
    "`!notes` → Información sobre notas\n" +
    "`!forum` → Información del foro\n" +
    "`!help` → Lista de comandos"
});

client.once(Events.ClientReady, c => {
  console.log(`Bot connected as ${c.user.tag}`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.channel.id !== FAQ_CHANNEL_ID) return;

  const text = message.content.trim().toLowerCase();
  if (RESPONSES[text.slice(1)]) {
    try {
      await message.reply(RESPONSES[text.slice(1)]);
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const name = interaction.commandName;
  if (RESPONSES[name]) {
    try {
      await interaction.reply(RESPONSES[name]);
    } catch (err) {
      console.error("Error handling interaction:", err);
    }
  } else if (name === "ping") {
    await interaction.reply("Pong!");
  }
});

process.on("unhandledRejection", err => {
  console.error("UNHANDLED REJECTION:", err);
});

client.login(DISCORD_TOKEN).catch(err => {
  console.error("Login failed (invalid token?):", err);
  process.exit(1);
});