import dayjs from "dayjs";
import en from "dayjs/locale/en";
import ja from "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ja);
dayjs.extend(relativeTime);

const selectLocale = (locale: string) => {
  switch (locale) {
    case "ja":
      return ja;
    case "en":
      return en;
    default:
      return ja;
  }
};

export const parseToUTCDate = (date: string) => {
  return dayjs.utc(date).toDate();
};

export const formatJSTDate = (date: Date) => {
  return dayjs(date).tz("Asia/Tokyo").format("YYYY/MM/DD");
};

export const formatJSTTimeAgo = (date: Date, locale: string) => {
  const selectedLocale = selectLocale(locale);
  return dayjs(date).locale(selectedLocale).tz("Asia/Tokyo").fromNow();
};
