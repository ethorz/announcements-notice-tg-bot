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

	return {
		id,
		message: `<a href="https://www.avito.ru${url.attr('href')}">${url.attr('title')}</a>\n<b>${price} руб.</b>`
	}
}

export const getAnnouncementsFromAvito = async (ctx, { link, link_name }) => {
	try {
		const { data } = await axios.get(link);
		
		if (data) {
			const { id, message } = getParsedDataFromPage(data);

			const isExistInCache = cache.find(prev => prev.key === link_name);

			 if (!isExistInCache) {
				cache.push({
					key: link_name,
					id
				});

				return;
			}
			
			if (cache.id !== id) {
				await ctx.replyWithHTML(`🔎 <b>${link_name}</b>\n${message}`);
				cache.id = id;
			}
		}
	} catch (error) {
		console.warn(`Get announcement from avito failed (${link_name}: ${link})`);
		console.error(error);
	}
}