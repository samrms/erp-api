import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function jsFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...jsFiles(full));
    else if (entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

function assertNoImport(file, packages) {
  const content = fs.readFileSync(file, "utf8");
  for (const pkg of packages) {
    expect(
      content.includes(`from "${pkg}"`) || content.includes(`from '${pkg}'`),
      `${file} must not import ${pkg}`,
    ).toBe(false);
  }
}

describe("dependency direction", () => {
  it("shared/ has no infrastructure or framework imports", () => {
    const files = jsFiles(path.join(ROOT, "src/shared"));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      assertNoImport(file, [
        "express",
        "pg",
        "bullmq",
        "redis",
        "jsonwebtoken",
        "argon2",
      ]);
      expect(fs.readFileSync(file, "utf8")).not.toContain("modules/");
    }
  });

  it("infrastructure/ never imports application modules", () => {
    const files = jsFiles(path.join(ROOT, "src/infrastructure"));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      expect(content, `${file} must not depend on modules/`).not.toContain(
        "modules/",
      );
    }
  });

  it("repositories never touch HTTP or framework code", () => {
    const files = jsFiles(path.join(ROOT, "src/modules")).filter((f) =>
      f.includes("/repositories/"),
    );
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      assertNoImport(file, ["express", "express-validator"]);
    }
  });

  it("no module imports another module's controllers or routes", () => {
    const files = jsFiles(path.join(ROOT, "src/modules"));
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const imports = [...content.matchAll(/from ["']([^"']+)["']/g)].map(
        (m) => m[1],
      );
      for (const imp of imports) {
        expect(
          imp.includes("/controllers/") || imp.includes("/routes/"),
          `${file} must not import ${imp}`,
        ).toBe(false);
      }
    }
  });

  it("every module owns a routes directory (HTTP boundary is explicit)", () => {
    const modules = fs
      .readdirSync(path.join(ROOT, "src/modules"))
      .filter((m) =>
        fs.statSync(path.join(ROOT, "src/modules", m)).isDirectory(),
      );
    expect(modules.length).toBeGreaterThan(0);
    for (const mod of modules) {
      expect(
        fs.existsSync(path.join(ROOT, "src/modules", mod, "routes")),
        `module ${mod} must expose HTTP routes`,
      ).toBe(true);
    }
  });
});
