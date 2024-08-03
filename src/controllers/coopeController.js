const puppeteer = require("puppeteer");

const url = {
  general: "https://www.lacoopeencasa.coop/listado/categoria/almacen/2",
  search: "https://www.lacoopeencasa.coop/listado/busqueda-avanzada/",
  offers: "https://www.lacoopeencasa.coop/",
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
}

const getCoopeProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const url = search ? url.search + search.replaceAll(" ", "_") : url.general;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navegar a la página objetivo
    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // Loading images
    await autoScroll(page);

    // Evaluar el contenido de la página y extraer los productos
    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("div.card.hoverable"));
      return items.map((item) => {
        return {
          name: item.querySelector(".text-capitalize").innerText,
          price: item.querySelector(".precio-entero").innerText,
          regularPrice: item.querySelector("span.precio-regular-valor.precio-tachado")?.innerText,
          priceKilo: item.querySelector(".precio-unitario.no-seleccionable").innerText,
          image: item.querySelector("img").src,
        };
      });
    });

    await browser.close();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCoopeWeeklyOffers = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navegar a la página objetivo
    await page.goto(url.offers, {
      waitUntil: "networkidle0",
    });

    // Loading images
    await autoScroll(page);

    // Evaluar el contenido de la página y extraer los productos
    const products = await page.evaluate(() => {
      const container = document.querySelector("div.drag-scroll-content");

      if (!container) return [];

      const items = Array.from(container.querySelectorAll("div.card.hoverable"));
      return items.map((item) => {
        console.log(item);
        return {
          name: item.querySelector(".text-capitalize").innerText,
          price: item.querySelector(".precio-entero").innerText,
          regularPrice: item.querySelector("span.precio-regular-valor.precio-tachado")?.innerText,
          priceKilo: item.querySelector(".precio-unitario.no-seleccionable").innerText,
          image: item.querySelector("img").src,
        };
      });
    });

    await browser.close();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCoopeProducts,
  getCoopeWeeklyOffers,
};
