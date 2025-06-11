export function calculateMonthDiff(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return Math.floor(totalDays / 30);
}