const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	category: { type: String },
	passwordRaw: { type: String },
	pin: { type: String },
	clientName: { type: String, required: true },
	clientLogo: { type: String, required: true },
	plants: { type: Object, required: true },
	plantIds: { type: [Number], required: true, default: null },
	userType: { type: String },
	plantImages: { type: [String], required: true },
	timeout: { type: Number },
	isAuthenticated: { type: Boolean },
	token: { type: String },
	timestamp: { type: Date },
	email: { type: Array },
	name: { type: String },
	mobileNo: { type: String },
	emailId: { type: Object },
	organizationId: { type: mongoose.Schema.Types.ObjectId },
	accessLevel: {
		ticketManagementSystem: {
			isActive: { type: Boolean, default: false },
			access: { type: String },
		},
	},
});

UserSchema.pre('validate', async function (next) {
	if (!this.isNew) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
