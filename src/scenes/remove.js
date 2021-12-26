import { Scenes } from 'telegraf';

import * as db from '../database/links.js';

import { GENERAL_SCENES } from '../config/scenes.js';
import { mainKeyboard, removeKeyboard } from '../config/keyboards.js';

const removeScene = new Scenes.BaseScene(GENERAL_SCENES.REMOVE);

removeScene.enter(async ctx => {
	await ctx.deleteMessage();
	ctx.reply('📲 Нажмите на категорию, которую хотите удалить 📲', removeKeyboard(ctx.session.links));
});

removeScene.on('callback_query', async ctx => {
	const link = ctx.callbackQuery.data;
	const linkIndex = Number(link.split('_')[1]);
	const userId = String(ctx.from.id);
	const [deletedLink] = ctx.session.links.splice(linkIndex, 1);

	await db.deleteLinkFromTable(deletedLink, userId);
	await ctx.answerCbQuery('✅ Ссылка успешно удалена!');

	if (!ctx.session.links.length) {
		await ctx.editMessageText('🔗 Ссылок больше не осталось 🔗');
		return ctx.scene.leave();
	}
	
	return ctx.editMessageText('📲 Нажмите на категорию, которую хотите удалить 📲', removeKeyboard(ctx.session.links));
	
});

const message = '◀️ <b>Возвращаемся...</b>'

removeScene.leave(ctx => ctx.replyWithHTML(message, mainKeyboard(ctx)));

export default removeScene;