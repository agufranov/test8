const express = require('express');
const mongoose = require('mongoose');
const { Order } = require('./schema');

const app = express();

const processResponse = (res) => {
	return [
		res.json.bind(res),
		(err) => {
			console.log('Error', err);
			// error handling
		}
	];
};

app
	.get('/orders', (req, res) => {
		let query;
		if (req.query.company) {
			query = { companyName: req.query.company };
		} else if (req.query.address) {
			query = { customerAddress: req.query.address };
		}
		Order.find(query).then(...processResponse(res));

	})

	.delete('/orders/:id', (req, res) => {
		Order.remove({ _id: req.params.id })
			.then(...processResponse(res));
	})
	.get('/orders/counts', (req, res) => {
		Order.aggregate([
			{
				$group: {
					_id: '$orderedItem',
					count: {$sum: 1}
				}
			},
			{
				$sort: {
					count:-1
				}
			},
			{
				$project: {
					_id: 0,
					orderedItem: '$_id',
					count: 1
				}
			}
		])
			.then(...processResponse(res));
	});

mongoose.connect('mongodb://localhost/test').then(() => {
	app.listen(3000);
});
