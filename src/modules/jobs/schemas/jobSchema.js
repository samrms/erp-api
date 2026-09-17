export const jobSchema = {
  body: [
    { name: 'jobType', rules: 'required|string' },
    { name: 'payload', rules: 'optional|object' },
  ],
};
