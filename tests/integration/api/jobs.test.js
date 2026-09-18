import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";

let api;
let token;

beforeAll(async () => {
  api = await startTestApi("api-jobs");
  token = api.tokenFor(["job:read"]);
});

afterAll(async () => {
  await api.close();
});

const req = (method, path, opts = {}) =>
  apiFetch(api.baseUrl, method, path, { token, ...opts });

describe("jobs endpoints", () => {
  it("accepts a job and persists it as pending", async () => {
    const before = api.queue.added.length;
    const res = await req("POST", "/api/v1/jobs", {
      body: { jobType: "report", payload: { format: "pdf" } },
    });
    expect(res.status).toBe(202);
    expect(res.body.job_type).toBe("report");
    expect(res.body.status).toBe("pending");

    expect(api.queue.added.length).toBe(before + 1);
    const queued = api.queue.added[api.queue.added.length - 1];
    expect(queued.type).toBe("report");
    expect(queued.payload).toEqual({ jobId: res.body.id, format: "pdf" });

    const count = await api.db.query(
      "SELECT COUNT(*) AS c FROM jobs WHERE job_type = $1",
      ["report"],
    );
    expect(Number(count.rows[0].c)).toBeGreaterThanOrEqual(1);
  });

  it("reports job status by id", async () => {
    const submitted = await req("POST", "/api/v1/jobs", {
      body: { jobType: "export", payload: {} },
    });
    const res = await req("GET", `/api/v1/jobs/${submitted.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(submitted.body.id);
    expect(res.body.status).toBe("pending");
  });

  it("returns 404 for unknown jobs", async () => {
    expect(await req("GET", "/api/v1/jobs/999999")).toMatchObject({
      status: 404,
    });
  });

  it("validates the submission payload", async () => {
    const res = await req("POST", "/api/v1/jobs", { body: { payload: {} } });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects unauthenticated submissions", async () => {
    const res = await apiFetch(api.baseUrl, "POST", "/api/v1/jobs", {
      body: { jobType: "report" },
    });
    expect(res.status).toBe(401);
  });
});
