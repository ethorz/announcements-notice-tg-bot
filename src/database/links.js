import { db } from './connect.js';

export const setAddedLinkIntoTable = (userId, link) =>
	db('links').insert({ ...link, user_id: userId });

export const getLinksByUserId = (userId) =>
	db('links').select('url', 'name').where('user_id', userId);

export const deleteLinkFromTable = ({ url, name }, userId) =>
	db('links')
		.where('url', url)
		.where('name', name)
		.where('user_id', userId)
		.delete();
