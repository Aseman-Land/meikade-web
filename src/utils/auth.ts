import { SHA256 } from 'crypto-js';

export const hashPassword = (pass: string): string => {
  const passwordSalt = '65ae7da2-acce-470e-9243-73fccd363ddc';
  const combinedString = `${passwordSalt}${pass}${passwordSalt}`;
  return SHA256(combinedString).toString();
};
