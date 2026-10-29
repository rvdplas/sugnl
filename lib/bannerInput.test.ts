import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { getVisibleText, isBannerLive, parseBannerInput, parseBannerMessage } from "./bannerInput.ts";

const base = { message: "Hi", startsOn: "", endsOn: "", dismissible: "on" };

describe("parseBannerMessage", () => {
  test("keeps plain text as one segment", () => {
    assert.deepEqual(parseBannerMessage("Hello there"), [{ text: "Hello there" }]);
  });

  test("finds links in the running text", () => {
    assert.deepEqual(parseBannerMessage("Join [our newsletter](/newsletter) or [read more](https://example.com/x)!"), [
      { text: "Join " },
      { text: "our newsletter", href: "/newsletter" },
      { text: " or " },
      { text: "read more", href: "https://example.com/x" },
      { text: "!" },
    ]);
  });

  test("leaves a link with an unsafe URL as plain text", () => {
    assert.deepEqual(parseBannerMessage("[x](javascript:alert(1))"), [{ text: "[x](javascript:alert(1)" }, { text: ")" }]);
  });

  test("counts only visible text", () => {
    assert.equal(getVisibleText("Go [here](https://example.com/a/very/long/path)"), "Go here");
  });
});

describe("parseBannerInput", () => {
  test("accepts a message with links", () => {
    assert.deepEqual(parseBannerInput({ ...base, message: " Read [this](/newsletter) " }), {
      message: "Read [this](/newsletter)",
      startsOn: null,
      endsOn: null,
      dismissible: true,
    });
  });

  test("turns line breaks into spaces", () => {
    assert.equal(parseBannerInput({ ...base, message: "One\n two" })?.message, "One two");
  });

  test("makes a banner un-closable when the checkbox is off", () => {
    assert.equal(parseBannerInput({ ...base, dismissible: null })?.dismissible, false);
  });

  test("rejects an empty or too long message", () => {
    assert.equal(parseBannerInput({ ...base, message: "  " }), null);
    assert.equal(parseBannerInput({ ...base, message: "x".repeat(251) }), null);
  });

  test("does not count link URLs towards the limit", () => {
    const url = `https://example.com/${"a".repeat(100)}`;
    assert.ok(parseBannerInput({ ...base, message: `${"x".repeat(240)} [link](${url})` }));
  });

  test("rejects links with unsafe URLs", () => {
    for (const url of ["javascript:alert(1)", "http://example.com", "//evil.com", "/\\evil.com", "data:text/html,x"]) {
      assert.equal(parseBannerInput({ ...base, message: `Go [here](${url})` }), null, url);
    }
  });

  test("accepts only a start, only an end, both in order, or a single day", () => {
    assert.equal(parseBannerInput({ ...base, startsOn: "2026-11-01" })?.startsOn, "2026-11-01");
    assert.equal(parseBannerInput({ ...base, endsOn: "2026-11-02" })?.endsOn, "2026-11-02");
    assert.ok(parseBannerInput({ ...base, startsOn: "2026-11-01", endsOn: "2026-11-02" }));
    assert.ok(parseBannerInput({ ...base, startsOn: "2026-11-01", endsOn: "2026-11-01" }));
  });

  test("rejects invalid dates and an end before the start", () => {
    for (const startsOn of ["soon", "2026-02-30", "2026-13-45", "2026-11-01T10:00"]) {
      assert.equal(parseBannerInput({ ...base, startsOn }), null, startsOn);
    }
    assert.equal(parseBannerInput({ ...base, startsOn: "2026-11-02", endsOn: "2026-11-01" }), null);
  });
});

describe("isBannerLive", () => {
  // 1 November 2026, 00:30 in the Netherlands (winter time, UTC+1), still 31 October in UTC.
  const now = new Date("2026-10-31T23:30:00Z");

  test("shows without dates", () => {
    assert.equal(isBannerLive({ startsOn: null, endsOn: null }, now), true);
  });

  test("starts at the beginning of its start day in Dutch time", () => {
    assert.equal(isBannerLive({ startsOn: "2026-11-01", endsOn: null }, now), true);
    assert.equal(isBannerLive({ startsOn: "2026-11-02", endsOn: null }, now), false);
  });

  test("shows through the whole of its end day in Dutch time", () => {
    assert.equal(isBannerLive({ startsOn: null, endsOn: "2026-11-01" }, now), true);
    assert.equal(isBannerLive({ startsOn: null, endsOn: "2026-10-31" }, now), false);
  });

  test("follows summer time", () => {
    // 1 July 2026, 00:30 in the Netherlands (UTC+2), still 30 June in UTC.
    assert.equal(isBannerLive({ startsOn: "2026-07-01", endsOn: null }, new Date("2026-06-30T22:30:00Z")), true);
  });
});
