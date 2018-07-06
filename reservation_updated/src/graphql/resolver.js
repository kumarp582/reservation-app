var Q = require('q'),
    moment = require('moment'),
    Reservation = require('../models/reservation')

var _ = require('lodash');

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  createReservation: function ({input}) {
      var deferred = Q.defer();
      var newReservation = new Reservation({
          name: input.name.trim(),
          hotelName: input.hotelName,
          arrivalDate: new Date(input.arrivalDate),
          departureDate: new Date(input.departureDate)
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
  getAllreservations: function (filter) {

    let filteredResults = _.reduce(filter, (result, value, key) => {
        if (value.length > 0) {
            result[key] = value;
        }
        return result;
    }, {});

      var deferred = Q.defer();

      Reservation.find(filteredResults, {
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
  getReservationById: function (input) {
    var deferred = Q.defer();
    return Reservation.findOne({
        _id: input.id
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

module.exports = {
  root: root
};