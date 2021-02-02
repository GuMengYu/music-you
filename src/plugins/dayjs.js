import dayjs from 'dayjs';
import 'dayjs/locale/zh';
import 'dayjs/locale/en';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export default dayjs;
