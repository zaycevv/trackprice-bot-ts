import { Composer } from "grammy";
import { Database } from "../../utils/mongodb";

const stopMessage = new Composer();

const database = new Database();

stopMessage.command("stop", async ctx => {
    // Получаем id чата пользователя
    const chatId = ctx.chat.id;
    // Удаляем пользователя из базы данных
    await database.deleteUser(chatId);
    // Отправляем сообщение об успешной отписке
    ctx.reply("Вы успешно отписались от всех уведомлений.");
});

export default stopMessage;
