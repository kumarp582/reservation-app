var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  scalar Date

	input ReservationInput {
		arrivalDate: String
		departureDate: String
		hotelName: String
		name: String
	}
  type Reservation {
    _id: ID!
  	name: String,
    hotelName: String,
    arrivalDate: Date,
    departureDate: Date
  }
  type Query {
    hello: String
    getAllreservations(hotelName: String, arrivalDate: String,  departureDate: String,  name: String): [Reservation]
    getReservationById(id: String): Reservation
  }
  type Mutation {
    createReservation(input: ReservationInput): Reservation
  }
`);

module.exports = {
  schema: schema
}