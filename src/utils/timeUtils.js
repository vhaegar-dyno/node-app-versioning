const moment = require('moment');

class TimeUtils {
	static getCurrentDate() {
		const date = new Date();
		return date.toISOString().split('T')[0];
	}

	// returns in epoch seconds
	static addDaysHoursToDate(date, days, hours, minutes, seconds) {
		const timestamp = new Date(date);
		const daysMs = days * 24 * 3600 * 1000;
		const newDate = timestamp + daysMs;
		if (hours >= 0 && minutes >= 0 && seconds >= 0) {
			const newHours = new Date(newDate).setHours(hours, minutes, seconds, 0);
			return newHours;
		}
		return newDate;
	}

	static findDaysDifference(primary, secondary) {
		const primaryDate = new Date(primary);
		const secondaryDate = new Date(secondary);
		const diffTime = Math.abs(primaryDate - secondaryDate);
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	static findMonthDifference(primary, secondary) {
		const primaryDate = new Date(primary);
		const secondaryDate = new Date(secondary);
		return (
			(secondaryDate.getFullYear() - primaryDate.getFullYear()) * 12 +
			(secondaryDate.getMonth() - primaryDate.getMonth()) +
			1
		);
	}

	static formatDate(date, format) {
		if (format === 'DD/MM/YYYY') {
			const _date = new Date(date).toISOString().split('T')[0];
			return _date.split('-').reverse().join('/');
		}
		return date;
	}

	static generateTimestampsFromPeriod(period, timestamp) {
		let startTime = moment(timestamp).startOf('day').toDate();
		let endTime = moment(timestamp).endOf('day').toDate();

		if (period === 'month') {
			startTime = moment(timestamp).startOf('month').toDate();
			endTime = moment(timestamp).endOf('month').toDate();
		}

		if (period === 'year') {
			startTime = moment(timestamp).startOf('year').toDate();
			endTime = moment(timestamp).endOf('year').toDate();
		}

		return { startTime, endTime };
	}

	static destructTimestamp(timestamp, monthFormat = null) {
		const date = new Date(timestamp);
		return {
			year: date.getFullYear(),
			month: date.toLocaleString('en-US', { month: `${monthFormat || '2-digit'}` }),
			day: date.getDate(),
		};
	}
}

module.exports = TimeUtils;
