import { Composer } from "grammy";

const startMessage = new Composer();

startMessage.command("start", async ctx => {
    await ctx.reply(
        "Привет!\nЭто бот для отслеживания цен в популярных интернет магазинах (dns, yandexmarket, citilink, ozon)\n\nКоманды:\n/add [название товара] - добавить товар для отслеживания"
    );
});

export default startMessage;
