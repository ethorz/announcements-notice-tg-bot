import { Scenes } from 'telegraf';
import { getAnnouncementsFromAvito } from '../services/avito.js';

import { GENERAL_SCENES } from '../config/scenes.js';
import { mainKeyboard, stopKeyboard } from '../config/keyboards.js';

const runScene = new Scenes.BaseScene(GENERAL_SCENES.RUN);

runScene.enter(async (ctx) => {
	ctx.session.timeouts = [];

	if (!ctx.session.links.length) {
		return false;
	}

	await ctx.deleteMessage();

	const interval = ctx.session.timeoutPerLink * ctx.session.links.length;

	ctx.session.interval = setInterval(() => {
		ctx.session.links.forEach((link, idx) => {
			ctx.session.timeouts.push(
				setTimeout(
					(context, linkItem) => {
						getAnnouncementsFromAvito(context, linkItem);
					},
					ctx.session.timeoutPerLink * idx,
					ctx,
					link,
				),
			);
		});
	}, interval);

	ctx.replyWithHTML(
		`🚀 <b>Детектор запущен!</b> 🚀 \n
		Бот запрашивает ссылки каждые ${interval / 1000} секунд.
		Промежуток между каждой ссылкой - ${ctx.session.timeoutPerLink / 1000} секунд`,
		stopKeyboard,
	);
});

runScene.leave((ctx) => {
	clearInterval(ctx.session.interval);
	ctx.session.interval = null;

	ctx.session.timeouts.forEach(clearTimeout);
	ctx.session.timeouts = [];

	return ctx.replyWithHTML(
		'⏹ <b>Детектор остановлен!</b>',
		mainKeyboard(ctx),
	);
});

export default runScene;
