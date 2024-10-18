import { parse, isSameDay, isWithinInterval } from "date-fns";

export let filterData = (
  dateRange: string, // e.g. "01/01/2023" or "01/01/2023-31/01/2023"
  data: {
    referrer: string;
    referrals: Array<{
      name: string;
      date: string;
    }>;
  }[]
) => {
  let buffer: {
    referrer: string;
    referrals: Array<{
      name: string;
      date: string;
    }>;
  }[] = [];

  // Check if it's a single date or a date range
  const dates = dateRange.split("-");
  const isSingleDate = dates.length === 1;

  // Parse the date(s)
  const startDate = parse(dates[0].trim(), "dd/MM/yyyy", new Date());

  let endDate: Date | undefined;
  if (!isSingleDate) {
    endDate = parse(dates[1].trim(), "dd/MM/yyyy", new Date());
  }

  // Filter data based on whether it's a single date or a range
  const filtered = data
    .map((item) => ({
      ...item,
      referrals: item.referrals.filter((referral) => {
        const referralDate = parse(referral.date, "MMMM d, yyyy", new Date());
        if (isSingleDate) {
          // For a single date, check if the referral date is the same
          return isSameDay(referralDate, startDate);
        } else {
          // For a date range, check if the referral date is within the interval
          return endDate
            ? isWithinInterval(referralDate, { start: startDate, end: endDate })
            : false;
        }
      }),
    }))
    .filter((item) => item.referrals.length > 0); // Only keep entries with referrals within the date(s)

  buffer.push(...filtered);

  return buffer;
};

export let filterData2 = (
  dateRange: string, // e.g., "01/01/2023" or "01/01/2023-31/01/2023"
  data: Array<{
    full_name: string;
    program: string;
    registration_date: string; // Expected format: "MMMM d, yyyy" (e.g., "January 1, 2023")
  }>
) => {
  let buffer: Array<{
    full_name: string;
    program: string;
    registration_date: string;
  }> = [];

  // Check if it's a single date or a date range
  const dates = dateRange.split("-");
  const isSingleDate = dates.length === 1;

  // Parse the date(s)
  const startDate = parse(dates[0].trim(), "dd/MM/yyyy", new Date());

  let endDate: Date | undefined;
  if (!isSingleDate) {
    endDate = parse(dates[1].trim(), "dd/MM/yyyy", new Date());
  }

  // Filter data based on whether it's a single date or a range
  const filtered = data.filter((item) => {
    const registrationDate = parse(
      item.registration_date,
      "MMMM d, yyyy",
      new Date()
    );

    if (isSingleDate) {
      // For a single date, check if the registration date matches the start date
      return isSameDay(registrationDate, startDate);
    } else {
      // For a date range, check if the registration date is within the range
      return endDate
        ? isWithinInterval(registrationDate, {
            start: startDate,
            end: endDate,
          })
        : false;
    }
  });

  buffer.push(...filtered);

  return buffer;
};
