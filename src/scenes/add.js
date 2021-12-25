import { Telegraf, Scenes } from 'telegraf';

import { GENERAL_SCENES } from '../config/scenes.js';
import { backKeyboard, mainKeyboard } from '../config/keyboards.js';

let endMessage;

const linkHandler = Telegraf.on('message', async ctx => {
	const message = ctx.message.text;
	const urlParam = 's=104'
	const urlExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
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
		return ctx.replyWithHTML('🔸 <b>Ссылка должна быть вида: https://www.аvitо.ru/moskva_i_mo/muzy...</b>');
	}
	
	if (!ctx.session.links.find(l => l.link === link)) {
		ctx.session.link = link;

		await ctx.deleteMessage();
		await ctx.replyWithHTML('✏️ <b>Отлично!</b> Теперь введите название категории:');
		
		return ctx.wizard.next();
	}
	return ctx.replyWithHTML('❗️ <b>У Вас уже есть такая ссылка!</b>');
})

const linkNameHandler = Telegraf.on('message', async ctx => {
	const message = ctx.message.text;
	const userId = String(ctx.from.id);


	if (message !== '⏪ Назад') {
		ctx.session.linkName = message;
		
		ctx.session.links.push({
			link: ctx.session.link,
			link_name: ctx.session.linkName
		});
		
		// await db.ref(`users/${userId}/links`).set(ctx.session.links);
		ctx.session.link = '';
		ctx.session.linkName = '';
		await ctx.deleteMessage();

		endMessage = '✅ <b>Ссылка успешно добавлена!</b>';
	}
	return ctx.scene.leave();
})

const addScene = new Scenes.WizardScene(GENERAL_SCENES.ADD, linkHandler, linkNameHandler);

addScene.enter(ctx => {
	endMessage = '🔸 <b>Добавление отменено.</b>';
	return ctx.replyWithHTML('🔗 <b>Введите ссылку:</b>', backKeyboard)
});

addScene.leave(ctx => ctx.replyWithHTML(endMessage, mainKeyboard(ctx)));

export default addScene;