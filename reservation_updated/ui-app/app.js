import React from 'react';
import MyRouter from './components/my-router';
import 'react-dates/initialize';
// import { setSelectedRoute } from './actions/routeActions';
import './assets/styles/main.scss';
import 'react-select/dist/react-select.css';
import 'react-table/react-table.css'
import 'react-dates/lib/css/_datepicker.css';

// appEnvironment is coming from webpack define plugin
export default class extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="app-wrapper">
                <div className="main-container">
                    <MyRouter/>
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}
