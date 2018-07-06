var Q = require('q'),
    express = require('express'),
    moment = require('moment'),
    router = express.Router(),
    reservationService = require('../services/reservationService'),
    reservationController = {
        /**
         * Get all the reservations
         * @param req
         * @param res
         * @returns {Object}
         */
        /**
         * Get All reservations example
         * localhost:3000/reservations
         * 
         */
        /**
         * Filter Query Example
         * localhost:3000/reservations?departureDate=2018-04-22&hotelName=test4&arrivalDate=2018-04-20
         */
        getAll: function (req, res) {
            /*   GET /reservations?hotelName=X&arrivalDate=Y&departureDate=Z –
               Returns all reservations that match the search criteria */
            var filter = {};
            var obj = req.query;
            obj.hotelName ? (filter['hotelName'] = obj.hotelName.trim()) : '';
            obj.departureDate ? (filter['departureDate'] = {
                '$lte': moment(obj.departureDate).add(1, 'day'),
                '$gte': moment(obj.departureDate)
            }) : {};
            obj.arrivalDate ? (filter['arrivalDate'] = {
                '$lte': moment(obj.arrivalDate).add(1, 'day'),
                '$gte': moment(obj.arrivalDate)
            }) : {};

            return reservationService.getAll(filter).then(function (data, err) {
                if (!err) {
                    res.send({
                        reservations: data
                    });
                } else {
                    res.send({
                        error: err,
                        message: 'Unable to fetch reservations data'
                    });
                }
            });
        },

        /*
         * Get reservation by reservation id
         * @param req
         * @param res
         * @returns {Object}
         */
        getById: function (req, res) {
            return reservationService.getById(req.params.id).then(function (data, err) {
                if (!err) {
                    if (data.length === 1) {
                        res.send({
                            reservation: data[0]
                        });
                    } else {
                        res.send({
                            message: "No reservation exist"
                        });
                    }

                } else {
                    res.send({
                        error: err,
                        message: 'Unable to fetch Reservation Data'
                    });
                }
            });
        },
        /** 
         * Create a reservation.
         * @param req
         * @param res
         * @returns {Promise|Promise.<TResult>|*}
         */
        /* {
            "name":"test4",
            "reservationId":4,
            "hotelName":"test4",
            "arrivalDate":"Fri Apr 20 2018 22:04:57 GMT+0530 (IST)",
            "departureDate":"Sun Apr 22  2018 22:04:57 GMT+0530 (IST)"
        }*/
        create: function (req, res) {
          /*   var reservationId = req.body.reservationId;
            if (reservationId != null && reservationId != 'null' && reservationId != '') { */
                return reservationService.createReservation(req.body).then(function (data, err) {
                    if (!err) {
                        return res.send({
                            id: reservationId,
                            message: 'Reservation created successfully',
                            data: 'OK'
                        });
                    } else {
                        return res.send({
                            error: err,
                            message: 'unable to create Reservation'
                        });
                    }
                }).fail(function (err) {
                    return res.send({
                        error: err,
                        message: 'unable to create Reservation'
                    });
                });;
           /*  } else {
                return res.send({
                    error: new Error(),
                    message: 'Reservation id is required to create a reservation'
                });
            } */
        }

    };

module.exports = reservationController;