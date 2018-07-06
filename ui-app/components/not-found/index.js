import React from 'react';
import notFoundImage from './../../assets/images/app-images/not-found.png';
import { Link } from 'react-router-dom';

export default class extends React.Component {
    render() {
        return (
            <div className="not-found-container">
                <div className="image-section">
                    <img src={notFoundImage} />
                </div>
                <div className="text-section">
                    <div className="details">
                        <div className="heading">
                            Sorry! Page not found.
                        </div>
                        <div className="description">
                            Unfortunately the page you are looking for has been moved or deleted.
                        </div>
                        <div>
                            <Link to="/">Navigate to home</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
