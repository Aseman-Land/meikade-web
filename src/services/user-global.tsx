import { jwtDecode } from 'jwt-decode';
import { Cookies } from "react-cookie";
import { MkMyUserWithBooks } from "../models/book";
import * as User from "./user";

interface CustomJwtPayload {
	password_change_auth?: string | boolean;
	user_id?: string;
	token_session?: string;
}

var user: MkMyUserWithBooks | null = null;
var userId: number = 0;
var userName: string = '';
var acceptedRulesVersion: number = -1;
var loading: boolean = false;
var hasPasswordChangeAuth: boolean = false;

const reloadUser = async () => {
	loading = true;
	const cookies = new Cookies();
	userName = cookies.get('user_name');

	const token = cookies.get('token');
	if (token) {
		try {
			const decoded = jwtDecode<CustomJwtPayload>(token);
			if (decoded.password_change_auth !== undefined) {
				const claimValue = decoded.password_change_auth;
				if (typeof claimValue === 'boolean') {
					hasPasswordChangeAuth = claimValue;
				} else if (typeof claimValue === 'string') {
					hasPasswordChangeAuth = claimValue.toLowerCase() === 'true';
				}
			}
		} catch (error) {
			console.error('Invalid JWT token:', error);
			hasPasswordChangeAuth = false;
		}
	}

	try {
		const res = (await User.MkUserServices.me());
		if (res.status == false) {
			if (res.code == 401) {
				cookies.remove('token', { path: '/' });
				location.href = '/';
			}
			throw false;
		}

		const d = res.result!
		user = d;
		userId = d.id;
		userName = (d.firstname + " " + d.lastname).trim();
		acceptedRulesVersion = 0;
	} catch (e) {
		userId = 0;
		userName = '';
		acceptedRulesVersion = 0;
		hasPasswordChangeAuth = false;
	}

	var expire = new Date();
	expire.setDate(expire.getDate() + 365);

	cookies.remove('user_name', { path: '/' });
	cookies.set('user_name', userName, { path: '/', expires: expire });
	loading = false;
};

export { acceptedRulesVersion, hasPasswordChangeAuth, loading, reloadUser, user, userId, userName };
