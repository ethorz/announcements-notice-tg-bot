import { Telegraf, Scenes } from 'telegraf';

import * as db from '../database/links.js';

import { MAX_LINKS_LIMIT } from '../config/constants.js';
import { GENERAL_SCENES } from '../config/scenes.js';
import { backKeyboard, mainKeyboard } from '../config/keyboards.js';

let endMessage;

const linkHandler = Telegraf.on('message', async (ctx) => {
	const message = ctx.message.text;
	// TODO: url parser + remove urlParam
	const urlParam = 's=104';
	const urlExp =
		/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	let link;

	if (message.match(urlExp)) {
		if (!message.includes(urlParam)) {
			if (!message.includes('?')) {
				link = message + '?' + urlParam;
			} else {
				link = message + '&' + urlParam;
			}
		} else {
			link = message;
		}
	} else {
		await ctx.deleteMessage();

		return ctx.replyWithHTML(
			'🔸 <b>Ссылка должна быть вида: https://www.аvitо.ru/moskva_i_mo/zdor...</b>',
		);
	}

	if (!ctx.session.links.find(({ url }) => url === link)) {
		ctx.session.link = link;

		await ctx.deleteMessage();
		await ctx.replyWithHTML(
			'✏️ <b>Отлично!</b> Теперь введите название категории:',
		);

		return ctx.wizard.next();
	}
	return ctx.replyWithHTML('❗️ <b>У Вас уже есть такая ссылка!</b>');
});

const linkNameHandler = Telegraf.on('message', async (ctx) => {
	const message = ctx.message.text;
	const userId = String(ctx.from.id);

	if (message !== '⏪ Назад') {
		const link = {
			url: ctx.session.link,
			name: message,
		};

		ctx.session.links.push(link);

		await db.setAddedLinkIntoTable(userId, link);

		ctx.session.link = '';
		await ctx.deleteMessage();

		endMessage = `✅ <b>Ссылка успешно добавлена!</b> <i>Оставшийся лимит на кол-во ссылок: ${
			MAX_LINKS_LIMIT - ctx.session.links.length
		}</i>`;
	}

	return ctx.scene.leave();
});

const addScene = new Scenes.WizardScene(
	GENERAL_SCENES.ADD,
	linkHandler,
	linkNameHandler,
);

addScene.enter(async (ctx) => {
	await ctx.deleteMessage();

	endMessage = '🔸 <b>Добавление отменено.</b>';

	if (ctx.session.links?.length === MAX_LINKS_LIMIT) {
		endMessage =
			'🚨 Исчерпан лимит по количеству добавленных ссылок, удалите неактивные ссылки';

		return ctx.scene.leave();
	}

	return ctx.replyWithHTML('🔗 <b>Введите ссылку:</b>', backKeyboard);
});

addScene.leave((ctx) => ctx.replyWithHTML(endMessage, mainKeyboard(ctx)));

export default addScene;
