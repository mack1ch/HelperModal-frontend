export function formatDateToDayMonthYearFormat(dateValue: Date): {
  day: number;
  month: string;
  year: number;
} {
  const months: string[] = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];

  const date = new Date(dateValue);
  const day: number = date.getDate();
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();

  return { day, month, year };
}

export function formatDateToDDMMYYYY(dateValue: Date): string {
  const date = new Date(dateValue);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayString = day < 10 ? `0${day}` : `${day}`;
  const monthString = month < 10 ? `0${month}` : `${month}`;

  return `${dayString}.${monthString}.${year}`;
}
