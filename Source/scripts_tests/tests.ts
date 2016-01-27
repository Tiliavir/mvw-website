/// <reference path="../tsd_modules/tsd.d.ts" />
/// <reference path="../scripts/main.ts" />

module MVW {
  describe("getUrlParams", () => {
    function test(query: string, expected: { [key: string]: string; }): void {
      let urlParams = $.getUrlParams(query);
      expect(urlParams).toEqual(expected);
    }

    it("Empty string", () => {
      test("", {});
    });
    it("Null", () => {
      test(null, {});
    });
    it("Absolute URL with #", () => {
      let q = "http://mv-wollbach.de/album.html?year=2007&gallery=Platzkonzert#&gid=1&pid=1";
      test(q, { "year": "2007", "gallery": "Platzkonzert", "gid": "1", "pid": "1" });
    });
    it("Absolute URL", () => {
      let q = "http://mv-wollbach.de/album.html?year=2007&gallery=Platzkonzert";
      test(q, {"year": "2007", "gallery": "Platzkonzert"});
    });
    it("Absolute URL no params", () => {
      let q = "http://mv-wollbach.de/album.html";
      test(q, {});
    });
    it("Absolute URL no params just a question mark", () => {
      let q = "http://mv-wollbach.de/album.html?";
      test(q, {});
    });
    it("Server Relative URL", () => {
      let q = "/album.html?year=2007&gallery=Platzkonzert";
      test(q, { "year": "2007", "gallery": "Platzkonzert" });
    });
    it("Server Relative URL no params", () => {
      let q = "/album.html";
      test(q, {});
    });
    it("Server Relative URL no params just a question mark", () => {
      let q = "/album.html?";
      test(q, {});
    });
  });

  describe("getUrlParam", () => {
    function test(query: string, key: string, expected: string): void {
      let urlParam = $.getUrlParam(key, query);
      expect(urlParam).toEqual(expected);
    }

    it("Empty string", () => {
      test("", "", undefined);
    });
    it("Null", () => {
      test(null, null, undefined);
    });
    it("Absolute URL with #", () => {
      let q = "http://mv-wollbach.de/album.html?year=2007&gallery=Platzkonzert#&gid=1&pid=1";
      test(q, "year", "2007");
      test(q, "gallery", "Platzkonzert");
      test(q, "gid", "1");
      test(q, "pid", "1");
      test(q, "invalid", undefined);
    });
    it("Absolute URL", () => {
      let q = "http://mv-wollbach.de/album.html?year=2007&gallery=Platzkonzert";
      test(q, "year", "2007");
      test(q, "gallery", "Platzkonzert");
      test(q, "invalid", undefined);
    });
    it("Absolute URL no params", () => {
      let q = "http://mv-wollbach.de/album.html";
      test(q, "invalid", undefined);
    });
    it("Absolute URL no params just a question mark", () => {
      let q = "http://mv-wollbach.de/album.html?";
      test(q, "invalid", undefined);
    });
    it("Server Relative URL", () => {
      let q = "/album.html?year=2007&gallery=Platzkonzert";
      test(q, "year", "2007");
      test(q, "gallery", "Platzkonzert");
      test(q, "invalid", undefined);
    });
    it("Server Relative URL no params", () => {
      let q = "/album.html";
      test(q, "invalid", undefined);
    });
    it("Server Relative URL no params just a question mark", () => {
      let q = "/album.html?";
      test(q, "invalid", undefined);
    });
  });
}
