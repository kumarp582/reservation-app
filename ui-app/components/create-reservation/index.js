import React from 'react';
import { cpService } from '../../services/dataService';
import { Link } from 'react-router-dom';
import ValidateEnabledField from '../validate-enabled-field';
import moment from 'moment';
import axios from 'axios';
import toastr from 'toastr';
const BASE_URL = process.env.BASE_URL

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelObject: {},
            validationObject: {},
            validationTime: null
        };
        this.onFieldChange = this.onFieldChange.bind(this);
    }
    render() {
        let config = this.state;
        return (
            <div className="create-reservation">
                <div className="module-heading">Create Reservation</div>
                <div className="clear"></div>
                <div className="input-field">
                    <ValidateEnabledField onValueChange={this.onFieldChange}
                                          config={{
                                              id: "name",
                                              inputType: "TEXT",
                                              isActive: true,
                                              labelName: "Name",
                                              fieldValue: config.modelObject["name"],
                                              isMandatory: true,
                                              validationTime: this.state.validationTime
                                          }}/>
                </div>
                <div className="input-field">
                    <ValidateEnabledField onValueChange={this.onFieldChange}
                                          config={{
                                              id: "hotelName",
                                              className: "cp-react-select",
                                              inputType: "DROPDOWN",
                                              isActive: true,
                                              labelName: "Hotel Name",
                                              validationTime: this.state.validationTime,
                                              isMandatory: true,
                                              fieldValue: config.modelObject["hotelName"],
                                              labelKey: "name",
                                              valueKey: "name",
                                              fieldOptions: [{
                                                  name: "T1",
                                              }, {
                                                  name: "T2",
                                              }, {
                                                  name: "T3",
                                              }, {
                                                  name: "T4",
                                              }]
                                          }} />
                </div>
                <div className="input-field">
                    <ValidateEnabledField onValueChange={this.onFieldChange}
                                          config={{
                                              id: "arrivalDate",
                                              inputType: "DATE",
                                              isActive: true,
                                              labelName: "Arrival Date",
                                              fieldValue: config.modelObject["arrivalDate"],
                                              validationTime: this.state.validationTime,
                                              isMandatory: true,
                                              additionalConfig: {
                                                isOutsideRange: (currentDate) => {
                                                    let departureDate = config.modelObject["departureDate"];
                                                    let endDate = moment(departureDate);
                                                    if(departureDate) {
                                                        return !(currentDate <= endDate && currentDate >= moment());
                                                    } else {
                                                        return !(currentDate >= moment());
                                                    }
                                                }
                                            }
                                          }} />

                </div>
                <div className="input-field">
                    <ValidateEnabledField onValueChange={this.onFieldChange}
                                          config={{
                                              id: "departureDate",
                                              inputType: "DATE",
                                              isActive: true,
                                              fieldValue: config.modelObject["departureDate"],
                                              labelName: "Departure Date",
                                              validationTime: this.state.validationTime,
                                              isMandatory: true,
                                              additionalConfig: {
                                                isOutsideRange: (currentDate) => {
                                                    let firstDate = moment(config.modelObject["arrivalDate"]);
                                                    return currentDate < firstDate;
                                                }
                                            }
                                          }} />
                </div>
                <div>
                    <button className="fk-button filled medium" onClick={this.saveData}>Save</button>
                    <Link to='/' className="fk-button filled medium">Cancel</Link>
                </div>
            </div>
        );
    }
    onFieldChange({id, selectedValue, validationStatus}) {
        let { modelObject, validationObject } = this.state;
        modelObject[id] = selectedValue;
        validationObject[id] = validationStatus;
        this.setState({
            modelObject,
            validationObject
        });
    }
    saveData = () => {
        this.setState({
            validationTime: +new Date
        }, () => {
            let fieldKeys = Object.keys(this.state.validationObject);
            let validationStatus = fieldKeys.every(key => this.state.validationObject[key]);
            let postData = { ...this.state.modelObject };
            if(validationStatus) {
                // cpService.post("createReservation", {}, {
                //     data: {
                //         ...postData,
                //         hotelName: postData.hotelName.name,
                //         arrivalDate: moment(postData.arrivalDate).format('YYYY-MM-DD') + "T00:00:00.000Z",
                //         departureDate: moment(postData.departureDate).format('YYYY-MM-DD') + "T23:59:59.999Z"
                //     }
                // }).then(() => {
                //     this.props.history.push('/');
                //     toastr.success("Reservation created successfully.");
                // });
                var payload ={
                  "query": `
                    mutation createReservation($input: ReservationInput){
                      createReservation(input: $input) {
                        hotelName
                        arrivalDate
                        name
                        departureDate
                        _id
                      }
                    }
                  `, 
                  "variables": {
                    "input":{
                        hotelName: postData.hotelName.name,
                        arrivalDate: moment(postData.arrivalDate).format('YYYY-MM-DD') + "T00:00:00.000Z",
                        departureDate: moment(postData.departureDate).format('YYYY-MM-DD') + "T23:59:59.999Z",
                        name: postData.name,
                    }
                  } 
                }

                  axios({
                    url: BASE_URL,
                    method: 'post',
                    data: payload
                  }).then((response) => {
                    this.props.history.push('/');
                    toastr.success("Reservation created successfully.");
                  })

            }
        });
    }
}
