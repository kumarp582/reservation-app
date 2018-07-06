import React from 'react';
import { cpService } from '../../services/dataService';
import { Link } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = process.env.BASE_URL

export default class extends React.Component {
    constructor(props) {
        super(props);
        let { matchParams } = props;
        this.state = {
            reservationId: matchParams.reservationId,
            details: null,
        };
    }
    componentWillMount() {
        // cpService.get("getReservationDetails", {
        //     reservationId: this.state.reservationId
        // }, {}).then((response) => {
        //   console.log(response.reservation, 'response')
        //     this.setState({
        //         details: response.reservation
        //     });
        // });

        axios({
          url: BASE_URL,
          method: 'post',
          data: {
            query: `
              {
                getReservationById(id: "${this.state.reservationId}") {
                  _id
                  name
                  hotelName
                  arrivalDate
                  departureDate
                }
              }
              `
          }
        }).then((response) => {
            this.setState({
                details: response.data.data.getReservationById
            });
        })
    }
    render() {
        let { details } = this.state;
        return (
            <div className="info-container">
                <div className="module-heading">
                <Link to="/"> <i className="icon icon-back"></i> Reservations</Link></div>
                <div className="clear"></div>
                {details ? (
                    <div className="reservation-details">
                        <div className="row">
                            <div className="label">Name</div>
                            <div className="value">{details.name}</div>
                        </div>
                        <div className="row">
                            <div className="label">Hotel Name</div>
                            <div className="value">{details.hotelName}</div>
                        </div>
                        <div className="row">
                            <div className="label">Arrival date</div>
                            <div className="value">{details.arrivalDate.split("T")[0]}</div>
                        </div>
                        <div className="row">
                            <div className="label">Departure date</div>
                            <div className="value">{details.departureDate.split("T")[0]}</div>
                        </div>
                    </div>
                ): null}
            </div>
        );
    }
}
