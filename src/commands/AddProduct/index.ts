import { Composer } from "grammy";
import { Parser } from "../../utils/parser";
import { Database } from "../../utils/mongodb";

const addProduct = new Composer();

const parser = new Parser();
const database = new Database();

// Регистрируем обработчик команды /add
addProduct.command("add", async ctx => {
    // Получаем id чата пользователя
    const chatId = ctx.chat.id;
    // Получаем аргумент команды (ссылку на товар)
    const url = ctx.message?.text.split(" ")[1];
    // Если ссылки нет возвращаем ответ
    if (url === undefined) {
        ctx.reply(`Введите команду в формате /add [сслыка на товар]`);
        return;
    }
    // Проверяем, является ли аргумент ссылкой на товар
    if (parser.isProductUrl(url)) {
        // Получаем информацию о товаре с помощью парсера
        const product = await parser.getProductInfo(url);
        // Проверяем, удалось ли получить информацию о товаре
        if (product) {
            // Отправляем сообщение с информацией о товаре
            ctx.reply(
                `Название: ${product.name}\n` +
                    `Цена: ${product.price}\n` +
                    `Вы успешно подписались на уведомления об изменениях.`
            );
            // Добавляем или обновляем товар в базе данных
            await database.addProduct(url, product.name, product.price);
            // Добавляем или обновляем пользователя в базе данных
            await database.addUser(chatId, url);
        } else {
            // Если не удалось получить информацию о товаре, отправляем сообщение об ошибке
            ctx.reply("Извините, я не смог найти информацию о этом товаре.");
        }
    } else {
        // Если аргумент не является ссылкой на товар, отправляем сообщение с подсказкой
        ctx.reply(
            "Пожалуйста, отправьте мне ссылку на товар в одном из поддерживаемых магазинов."
        );
    }
});

export default addProduct;
