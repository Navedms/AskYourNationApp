import client from './client';

const endpoint = '/users';

export interface Nation {
	name?: string;
	flag?: string;
}

export type SortBy = 'total' | 'questions' | 'answers';

export interface Points {
	total: number;
	questions: number;
	answers: number;
}

export interface User {
	id: string;
	email?: string;
	iat?: number;
	firstName?: string;
	lastName?: string;
	password?: string;
	terms?: boolean;
	nation?: Nation;
	active?: boolean;
	points?: Points;
	postQuestions?: string[];
	answeredQuestions?: string[];
	rank?: number;
	token?: string;
	sounds: boolean;
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

const loginRegister = ({
	email,
	password,
	firstName,
	lastName,
	nation,
}: User) =>
	client.post(endpoint, {
		email,
		password,
		firstName,
		lastName,
		nation,
	});

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

const update = ({ id, firstName, lastName, nation }: User) =>
	client.patch(`${endpoint}/update`, {
		id,
		firstName,
		lastName,
		nation,
	});

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
};
