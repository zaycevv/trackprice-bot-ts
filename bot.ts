import { Bot } from "grammy";
import startMessage from "./src/commands/StartMessage";

require("dotenv").config();

const bot = new Bot(process.env.TOKEN || "");

bot.use(startMessage);

bot.start();
