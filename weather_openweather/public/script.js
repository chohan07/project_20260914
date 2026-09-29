const citySelect = document.getElementById("city-select");

// 오늘 날짜 표시
const today = new Date();
document.getElementById("date").textContent = today.toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

// 도시 선택에 따라 날씨 불러오는 함수
async function loadWeather(city = "seoul") {
  try {
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "날씨 정보 호출 실패");
    }

    document.getElementById("city").textContent = data.name;
    document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°C";
    document.getElementById("feels-like").textContent = Math.round(data.main.feels_like) + "°C";
    document.getElementById("humidity").textContent = data.main.humidity + "%";
    document.getElementById("wind").textContent = data.wind.speed + " m/s";
    document.getElementById("pressure").textContent = data.main.pressure + " hPa";
    document.getElementById("description").textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById("error").textContent = "";

  } catch (error) {
    console.error(error);
    document.getElementById("error").textContent = "날씨 정보를 불러오지 못했습니다.";
  }
}

// 셀렉트 박스 변경 시 이벤트
citySelect.addEventListener("change", (e) => {
  loadWeather(e.target.value);
});

// 초기 실행 (서울)
loadWeather();