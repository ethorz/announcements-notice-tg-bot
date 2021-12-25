import { Markup } from 'telegraf';

export const stopKeyboard = Markup.keyboard([
	['⏹ Остановить']
]).resize();

export const backKeyboard = Markup.keyboard([
	['⏪ Назад']
]).resize();

export const removeKeyboard = (links) => {
	let keyboard = [];
	links.forEach((link, key) => {
		keyboard.push([Markup.button.callback(`🔗 ${link.link_name}`, `remove_${key}`)]);
	})

	return Markup.inlineKeyboard(keyboard);
};

export const linksKeyboard = [
	['⏪ Назад', '🗑 Удалить ссылку']
];

export const mainKeyboard = (ctx) => {
	let keyboard = ['➕ Добавить ссылку'];

	if (ctx.session.links.length) {
		keyboard = ['🚀 Запустить', '➕ Добавить ссылку', '📔 Мои ссылки'];
	}

	return Markup.keyboard([keyboard]).resize();
}