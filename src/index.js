import { Telegraf, Scenes, session } from 'telegraf';
import dotenv from 'dotenv';

import startScene from './scenes/start.js';
import addScene from './scenes/add.js';
import linksScene from './scenes/links.js';
import removeScene from './scenes/remove.js';
import runScene from './scenes/run.js';

import { GENERAL_SCENES } from './config/scenes.js';

const dotenvConfig = dotenv.config();

if (dotenvConfig.error) {
	throw new Error('Dontenv config isn\'t exist');
}

const stage = new Scenes.Stage([ startScene, addScene, linksScene, removeScene, runScene ]);

stage.hears('⏪ Назад', async ctx => {
	await ctx.deleteMessage();
	return ctx.scene.leave();
});
stage.hears('⏹ Остановить', async ctx => {
	await ctx.deleteMessage();
	return ctx.scene.leave();
});

const bot = new Telegraf(process.env.TG_TOKEN);

bot.use(session())
bot.use(stage.middleware());

bot.command('/start', ctx => ctx.scene.enter(GENERAL_SCENES.START));

bot.on('message', ctx => {
	const message = ctx.message.text;

	switch (message) {
		case '➕ Добавить ссылку':
			ctx.scene.enter(GENERAL_SCENES.ADD);
			break;
		case '📔 Мои ссылки':
			ctx.scene.enter(GENERAL_SCENES.LINKS);
			break;
		case '🚀 Запустить':
			ctx.scene.enter(GENERAL_SCENES.RUN);
			break;
		default:
			ctx.deleteMessage();
	}
});

bot.launch();