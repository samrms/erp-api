import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../setup/api.js";
import { grantPermissions } from "../setup/factories.js";

let api;
let counter = 0;

beforeAll(async () => {
  api = await startTestApi("e2e-job-flow");
});

afterAll(async () => {
  await api.close();
});

describe("background job flow", () => {
  it("submits a job, tracks it to completion, and sees the queued payload", async () => {
    const email = `worker-${++counter}@example.com`;
    const registered = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/register",
      {
        body: { email, password: "secret123", firstName: "Worker" },
      },
    );
    await grantPermissions(api.db, registered.body.id, ["job:read"]);
    const login = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
      body: { email, password: "secret123" },
    });
    const token = login.body.token;
    const auth = (method, path, opts = {}) =>
      apiFetch(api.baseUrl, method, path, { token, ...opts });

    const submitted = await auth("POST", "/api/v1/jobs", {
      body: { jobType: "report", payload: { format: "pdf" } },
    });
    expect(submitted.status).toBe(202);
    const jobId = submitted.body.id;

    const pending = await auth("GET", `/api/v1/jobs/${jobId}`);
    expect(pending.body.status).toBe("pending");

    expect(
      api.queue.added.some(
        (entry) =>
          entry.type === "report" &&
          entry.payload.jobId === jobId &&
          entry.payload.format === "pdf",
      ),
    ).toBe(true);

    await api.container.jobRepo.updateStatus(jobId, "completed");
    const done = await auth("GET", `/api/v1/jobs/${jobId}`);
    expect(done.body.status).toBe("completed");
  });
});
