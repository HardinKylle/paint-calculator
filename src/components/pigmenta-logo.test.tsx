import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PigmentaLogo } from "./pigmenta-logo";

describe("PigmentaLogo", () => {
  it("renders an accessible generated image logo", () => {
    const markup = renderToStaticMarkup(<PigmentaLogo />);

    expect(markup).toContain("<img");
    expect(markup).toContain('alt="Pigmenta logo"');
    expect(markup).toContain("pigmenta-logo-v2.png");
    expect(markup).toContain('data-logo-mark="pigmenta"');
  });

  it("has generated logo, app icon, and favicon assets", () => {
    const logoPath = join(process.cwd(), "public/pigmenta-logo-v2.png");
    const iconPath = join(process.cwd(), "src/app/icon.png");
    const faviconPath = join(process.cwd(), "src/app/favicon.ico");

    expect(existsSync(logoPath)).toBe(true);
    expect(existsSync(iconPath)).toBe(true);
    expect(existsSync(faviconPath)).toBe(true);
    expect(readFileSync(logoPath).subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(readFileSync(iconPath).subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(readFileSync(faviconPath).readUInt16LE(2)).toBe(1);
  });
});
