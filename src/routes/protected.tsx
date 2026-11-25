import { ReactNode, useEffect } from 'react';
import {
  RoutesProps
} from 'react-router-dom';

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