import bcrypt from "bcrypt";

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const checkPasswordHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export function passwordCheck(str: string) {
  const symbolRegex = /[^a-zA-Z0-9]/;
  return (
    /[a-zA-Z]/.test(str) &&
    /\d/.test(str) &&
    symbolRegex.test(str) &&
    str.length >= 8
  );
}
