import { Scenes } from 'telegraf';
import { getAnnouncementsFromAvito } from '../services/avito.js';

import { GENERAL_SCENES } from '../config/scenes.js';
import { mainKeyboard, stopKeyboard } from '../config/keyboards.js';

const runScene = new Scenes.BaseScene(GENERAL_SCENES.RUN);

runScene.enter(async ctx => {
	const links = ctx.session.links;

	if (!links.length) {
		return false;
	}
	
	ctx.deleteMessage();
	ctx.session.TIMER = setInterval(async () => {
		links.forEach( async (link) => {
			await getAnnouncementsFromAvito(ctx, link);
		});
			
		const stamp = new Date();
		console.log(`- Request from ${ctx.chat.first_name} | ${stamp.getHours()} : ${stamp.getMinutes()}`);
	}, 10000);

	ctx.replyWithHTML('🚀 <b>Детектор запущен!</b> 🚀', stopKeyboard);
});

runScene.leave(ctx => {
	clearInterval(ctx.session.TIMER);
	ctx.session.TIMER = null;
	return ctx.replyWithHTML('⏹ <b>Детектор остановлен!</b>', mainKeyboard(ctx));
});

export default runScene;