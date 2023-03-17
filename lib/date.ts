import formatDate from 'intl-dateformat';

function formatDates(date1: string, date2: string): string | null {
    const startDate = date1
        ? formatDate(new Date(date1), 'MM-YYYY')
        : null;
    const endDate = date2
        ? formatDate(new Date(date2), 'MM-YYYY')
        : null;

    const dates =
        startDate && endDate
            ? startDate + ' / ' + endDate
            : endDate
                ? endDate
                : null;

    return dates;
}

export default formatDates;
