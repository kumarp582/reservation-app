Get All reservations:
http://localhost:3000/graphql?query=%7B%0A%20%20getAllreservations%20%7B%0A%20%20%20%20name%0A%20%20%20%20hotelName%0A%20%20%20%20arrivalDate%0A%20%20%20%20departureDate%0A%20%20%7D%0A%7D

Create Reervation:
http://localhost:3000/graphql?query=mutation%20createReservation(%24input%3A%20ReservationInput)%7B%0A%20%20createReservation(input%3A%20%24input)%20%7B%0A%20%20%20%20hotelName%0A%20%20%20%20arrivalDate%0A%20%20%20%20name%0A%20%20%20%20departureDate%0A%20%20%20%20_id%0A%20%20%7D%0A%7D&variables=%7B%0A%20%20%22input%22%3A%7B%0A%20%20%20%20%22arrivalDate%22%3A%222018-04-28T00%3A00%3A00.000Z%22%2C%0A%20%20%20%20%22departureDate%22%3A%222018-04-30T23%3A59%3A59.999Z%22%2C%0A%09%09%22hotelName%22%3A%22T1%22%2C%0A%09%09%22name%22%3A%22test%22%0A%20%20%7D%0A%7D&operationName=createReservation

Get Reservation By Id:
http://localhost:3000/graphql?query=%7B%0A%20%20getReservationById(id%3A%20%225adb087f76dec46b8ca87e81%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20hotelName%0A%20%20%20%20arrivalDate%0A%20%20%20%20departureDate%0A%20%20%7D%0A%7D