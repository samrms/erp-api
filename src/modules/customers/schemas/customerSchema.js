export const customerSchema = {
  body: [
    { name: "name", rules: "required|string|min:1" },
    { name: "email", rules: "optional|email" },
  ],
};
