const http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const PORT = 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// 대한민국 주요 도시 좌표 데이터
const CITIES = {
  seoul: { name: "서울", lat: 37.5665, lon: 126.9780 },
  busan: { name: "부산", lat: 35.1796, lon: 129.0756 },
  daegu: { name: "대구", lat: 35.8714, lon: 128.6014 },
  incheon: { name: "인천", lat: 37.4563, lon: 126.7052 },
  gwangju: { name: "광주", lat: 35.1595, lon: 126.8526 }
};

if (!API_KEY) {
  console.error("❌ .env 파일에 OPENWEATHER_API_KEY가 설정되지 않았습니다!");
  process.exit(1);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

    // 1. 날씨 API 요청 (/api/weather?city=busan)
    if (reqUrl.pathname === "/api/weather") {
      const cityKey = reqUrl.searchParams.get("city") || "seoul";
      const targetCity = CITIES[cityKey] || CITIES.seoul;

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${targetCity.lat}&lon=${targetCity.lon}&appid=${encodeURIComponent(API_KEY)}&units=metric&lang=kr`;

      const response = await fetch(apiUrl);
      const data = await response.text();

      res.writeHead(response.ok ? 200 : response.status, {
        "Content-Type": "application/json; charset=utf-8"
      });
      res.end(data);
      return;
    }

    // 2. 정적 웹페이지 서빙 (public 폴더 내)
    let requestedPath = reqUrl.pathname === "/" ? "/index.html" : reqUrl.pathname;
    const filePath = path.join(__dirname, "public", requestedPath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("페이지를 찾을 수 없습니다.");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });

  } catch (error) {
    console.error("서버 에러:", error);
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "서버 내부 오류 발생" }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ 날씨 앱 서버 실행 성공: http://localhost:${PORT}`);
});