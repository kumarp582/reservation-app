'use strict';
var Q = require('q'),
    moment = require('moment'),
    Reservation = require('../models/reservation'),
    ReservationService = {
        /**
         * Create a Reservation
         */
        createReservation: function (data) {
            var deferred = Q.defer();
            var newReservation = new Reservation({
                name: data.name.trim(),
                hotelName: data.hotelName,
                arrivalDate: new Date(data.arrivalDate),
                departureDate: new Date(data.departureDate)
            });
            newReservation.save(function (err, result) {
                if (err) {
                    deferred.reject(err.message);
                } else {
                    deferred.resolve(result);
                }
            });
            return deferred.promise;
        },
        /**
         * Get List of Reservation
         */
        getAll: function (filter) {
            var deferred = Q.defer();
            Reservation.find(filter, {
                __v: 0
            }, function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            }).sort({
                created_at: 'desc'
            });
            return deferred.promise;
        },
        /**
         * Search Reservation By reservation Id
         */
        getById: function (id) {
            var deferred = Q.defer();
            return Reservation.find({
                _id: id
            }, {
                __v: 0
            }, function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
            return deferred.promise;
        }
    };
module.exports = ReservationService;