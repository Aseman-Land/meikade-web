// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { isSignin } from '../services/user';

const PublicRoute: React.FC<any> = ({ component: Component, restricted, ...rest }) => {

    return (<></>
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        // <Route {...rest} render={props => (
        //     isSignin() && restricted ?
        //         <Redirect to="/dashboards" />
        //         : <Component {...props} />
        // )} />
    );
};

export default PublicRoute;