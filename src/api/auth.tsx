import client from './client';

const endpoint = '/users';

export interface Nation {
  name?: string;
  flag?: string;
}

export interface User {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  nation?: Nation;
}

export interface ForgotPassword {
  id?: string;
  email?: string;
  newPassword?: string;
  verificationCode?: number;
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

const ChangePasswordAfterReset = ({ id, newPassword }: ForgotPassword) =>
  client.patch(`${endpoint}/change-password-after-reset`, {
    id,
    newPassword,
  });

// const resetPassword = (id, oldPassword, newPassword) =>
//   client.post(`${endpoint}/reset-password`, {
//     id,
//     oldPassword,
//     newPassword,
//   });

export default {
  loginRegister,
  resetPassword,
  enterVerificationCode,
  ChangePasswordAfterReset,
};
