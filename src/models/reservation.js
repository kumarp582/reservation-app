var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var ReservationSchema = new Schema({
    name: String,
    hotelName: String,
    arrivalDate: {
        type : Date,
        default: Date.now
    },
    departureDate: Date
});
module.exports = mongoose.model('Reservation', ReservationSchema);