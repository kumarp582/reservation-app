import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { checkUserRole } from '../../services/routes';
import NotFound from '../../components/not-found';
import { pathRoutes } from '../../services/routes';

const notFoundHandler = () => {
    return (<NotFound/>);
};

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    getUrlParams(paramString, key) {
        const urlParams = new window.URLSearchParams(paramString);
        return urlParams.get(key);
    }
    render() {
        const routesList = pathRoutes.map((route) => {
            const MainComponent = route.component;
            return (
                <Route exact path={route.defaultPath} key={route.key} render={(routeProps) => {
                    const tabUrlParam = this.getUrlParams(routeProps.location.search, 'tab');
                    return checkUserRole(routeProps.match.path, this.props) ?
                        <MainComponent history={routeProps.history}
                                       matchParams={routeProps.match.params}
                                       tabUrlParam={tabUrlParam}/> : notFoundHandler()
                }}/>
            );
        });
        return (
            <Switch>
                {routesList}
                <Route render={() => {
                    return notFoundHandler();
                }}/>
            </Switch>
        )
    }
}
