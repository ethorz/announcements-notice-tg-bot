import { Scenes } from 'telegraf';

import { GENERAL_SCENES } from '../config/scenes.js';
import {
	mainKeyboard,
	linksKeyboard,
	backKeyboard,
} from '../config/keyboards.js';

let replyMessage, keyboard;

const linksScene = new Scenes.BaseScene(GENERAL_SCENES.LINKS);

linksScene.enter(async (ctx) => {
	const LINKS = ctx.session.links;
	replyMessage = '◀️ <b>Возвращаемся...</b>';
	keyboard = mainKeyboard(ctx);

	if (LINKS?.length) {
		let message = '🗒 <b>Список Ваших ссылок:</b>\n\n';
		LINKS.forEach((link) => {
			message += `🔗 <b><a href="${link.url}">${link.name}</a></b>\n`;
		});

		await ctx.replyWithHTML(message, {
			reply_markup: {
				keyboard: linksKeyboard,
				resize_keyboard: true,
			},
			disable_web_page_preview: true,
		});
	} else {
		await ctx.replyWithHTML('🔸 <b>У вас пока что не ссылок.</b>');
		return ctx.scene.leave();
	}
});

linksScene.on('message', (ctx) => {
	const message = ctx.message.text;

	if (message === '🗑 Удалить ссылку') {
		replyMessage = '⏩ <b>Идем дальше...</b>';
		keyboard = backKeyboard;

		ctx.scene.enter(GENERAL_SCENES.REMOVE);
	}
});

linksScene.leave((ctx) => ctx.replyWithHTML(replyMessage, keyboard));

export default linksScene;
