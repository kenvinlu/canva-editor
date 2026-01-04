
export interface UserLoginResponse {
	jwt: string;
	user: UserModel;
	verifyType: string;
	message: string;
	email: string;
}
export type UserCreateModel = {
	firstName: string;
	lastName: string;
	phone?: string;
	username?: string;
	email?: string;
	password?: string;
	avatar?: string;
}

export type UserModel = UserCreateModel & {
	id: number;
	provider: string;
	discoverFrom: string;
	confirmed: boolean;
	blocked: boolean;
	gender: string;
	birthday: string;
	avatar: string;
	deviceToken: string;
	createdAt: string;
	updatedAt: string;

	// 2FA
	enableTotp?: boolean | null;
	enableOtp?: boolean | null;
  	totpSecret?: string | null;

	// Extends from provider
	given_name?: string;
	family_name?: string;
}

export type UserChangePasswordModel = {
	currentPassword: string;
	password: string;
	passwordConfirmation: string
}
