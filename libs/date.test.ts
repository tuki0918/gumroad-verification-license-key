import {
  formatJSTDate,
  formatJSTDateTime,
  formatJSTDay,
  formatJSTTimeAgo,
  parseToUTCDate,
} from "./date";

describe("Date Utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2022, 0, 1, 0, 30, 0)));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("parseToUTCDate should return a Date object in UTC timezone", () => {
    const dateStr = "2022-01-01T00:00:00Z";
    const expectedDate = new Date(Date.UTC(2022, 0, 1, 0, 0, 0));
    expect(parseToUTCDate(dateStr)).toEqual(expectedDate);
  });

  test("formatJSTDateTime should return a formatted date and time in JST timezone", () => {
    // The date is 2022-01-01T00:00:00Z, which is 2022-01-01T09:00:00+09:00
    const date = new Date(Date.UTC(2022, 0, 1, 0, 0, 0));
    const formattedDateTime = formatJSTDateTime(date);
    expect(formattedDateTime).toBe("2022/01/01 09:00:00");
  });

  test("formatJSTDate should return a formatted date in JST timezone", () => {
    // The date is 2022-01-01T00:00:00Z, which is 2022-01-01T09:00:00+09:00
    const date = new Date(Date.UTC(2022, 0, 1, 0, 0, 0));
    const formattedDate = formatJSTDate(date);
    expect(formattedDate).toBe("2022/01/01");
  });

  test("formatJSTDate should return a formatted date in JST timezone - 1", () => {
    // The date is 2022-01-01T15:00:00Z, which is 2022-01-02T00:00:00+09:00
    const date = new Date(Date.UTC(2022, 0, 1, 15, 0, 0));
    const formattedDate = formatJSTDate(date);
    expect(formattedDate).toBe("2022/01/02");
  });

  test("formatJSTDay should return a formatted day in JST timezone", () => {
    // The date is 2022-01-01T00:00:00Z, which is 2022-01-01T09:00:00+09:00
    const date = new Date(Date.UTC(2022, 0, 1, 0, 0, 0));
    const formattedDay = formatJSTDay(date);
    expect(formattedDay).toBe("01");
  });

  test("formatJSTDay should return a formatted day in JST timezone - 1", () => {
    // The date is 2022-01-01T15:00:00Z, which is 2022-01-02T00:00:00+09:00
    const date = new Date(Date.UTC(2022, 0, 1, 15, 0, 0));
    const formattedDay = formatJSTDay(date);
    expect(formattedDay).toBe("02");
  });

  test("formatJSTTimeAgo should return a formatted relative time in JST timezone", () => {
    const date = new Date(Date.UTC(2022, 0, 1, 0, 0, 0));
    const locale = "ja";
    const formattedTimeAgo = formatJSTTimeAgo(date, locale);
    expect(formattedTimeAgo).toBe("30分前");
  });

  test("formatJSTTimeAgo should return a formatted relative time in JST timezone - 1", () => {
    const date = new Date(Date.UTC(2022, 0, 1, 0, 0, 0));
    const locale = "en";
    const formattedTimeAgo = formatJSTTimeAgo(date, locale);
    expect(formattedTimeAgo).toBe("30 minutes ago");
  });
});
