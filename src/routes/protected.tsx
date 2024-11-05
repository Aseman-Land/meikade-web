import {
    Navigate,
    useLocation,
    RoutesProps,
} from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps extends RoutesProps {
    path?: string,
    element: ReactNode
    // component?: React.ComponentType<RouteProps> | React.ComponentType<any>;
    // roles?: string[]
}

const ProtectedRoute = ({element }: ProtectedRouteProps) => {
    useEffect(() => {
    })

    return element;
};

export default ProtectedRoute