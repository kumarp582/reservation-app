import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './ui-app/app';

let rootElement = document.getElementById('app');
if(rootElement) {
    render(
        <BrowserRouter>
            <App/>
        </BrowserRouter>,
        document.getElementById('app')
    );
}
