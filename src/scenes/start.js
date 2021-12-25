const { Scenes: { BaseScene } } = require('telegraf');

const main_keyboard = require('../keyboards/main');
const message = `
🔸 <b>Бот готов к использованию.</b>
🔸 Если не появились вспомогательные кнопки
 ▶ Введите /start`;

const startScene = new BaseScene('startScene');

startScene.enter(async ctx => {
	const userId = String(ctx.from.id);
	const userName = ctx.from.username;

	ctx.session.links = [];

	// TODO: прикрутить sqlite или mondodb
	/* const usersRes = await db.ref('users').once('value');
	const usersValue = await usersRes.val();

	if ( !Object.keys(usersValue).includes(userId) ) {
		const user = { name: userName, id: userId }
		await db.ref(`users/${userId}`).set(user);
	} else {
		const userLinksRes = await db.ref(`users/${userId}/links`).once('value');
		const userLinks = await userLinksRes.val();
		if (userLinks) {
			ctx.session.links = userLinks;
		} else {
			ctx.session.links = [];
		}
	} */

	await ctx.replyWithHTML(message, main_keyboard(ctx));

	console.log(`start scene was started successful`);

	return ctx.scene.leave();
});

module.exports = startScene;