import { format } from 'date-fns';

export const getNowFormattedString = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');
