const puppeteer = require("puppeteer");

interface ProductInfo {
    name: string; // название товара
    price: number; // цена товара
}

export class Parser {
    isProductUrl(url: string): boolean {
        // Проверяем, начинается ли ссылка с https:// и содержит ли она один из доменов магазинов
        return (
            url.startsWith("https://") &&
            (url.includes("dns-shop.ru") ||
                url.includes("market.yandex.ru") ||
                url.includes("citilink.ru") ||
                url.includes("ozon.ru"))
        );
    }
    async getProductInfo(url: string): Promise<ProductInfo | void> {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        switch (true) {
            case url.includes("dns-shop.ru"):
                await page.goto(url);
                await page.waitForSelector(".product-buy__price");
                await page.waitForSelector(".product-card-top__name");
                const data = await page.evaluate(() => {
                    // Получаем элемент с классом product-card-top__name и извлекаем его текстовое содержимое
                    const name = document.querySelector(
                        ".product-card-top__name"
                    )!.textContent;
                    // Получаем элемент с классом product-buy__price и извлекаем его текстовое содержимое
                    const priceText = document
                        .querySelector(".product-buy__price")!
                        .textContent!.replace(/\s/g, "");
                    // Возвращаем объект с данными
                    const price = parseInt(priceText);
                    return { name, price };
                });
                await browser.close();
                return data;
            case url.includes("market.yandex.ru"):
                // TODO: yandex market парсер
                break;
            case url.includes("citilink.ru"):
                // TODO: citilink парсер
                break;
            case url.includes("ozon.ru"):
                // TODO: ozon парсер
                break;
            default:
                throw new Error("Unknown url");
        }
    }
}
