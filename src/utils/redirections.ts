import { Cookies } from "react-cookie";

const signIn_route: string = '/register';
const verify_route: string = '/user/signin';

const goToQuestions = () => {
    // navicateTo('/user/question-list', '?mode=list&callback=/');
    navicateTo('/intro/allergy', '');
};

const navicateTo = (path: string, extra: string) => {
    const pathname: string = window.location.pathname;
    const current_is_path = (pathname.substring(0, path.length) == path);
    if (!current_is_path)
        window.location.href = path + extra;
}

export const checkRedirections = (setUpdatePackages: any|undefined) => {
    const cookies = new Cookies();
    const session_token = cookies.get('token');

    const pathname: string = window.location.pathname;

    const current_is_signIn = (pathname.substring(0, signIn_route.length) == signIn_route);
    const current_is_verify = (pathname.substring(0, verify_route.length) == verify_route);
    const current_is_root = (pathname == '/' || pathname.length == 0);

    if (!session_token && !current_is_signIn && !current_is_verify && !current_is_root) {
        window.location.href = signIn_route;
    } else if (!session_token && current_is_verify && !current_is_root) {
        window.location.href = signIn_route;
    } else if (session_token && (current_is_signIn)) {
        window.location.href = '/'
    }
} 
