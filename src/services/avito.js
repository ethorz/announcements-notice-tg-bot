import axios from 'axios';
import cheerio from 'cheerio';
import { format } from 'date-fns';

const cache = {};

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
		const { data } = await axios.get(encodeURI(url));

		if (data) {
			const { id, message } = getParsedDataFromPage(data);

			if (!cache[name]) {
				cache[name] = id;

				return;
			}

			if (cache[name] !== id) {
				await ctx.replyWithHTML(`🔎 <b>${name}</b>\n${message}`);
				
				cache[name] = id;
			}
		}
	} catch (error) {
		console.warn(
			`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] Get announcement from avito failed (${name}: ${url})`,
		);
		console.error(error);
	}
};
