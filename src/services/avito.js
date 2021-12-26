import axios from 'axios';
import cheerio from 'cheerio';

const cache = [];

const getParsedDataFromPage = (html) => {
	const $ = cheerio.load(html);
	const container = $('[data-marker=catalog-serp]').first();
	const element = $('[data-marker=item]', container).first();
	const id = element.attr('id');
	const url = $('a[itemprop=url]', element);
	const price = $('meta[itemprop=price]', element).attr('content');

	const href = url.attr('href');
	const title = url.attr('title');

	return {
		id,
		message: `<a href="https://www.avito.ru${href}">${title}</a>\n<b>${price} руб.</b>`,
	};
};

export const getAnnouncementsFromAvito = async (ctx, { url, name }) => {
	try {
		const { data } = await axios.get(encodeURIComponent(url));

		if (data) {
			const { id, message } = getParsedDataFromPage(data);

			const isExistInCache = cache.find((prev) => prev.name === name);

			if (!isExistInCache) {
				cache.push({
					name,
					id,
				});

				return;
			}

			if (cache.id !== id) {
				await ctx.replyWithHTML(`🔎 <b>${name}</b>\n${message}`);
				
				cache.id = id;
			}
		}
	} catch (error) {
		console.warn(
			`Get announcement from avito failed (${name}: ${url})`,
		);
		console.error(error);
	}
};
