import client from './client';

const endpoint = '/users';

export interface Nation {
	name?: string;
	flag?: string;
	language?: string;
}

export interface Translate {
	original?: string;
	translation?: string;
	note?: string;
}

export type SortBy = 'total' | 'questions' | 'answers';

export interface Points {
	total: number;
	questions: number;
	answers: number;
}

export interface User {
	id?: string;
	email?: string;
	iat?: number;
	firstName?: string;
	lastName?: string;
	profilePic?: string | string[];
	verifiedEmail?: boolean;
	password?: string;
	terms?: boolean;
	nation?: Nation;
	translate?: Translate;
	active?: boolean;
	points?: Points;
	postQuestions?: string[];
	answeredQuestions?: string[] | number;
	rank?: number;
	token?: string;
	sounds?: boolean;
	lastActivity?: Date;
	getMoreDitails?: boolean;
}

export interface ForgotPassword {
	id?: string;
	email?: string;
	newPassword?: string;
	verificationCode?: number;
}

export interface Filters {
	sortBy: SortBy;
	limit: number;
}

const test = (test?: Object) => client.post(`${endpoint}/test`, test);

const loginRegister = (user: User) => client.post(endpoint, user);

const resetPassword = (email?: string) =>
	client.patch(`${endpoint}/reset-password`, {
		email,
	});

const enterVerificationCode = ({ email, verificationCode }: ForgotPassword) =>
	client.patch(`${endpoint}/verification-code`, {
		email,
		verificationCode,
	});

const changePasswordAfterReset = ({ id, newPassword }: ForgotPassword) =>
	client.patch(`${endpoint}/change-password-after-reset`, {
		id,
		newPassword,
	});

// update user

const update = (
	{ id, firstName, lastName, nation, profilePic }: User,
	picChange: boolean
) => {
	const data = new FormData();

	data.append('id', id);
	firstName && data.append('firstName', firstName);
	lastName && data.append('lastName', lastName);
	data.append('nationName', nation?.name ? nation?.name : '');
	data.append('nationFlag', nation?.flag ? nation.flag : '');
	data.append('nationLanguage', nation?.language ? nation.language : '');
	if (picChange) {
		if (profilePic?.length === 0) {
			data.append('deletProfilePic', 'yes');
		} else {
			profilePic.forEach((image, index) => {
				data.append('file', {
					name: `profilePic-${index}-${id}`,
					type: 'image/jpg',
					uri: image,
				});
			});
		}
	}

	return client.patch(`${endpoint}/update/v2`, data, {
		headers: { 'content-type': 'multipart/form-data' },
	});
};

// get user profile
const getUser = (sortBy: SortBy) => client.get(`${endpoint}?sortBy=${sortBy}`);

// get top list
const getTop = ({ sortBy, limit }: Filters) =>
	client.get(`${endpoint}/top-ten?sortBy=${sortBy}&limit=${limit}`);

// Set Sounds
const setSounds = (id: string, value: boolean) =>
	client.patch(`${endpoint}/sounds?id=${id}&sounds=${value}`);

// Delete account
const deleteAccount = (id: string) => client.delete(`${endpoint}?id=${id}`);

const changePassword = (id: string, oldPassword: string, newPassword: string) =>
	client.patch(`${endpoint}/change-password`, {
		id,
		oldPassword,
		newPassword,
	});

export default {
	loginRegister,
	resetPassword,
	enterVerificationCode,
	changePasswordAfterReset,
	changePassword,
	getUser,
	update,
	getTop,
	setSounds,
	deleteAccount,
	test,
};
