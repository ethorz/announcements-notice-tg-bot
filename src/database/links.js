import { db } from './connect.js';

export const setAddedLinkIntoTable = (userId, link) => db('links').insert({ ...link, user_id: userId });

export const getLinksByUserId = (userId) => db('links').select('link', 'link_name').where('user_id', userId);

export const deleteLinkFromTable = ({ link, link_name }, userId) => db('links').where('link', link).where('link_name', link_name).where('user_id', userId).delete();