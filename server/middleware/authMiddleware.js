import {
	validateToken,
	extractUserDataFromToken
} from "../service/authService.js";
import { UnauthenticatedError } from "../utils/httpError.js";

export async function authMiddleware(req, res, next) {
	const token = req.cookies.token;
	const {success, reason} = await validateToken(token);
	if(success) {
		const {user, accessToken} = await extractUserDataFromToken(token);
		req.userid = user.id;
		req.accessToken = accessToken;
	}
	else req.authFailedReason = reason;
	next();
}

export function catchAuthError(req, res, next) {
	if(req.userid == null) {
		return next(new UnauthenticatedError("로그인된 사용자가 아닙니다!"));
	}
	if(req.authFailedReason) {
		return next(new UnauthenticatedError(req.authFailedReason));
	}
	next();
}