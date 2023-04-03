import { Composer } from "grammy";
import { Database } from "../../utils/mongodb";

const startMessage = new Composer();

const database = new Database();

startMessage.command("start", async ctx => {
    database.addUser(ctx.chat.id, "123");
    await ctx.reply(
        `Привет!\nЭто бот для отслеживания цен в популярных интернет магазинах (dns, yandexmarket, citilink, ozon)` +
            `\n\nКоманды:\n/add [ссылка на товар] - добавить товар для отслеживания` +
            `\n/stop - отписаться от уведомлений`
    );
});

export default startMessage;
