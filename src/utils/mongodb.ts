import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    chatId: { type: Number, required: true, unique: true }, // id чата пользователя
    products: [{ type: String }] // массив ссылок на товары, на которые подписан пользователь
});

// Определяем модель для коллекции users
const User = mongoose.model("User", userSchema);

// Определяем схему для коллекции products
const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true }, // ссылка на товар
    name: { type: String }, // название товара
    price: { type: Number } // цена товара
});

// Определяем модель для коллекции products
export const Product = mongoose.model("Product", productSchema);

// Создаем класс для работы с базой данных
export class Database {
    // Конструктор класса
    constructor() {
        // Подключаемся к базе данных MongoDB с помощью mongoose
        mongoose.connect(
            "mongodb+srv://lowpricedevice:lowpricedevice@cluster0.4gqv6vs.mongodb.net/?retryWrites=true&w=majority"
        );
    }

    // Метод для добавления или обновления пользователя в базе данных
    async addUser(chatId: number, productUrl: string) {
        // Пытаемся найти пользователя по id чата в базе данных
        const user = await User.findOne({ chatId });
        // Проверяем, нашли ли мы пользователя
        if (user) {
            // Если нашли, то добавляем ссылку на товар в массив products, если ее там еще нет
            if (!user.products.includes(productUrl)) {
                user.products.push(productUrl);
                await user.save();
            }
        } else {
            // Если не нашли, то создаем нового пользователя с id чата и ссылкой на товар в массиве products
            await User.create({ chatId, products: [productUrl] });
        }
    }

    // Метод для удаления пользователя из базе данных
    async deleteUser(chatId: number) {
        // Удаляем пользователя по id чата из базы данных
        await User.deleteOne({ chatId });
    }

    // Метод для добавления или обновления товара в базе данных
    async addProduct(
        productUrl: string,
        productName: string,
        productPrice: number
    ) {
        // Пытаемся найти товар по ссылке в базе данных
        const product = await Product.findOne({ url: productUrl });
        // Проверяем, нашли ли мы товар
        if (product) {
            // Если нашли, то обновляем информацию о названии, цене и наличии товара в базе данных
            product.name = productName;
            product.price = productPrice;
            await product.save();
        } else {
            // Если не нашли, то создаем новый товар с ссылкой, названием, ценой и наличием в базе данных
            await Product.create({
                url: productUrl,
                name: productName,
                price: productPrice
            });
        }
    }

    // Метод для получения списка пользователей, подписанных на определенный товар
    async getUsersByProduct(productUrl: string) {
        // Ищем пользователей в базе данных, у которых есть ссылка на товар в массиве products
        const users = await User.find({ products: productUrl });
        // Возвращаем массив id чатов этих пользователей
        return users.map(user => user.chatId);
    }

    // Метод для получения информации о товаре по ссылке из базы данных
    async getProductByUrl(productUrl: string) {
        // Ищем товар по ссылке в базе данных
        const product = await Product.findOne({ url: productUrl });
        // Возвращаем объект с информацией о товаре или null, если не нашли
        return product
            ? {
                  name: product.name,
                  price: product.price
              }
            : null;
    }
}
