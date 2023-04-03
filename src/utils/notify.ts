import { bot } from "../../bot";
import { Parser } from "../utils/parser";
import { Database } from "../utils/mongodb";
import { Product } from "../utils/mongodb";

const parser = new Parser();
const database = new Database();

// Создаем функцию для проверки и отправки уведомлений
export async function checkAndNotify() {
    // Получаем список всех товаров в базе данных
    const products = await Product.find();
    // Проходим по каждому товару в цикле
    for (const product of products) {
        // Получаем текущую информацию о товаре с помощью парсера
        const currentProduct = await parser.getProductInfo(product.url);
        // Проверяем, удалось ли получить информацию о товаре
        if (currentProduct) {
            // Сравниваем текущую цену и наличие товара с сохраненными в базе данных
            if (currentProduct.price !== product.price) {
                // Если есть разница, значит произошло изменение
                // Получаем список пользователей, подписанных на этот товар
                const users = await database.getUsersByProduct(product.url);
                // Проходим по каждому пользователю в цикле
                for (const user of users) {
                    // Отправляем уведомление пользователю с новой информацией о товаре
                    bot.api.sendMessage(
                        user,
                        `Внимание! Произошло изменение по товару ${product.name}:\n` +
                            `Новая цена: ${currentProduct.price}\n`
                    );
                }
                // Обновляем информацию о товаре в базе данных
                await database.addProduct(
                    product.url,
                    currentProduct.name,
                    currentProduct.price
                );
            }
        }
    }
}
