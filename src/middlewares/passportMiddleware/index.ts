import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_CONFIG } from '../../config/config';
import { UserModel } from '../../modules/users/model/users.model';
import jwt from 'jsonwebtoken';
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_CONFIG.JWT_SECRET;
export const passportMiddleware = passport.use(
	new JWTStrategy(opts, async function (jwt_payload, done) {
		try {
			const user = await UserModel.findById(jwt_payload.id).populate('roles');
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		} catch (error) {
			return done(error, false);
		}
	})
);

export const generateToken = (user: any) => {
	return jwt.sign(
		{
			id: user.isUserExists._id,
			name: user.isUserExists.fullName,
			email: user.isUserExists.email,
			roles: user.rolesArray
		},
		JWT_CONFIG.JWT_SECRET,
		{
			expiresIn: JWT_CONFIG.JWT_LOGIN_EXPIRES_IN
		}
	);
};

export const verifyJwtToken = (token: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_CONFIG.JWT_SECRET, (jwtVerifyError, decoded) => {
			if (jwtVerifyError) {
				reject(jwtVerifyError);
				return jwtVerifyError;
			} else {
				resolve(decoded);
			}
		});
	});
};
