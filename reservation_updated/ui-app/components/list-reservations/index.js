import React from 'react';
import { cpService } from '../../services/dataService';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import ValidateEnabledField from "../validate-enabled-field";
import moment from "moment/moment";
import axios from 'axios';
import _ from 'lodash';

const BASE_URL = process.env.BASE_URL
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: [],
            isAdmin: false,
            showLoader: false,
            modelObject: {},
            validationTime: null,
            validationObject: {},
            filters: {}
        };
        this.configureGrid();
        this.onFieldChange = this.onFieldChange.bind(this);
    }
    componentWillMount() {
        this.fetchReservations();
    }
    fetchReservations() {
        let { filters } = this.state;
        this.setState({
            showLoader: true
        });
        // cpService.get("getListReservations", {}, {
        //     params: filters
        // }).then((response) => {
        //   console.log(response,'responseresponse')
        //     this.setState({
        //         reservations: response.reservations
        //     });
        // }).catch(() => {}).then(() => {
        //     this.setState({
        //         showLoader: false
        //     });
        // });
        if (!_.isEmpty(filters)) {
          var query =
          {
            query: `
              {
                getAllreservations(hotelName: "${filters.hotelName || ''}", arrivalDate: "${filters.arrivalDate || ''}", departureDate: "${filters.departureDate || ''}") {
                  name
                  hotelName
                  arrivalDate
                  departureDate
                  _id
                }
              }
              `
          }
        } else {
          var query =
          {
            query: `
              {
                getAllreservations {
                  name
                  hotelName
                  arrivalDate
                  departureDate
                  _id
                }
              }
              `
          }
        }

        axios({
          url: BASE_URL,
          method: 'post',
          data: query
        }).then((response) => {
            this.setState({
                reservations: response.data.data.getAllreservations
            });
        }).catch(() => {}).then(() => {
            this.setState({
                showLoader: false
            });
        });
    }
    configureGrid() {
        this.gridColumns = [{
            Header: 'Name',
            accessor: 'name'
        }, {
            Header: 'Hotel Name',
            accessor: 'hotelName'
        }, {
            Header: 'Arrival Date',
            accessor: 'arrivalDate',
            Cell: props => {
                return <div>{props.value.split("T")[0]}</div>
            }
        }, {
            Header: 'Departure Date',
            accessor: 'departureDate',
            Cell: props => {
                return <div>{props.value.split("T")[0]}</div>
            }
        }];
    }
    render() {
        let config = this.state;
        return (
            <div className="cli-users-container">
                <div className="module-heading">Reservations list</div>
                <div className="actions">
                    <Link to='/reservation/create' className="fk-button filled medium">Create</Link>
                </div>
                <div className="clear"></div>
                <div className="filters">
                    <div className="input-field">
                        <ValidateEnabledField onValueChange={this.onFieldChange}
                                              config={{
                                                  id: "hotelName",
                                                  inputType: "TEXT",
                                                  isActive: true,
                                                  labelName: "Hotel Name",
                                                  fieldValue: config.modelObject["hotelName"],
                                                  validations: [{
                                                      validator: "validateContent",
                                                      validationMessage: "Allowed characters: 0-9a-zA-Z!@#$%^&*()"
                                                  }]
                                              }}/>
                    </div>
                    <div className="input-field">
                        <ValidateEnabledField onValueChange={this.onFieldChange}
                                              config={{
                                                  id: "arrivalDate",
                                                  inputType: "DATE",
                                                  isActive: true,
                                                  labelName: "Arrival Date",
                                                  fieldValue: config.modelObject["arrivalDate"],
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

                                              }}/>
                    </div>
                    <div className="input-field">
                        <ValidateEnabledField onValueChange={this.onFieldChange}
                                              config={{
                                                  id: "departureDate",
                                                  inputType: "DATE",
                                                  isActive: true,
                                                  labelName: "Departure Date",
                                                  fieldValue: config.modelObject["departureDate"],
                                                  additionalConfig: {
                                                    isOutsideRange: (currentDate) => {
                                                        let firstDate = moment(config.modelObject["arrivalDate"]);
                                                        return currentDate < firstDate;
                                                    }
                                                }
                                              }}/>
                    </div>
                    <button className="fk-button filled medium" onClick={this.filterContent}>FILTER</button>
                </div>
                <ReactTable
                    className="my-react-table -striped"
                    pageSizeOptions={[10, 20, 50, 100]}
                    defaultPageSize={20}
                    minRows={0}
                    data={this.state.reservations}
                    columns={this.gridColumns}
                    getTrProps={(state, rowInfo) => {
                        return {
                            onClick: (e) => {
                                this.props.history.push('/reservation-details/' + rowInfo.original._id);
                            },
                            style: {
                                cursor: "pointer"
                            }
                        }
                    }}/>
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
    filterContent = () => {
        this.setState({
            validationTime: +new Date
        }, () => {
            let fieldKeys = Object.keys(this.state.validationObject);
            let validationStatus = fieldKeys.every(key => this.state.validationObject[key]);
            let postData = { ...this.state.modelObject };
            if(validationStatus) {
                let filters = {
                    ...postData
                };
                if(postData.arrivalDate) {
                    filters.arrivalDate = moment(postData.arrivalDate).format('YYYY-MM-DD') + "T00:00:00.000Z";
                }
                if(postData.departureDate) {
                    filters.departureDate = moment(postData.departureDate).format('YYYY-MM-DD') + "T23:59:59.999Z";
                }
                this.setState({
                    filters
                }, () => {
                    this.fetchReservations();
                })
            }
        });
    }
}
