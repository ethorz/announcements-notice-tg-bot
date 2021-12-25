import axios from 'axios';
import cheerio from 'cheerio';

export const getLastItemFromAvitoPage = async (requestUrl) => {
	const htmlPage = await axios.get(requestUrl);

	const $ = cheerio.load(htmlPage.data);
	const container = $('[data-marker=catalog-serp]').first();
	const element = $('[data-marker=item]', container).first();
	const id = element.attr('id');
	const url = $('a[itemprop=url]', element);
	const description = $('meta[itemprop=description]', element).attr('content');
	const price = $('meta[itemprop=price]', element).attr('content');
	const priceCurrency = $('meta[itemprop=priceCurrency]', element).attr('content');

	return {
		id,
		url: 'https://www.avito.ru' + url.attr('href'),
		title: url.attr('title'),
		description,
		price: `${price} ${priceCurrency}`
	};
}