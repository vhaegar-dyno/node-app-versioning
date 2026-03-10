const TimeUtils = require('@utils/timeUtils');
const { makeRoundOff } = require('./basicMethods');

const calculatePR = (insolation, generation, capacity, opts = { precision: null }) => {
	if (!insolation || !generation || !capacity) return null;
	const pr = (generation / (insolation * capacity)) * 100;
	return opts.precision ? pr.toFixed(opts.precision) : pr;
};

const calculateCUF = (generation, capacity, opts = { precision: null }) => {
	if (!generation || !capacity) return null;
	const cuf = generation / (capacity * 24);
	return opts.precision ? cuf.toFixed(opts.precision) : cuf;
};

const calculateSpecificEnergy = (generation, capacity, opts = { precision: null }) => {
	if (!generation || !capacity) return null;
	const specificEnergy = generation / capacity;
	return opts.precision ? specificEnergy.toFixed(opts.precision) : specificEnergy;
};

const calculateExpectedEnergySite = (pvSyst, timestamp) => {
	if (!pvSyst?.report || !timestamp) return null;

	const { month } = TimeUtils.parseDate(timestamp);
	const monthDays = month?.totalDays;
	const monthLong = month?.monthLong?.toLowerCase();

	const monthlyGeneration = pvSyst?.report?.[monthLong]?.['generation'] || null;
	const expectedEnergy = monthlyGeneration / monthDays || null;
	return expectedEnergy;
};

const calculateExpectedEnergyInv = (pvSyst, capacityAc, prAc, timestamp) => {
	if (!pvSyst?.report || !capacityAc || !prAc || !timestamp) return null;

	const { month } = TimeUtils.parseDate(timestamp);
	const monthDays = month?.totalDays;
	const monthLong = month?.monthLong?.toLowerCase();

	// ? TODO: approve this calculation
	const monthlyInsolation = pvSyst?.report?.[monthLong]?.['insolation']
		? pvSyst?.report?.[monthLong]?.['insolation'] / monthDays || null
		: null;
	const pr = prAc / 100; // normalized pr per inverter
	const expectedEnergy = capacityAc * monthlyInsolation * pr || null;
	return expectedEnergy;
};

const calculateExpectedEnergyBySensor = (pvSyst, insolation, timestamp) => {
	if (!pvSyst?.report || !insolation || !timestamp) return null;

	const { month } = TimeUtils.parseDate(timestamp);
	const monthLong = month?.monthLong?.toLowerCase();
	const pvSystPr = pvSyst?.report?.[monthLong]?.['pr'] || null;

	const expectedEnergy = insolation * pvSystPr || null;
	return makeRoundOff(expectedEnergy, 2);
};

const calculateDeviation = (actual, expected) => {
	if (!actual && !expected) return null;
	else if (!actual && expected) return -100;
	else if (actual && !expected) return null;

	const percentage = (actual / expected) * 100 || 0;
	const deviation = 100 - percentage;
	return makeRoundOff(deviation, 2) * -1;
};

// ? Todo: verify this calculation
const calculateAvailability = (generated, loss) => {
	if (!generated || !loss) return null;
	const total = generated + loss;
	return makeRoundOff((generated / total) * 100, 2);
};

const calculateStatusTraditional = (status) => {
	let { total = 0, success = 0, failed = 0, skipped = 0, processing = 0 } = status;

	if (!total) total = success + failed + skipped + processing;
	if (!total) return '-';

	if (success === total) return `Success (${success}/${total})`;
	if (failed === total) return `Failed (${failed}/${total})`;
	if (skipped === total) return `Skipped (${skipped}/${total})`;
	if (processing === total) return `Processing (${processing}/${total})`;

	// prioritizing failed status:
	if (failed > 0) return `Failed (${failed}/${total})`; // Todo: Verify it once

	return `Partial (${success}/${total})`;
};

module.exports = {
	calculatePR,
	calculateCUF,
	calculateSpecificEnergy,
	calculateExpectedEnergySite,
	calculateExpectedEnergyInv,
	calculateDeviation,
	calculateAvailability,
	calculateExpectedEnergyBySensor,
	calculateStatusTraditional,
};
