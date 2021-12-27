import axios from 'axios';
import cheerio from 'cheerio';

import { getNowFormattedString } from '../helpers/date.js';

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
		message: `\n<a href="https://www.avito.ru${href}">${title}</a>\n<b>💰 ${price} руб.</b>`,
	};
};

export const getAnnouncementsFromAvito = async (ctx, { url, name }) => {
	// create cache on start bot for all platforms (for avito, cian and etc).
	// write util for prepare and methods for work with cache
	if (typeof ctx.session.cache !== 'object') {
		ctx.session.cache = {};
	}

	try {
		const { data } = await axios.get(encodeURI(url));

		if (data) {
			const { id, message } = getParsedDataFromPage(data);

			if (!ctx.session.cache[name]) {
				ctx.session.cache[name] = id;

				return;
			}

			if (ctx.session.cache[name] !== id) {
				await ctx.replyWithHTML(`🔎 <b>${name}</b>\n${message}`);

				ctx.session.cache[name] = id;
			}
		}
	} catch (error) {
		console.warn(
			`[${getNowFormattedString()}] Get announcement from avito failed (${name}: ${url})`,
		);

		console.error(error);
	}
};
