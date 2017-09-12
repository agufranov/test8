const mongoose = require('mongoose');

const Order = mongoose.model('Order', {
	companyName: { type: String, index: true },
	customerAddress: { type: String },
	orderedItem: { type: String, index: true }
});

module.exports = { Order };
