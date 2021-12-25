import { Scenes } from 'telegraf';
import { getLastItemFromAvitoPage } from '../common/api.js';

import { GENERAL_SCENES } from '../config/scenes.js';
import { mainKeyboard, stopKeyboard } from '../config/keyboards.js';

const runScene = new Scenes.BaseScene(GENERAL_SCENES.RUN);

runScene.enter(async ctx => {
	const LINKS = ctx.session.links;
	let dataFromPrevRequests = [];

	if (LINKS.length) {
		ctx.deleteMessage();
		ctx.session.TIMER = setInterval(async () => {
			LINKS.forEach( async link => {
				const lastItemData = await getLastItemFromAvitoPage(link.link);
				
				if (lastItemData) {
					const prevItemData = dataFromPrevRequests.find(prevData => {
						return prevData.key === link.link_name;
					})
					
					 if (!prevItemData) {
						dataFromPrevRequests.push({
							key: link.link_name,
							currentId: lastItemData.id
						})
					} else {
						if (prevItemData.currentId !== lastItemData.id) {
							const message = `
							🔎 <b>${link.link_name}</b>\n<a href="${lastItemData.url}">${lastItemData.title}</a>\n<b>${lastItemData.price}</b>`

							await ctx.replyWithHTML(message);

							prevItemData.currentId = lastItemData.id;
						}
					}
				}
			});
			
			const stamp = new Date();
			console.log(`- Request from ${ctx.chat.first_name} | ${stamp.getHours()} : ${stamp.getMinutes()}`);
			
		}, 15000);

		ctx.replyWithHTML('🚀 <b>Детектор запущен!</b> 🚀', stopKeyboard);
	}
	
});

runScene.leave(ctx => {
	clearInterval(ctx.session.TIMER);
	ctx.session.TIMER = null;
	return ctx.replyWithHTML('⏹ <b>Детектор остановлен!</b>', mainKeyboard(ctx));
});

export default runScene;