import { Cookies } from "react-cookie";

const signIn_route: string = '/auth';

const navicateTo = (path: string, extra: string) => {
    const pathname: string = window.location.pathname;
    const current_is_path = (pathname.substring(0, path.length) == path);
    if (!current_is_path)
        window.location.href = path + extra;
}

const checkUserRegisteration = async (setUpdatePackages: any|undefined) => {
}

export const checkRedirections = (setUpdatePackages: any|undefined) => {
    const cookies = new Cookies();
    const session_token = cookies.get('session_token');

    const pathname: string = window.location.pathname;

    const current_is_signIn = (pathname.substring(0, signIn_route.length) == signIn_route);

    if (!session_token && !current_is_signIn) {
        // window.location.href = '/auth/signin';
    } else if (session_token && (current_is_signIn)) {
        window.location.href = '/'
    } else if (session_token) {
        checkUserRegisteration(setUpdatePackages);
    }
} 
