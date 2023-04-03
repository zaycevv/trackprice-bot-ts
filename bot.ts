import { Bot } from "grammy";
import { checkAndNotify } from "./src/utils/notify";
import stopMessage from "./src/commands/StopMessage";
import startMessage from "./src/commands/StartMessage";
import addProduct from "./src/commands/AddProduct";

require("dotenv").config();

export const bot = new Bot(process.env.TOKEN || "");

bot.use(startMessage);
bot.use(stopMessage);
bot.use(addProduct);

setInterval(checkAndNotify, 10 * 60 * 1000);

bot.start();
