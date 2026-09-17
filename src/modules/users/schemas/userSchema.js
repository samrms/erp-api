export const userSchema = {
  body: [
    { name: "email", rules: "required|email" },
    { name: "password", rules: "required|min:6" },
  ],
};
