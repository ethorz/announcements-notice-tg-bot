import { Scenes } from 'telegraf';

import * as db from '../database/links.js';

import { mainKeyboard } from '../config/keyboards.js';
import { GENERAL_SCENES } from '../config/scenes.js';

import { getNowFormattedString } from '../helpers/date.js';

const message = `
🔸 <b>Бот готов к использованию.</b>
🔸 Если не появились вспомогательные кнопки
▶ Введите /start`;

const startScene = new Scenes.BaseScene(GENERAL_SCENES.START);

startScene.enter(async (ctx) => {
	await ctx.deleteMessage();

	const userId = String(ctx.from.id);

	ctx.session.links = [];

	try {
		const links = await db.getLinksByUserId(userId);

		ctx.session.links = links;
	} catch (error) {
		console.warn(
			`[${getNowFormattedString()}] can\'t get link from database by user_id: ${userId}`,
		);
		console.error(error);
	}

	await ctx.replyWithHTML(message, mainKeyboard(ctx));

	return ctx.scene.leave();
});

export default startScene;
