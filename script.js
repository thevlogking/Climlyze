/* =========================================================
   CLIMLYZE
   PROFESSIONAL WEATHER APPLICATION
   WEATHER + INDIAN AQI
   ========================================================= */


/* =========================================================
   OPENWEATHER API KEY
   ========================================================= */

/*
   IMPORTANT:

   Paste your EXISTING OpenWeather API key here.

   Example:

   const API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

*/

const API_KEY = "4f2ded401e9a4de4f2fda13cfdd35a2c";


/* =========================================================
   DEFAULT LOCATION
   ========================================================= */

const DEFAULT_LOCATION = {

    lat: 22.5726,

    lon: 88.3639,

    name: "Kolkata"

};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const brandButton =
    document.getElementById("brandButton");

const searchBar =
    document.getElementById("searchBar");

const searchButton =
    document.getElementById("searchButton");

const themeToggle =
    document.getElementById("themeToggle");


/* Weather */

const cityName =
    document.getElementById("cityName");

const updatedText =
    document.getElementById("updatedText");

const todayDate =
    document.getElementById("todayDate");

const weatherIcon =
    document.getElementById("weatherIcon");

const mainTemp =
    document.getElementById("mainTemp");

const mainCondition =
    document.getElementById("mainCondition");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const visibility =
    document.getElementById("visibility");

const pressure =
    document.getElementById("pressure");


/* Duplicate statistics */

const feelsLike2 =
    document.getElementById("feelsLike2");

const humidity2 =
    document.getElementById("humidity2");

const visibility2 =
    document.getElementById("visibility2");

const pressure2 =
    document.getElementById("pressure2");


/* Forecast */

const hourlyForecast =
    document.getElementById("hourlyForecast");

const tenDayForecast =
    document.getElementById("tenDayForecast");


/* AQI */

const aqiDisplay =
    document.getElementById("aqiDisplay");

const aqiCategory =
    document.getElementById("aqiCategory");

const aqiSource =
    document.getElementById("aqiSource");

const aqiIndicator =
    document.getElementById("aqiIndicator");

const primaryPollutant =
    document.getElementById("primaryPollutant");


/* Pollutants */

const pm25 =
    document.getElementById("pm25");

const pm10 =
    document.getElementById("pm10");

const no2 =
    document.getElementById("no2");

const so2 =
    document.getElementById("so2");

const o3 =
    document.getElementById("o3");

const co =
    document.getElementById("co");

const nh3 =
    document.getElementById("nh3");


/* =========================================================
   CHART VARIABLES
   ========================================================= */

let temperatureChart = null;

let aqiChart = null;


/* =========================================================
   MAP VARIABLES
   ========================================================= */

let weatherMap = null;

let locationMarker = null;


/* =========================================================
   AQI BREAKPOINTS
   ========================================================= */

/*
   Indian AQI / CPCB-style breakpoint ranges.

   Overall categories:

   0 – 50       Good
   51 – 100     Satisfactory
   101 – 200    Moderately Polluted
   201 – 300    Poor
   301 – 400    Very Poor
   401 – 500    Severe


   IMPORTANT:

   OpenWeather provides pollutant concentrations.

   Climlyze calculates the AQI sub-index from those
   concentrations rather than using OpenWeather's
   1–5 AQI value.
*/


const AQI_BREAKPOINTS = {


    /* =========================
       PM2.5
       ========================= */

    PM25: [

        {
            min: 0,
            max: 30,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 30,
            max: 60,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 60,
            max: 90,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 90,
            max: 120,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 120,
            max: 250,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 250,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ],


    /* =========================
       PM10
       ========================= */

    PM10: [

        {
            min: 0,
            max: 50,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 50,
            max: 100,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 100,
            max: 250,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 250,
            max: 350,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 350,
            max: 430,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 430,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ],


    /* =========================
       NO2
       ========================= */

    NO2: [

        {
            min: 0,
            max: 40,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 40,
            max: 80,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 80,
            max: 180,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 180,
            max: 280,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 280,
            max: 400,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 400,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ],


    /* =========================
       SO2
       ========================= */

    SO2: [

        {
            min: 0,
            max: 40,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 40,
            max: 80,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 80,
            max: 380,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 380,
            max: 800,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 800,
            max: 1600,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 1600,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ],


    /* =========================
       O3
       ========================= */

    O3: [

        {
            min: 0,
            max: 50,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 50,
            max: 100,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 100,
            max: 168,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 168,
            max: 208,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 208,
            max: 748,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 748,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ],


    /* =========================
       CO
       ========================= */

    CO: [

        {
            min: 0,
            max: 1,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 1,
            max: 2,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 2,
            max: 10,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 10,
            max: 17,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 17,
            max: 34,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 34,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ],


    /* =========================
       NH3
       ========================= */

    NH3: [

        {
            min: 0,
            max: 200,
            aqiMin: 0,
            aqiMax: 50
        },

        {
            min: 200,
            max: 400,
            aqiMin: 51,
            aqiMax: 100
        },

        {
            min: 400,
            max: 800,
            aqiMin: 101,
            aqiMax: 200
        },

        {
            min: 800,
            max: 1200,
            aqiMin: 201,
            aqiMax: 300
        },

        {
            min: 1200,
            max: 1800,
            aqiMin: 301,
            aqiMax: 400
        },

        {
            min: 1800,
            max: Infinity,
            aqiMin: 401,
            aqiMax: 500
        }

    ]

};


/* =========================================================
   DATE
   ========================================================= */

function updateDate() {

    if (!todayDate) {
        return;
    }


    todayDate.textContent =
        new Date().toLocaleDateString(
            undefined,
            {
                weekday: "long",

                month: "short",

                day: "numeric"
            }
        );
}


/* =========================================================
   WEATHER ICON
   ========================================================= */

function getWeatherIcon(iconCode) {

    if (!iconCode) {

        return "cloud";
    }


    if (iconCode.startsWith("01")) {

        return "sun";
    }


    if (iconCode.startsWith("02")) {

        return "cloud-sun";
    }


    if (
        iconCode.startsWith("03") ||
        iconCode.startsWith("04")
    ) {

        return "cloud";
    }


    if (
        iconCode.startsWith("09") ||
        iconCode.startsWith("10")
    ) {

        return "cloud-showers-heavy";
    }


    if (iconCode.startsWith("11")) {

        return "bolt";
    }


    if (iconCode.startsWith("13")) {

        return "snowflake";
    }


    if (iconCode.startsWith("50")) {

        return "smog";
    }


    return "cloud";
}


/* =========================================================
   UPDATE CURRENT WEATHER
   ========================================================= */

function updateCurrentWeather(data) {

    cityName.textContent =
        data.name || "Unknown";


    mainTemp.textContent =
        `${Math.round(
            data.main.temp
        )}°`;


    mainCondition.textContent =
        data.weather?.[0]?.description
            ? capitalize(
                data.weather[0].description
            )
            : "Unknown";


    feelsLike.textContent =
        `${Math.round(
            data.main.feels_like
        )}°`;


    humidity.textContent =
        `${data.main.humidity}%`;


    visibility.textContent =
        `${(
            (data.visibility || 10000) /
            1000
        ).toFixed(1)} km`;


    pressure.textContent =
        `${data.main.pressure} hPa`;


    /* Duplicate statistics */

    feelsLike2.textContent =
        feelsLike.textContent;


    humidity2.textContent =
        humidity.textContent;


    visibility2.textContent =
        visibility.textContent;


    pressure2.textContent =
        pressure.textContent;


    /* Weather icon */

    const icon =
        getWeatherIcon(
            data.weather?.[0]?.icon
        );


    weatherIcon.innerHTML =
        `<i class="fas fa-${icon}"></i>`;


    /* Update time */

    if (updatedText) {

        updatedText.textContent =
            `Updated ${new Date()
                .toLocaleTimeString(
                    undefined,
                    {
                        hour: "numeric",

                        minute: "2-digit"
                    }
                )}`;
    }
}


/* =========================================================
   CAPITALIZE TEXT
   ========================================================= */

function capitalize(text) {

    return text
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


/* =========================================================
   HOURLY FORECAST
   ========================================================= */

function updateHourlyForecast(
    forecast
) {

    if (!hourlyForecast) {
        return;
    }


    hourlyForecast.innerHTML = "";


    const entries =
        forecast.slice(
            0,
            12
        );


    entries.forEach(
        (item, index) => {

            const date =
                new Date(
                    item.dt * 1000
                );


            const time =
                index === 0
                    ? "Now"
                    : date.toLocaleTimeString(
                        undefined,
                        {
                            hour: "numeric",

                            minute: "2-digit",

                            hour12: true
                        }
                    );


            const icon =
                getWeatherIcon(
                    item.weather?.[0]?.icon
                );


            const temperature =
                Math.round(
                    item.main.temp
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "hour-card";


            card.innerHTML = `

                <p>
                    ${time}
                </p>

                <i
                    class="fas fa-${icon}"
                ></i>

                <p>
                    ${temperature}°
                </p>

            `;


            hourlyForecast.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   FIVE DAY FORECAST
   ========================================================= */

function updateFiveDayForecast(
    forecast
) {

    if (!tenDayForecast) {
        return;
    }


    tenDayForecast.innerHTML = "";


    const daily =
        new Map();


    forecast.forEach(
        item => {

            const date =
                new Date(
                    item.dt * 1000
                );


            const key =
                `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;


            if (!daily.has(key)) {

                daily.set(
                    key,
                    item
                );
            }

        }
    );


    const days =
        Array.from(
            daily.values()
        ).slice(
            0,
            5
        );


    days.forEach(
        (item, index) => {

            const date =
                new Date(
                    item.dt * 1000
                );


            const dayName =
                index === 0
                    ? "Today"
                    : date.toLocaleDateString(
                        undefined,
                        {
                            weekday: "short"
                        }
                    );


            const icon =
                getWeatherIcon(
                    item.weather?.[0]?.icon
                );


            const temperature =
                Math.round(
                    item.main.temp
                );


            const li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <i
                    class="fas fa-${icon}"
                ></i>

                <b>
                    ${dayName}
                </b>

                <span>
                    ${temperature}°
                </span>

            `;


            tenDayForecast.appendChild(
                li
            );

        }
    );
}


/* =========================================================
   TEMPERATURE CHART
   ========================================================= */

function updateTemperatureChart(
    forecast
) {

    const canvas =
        document.getElementById(
            "tempChart"
        );


    if (!canvas) {
        return;
    }


    if (temperatureChart) {

        temperatureChart.destroy();
    }


    const data =
        forecast.slice(
            0,
            12
        );


    const labels =
        data.map(
            item =>
                new Date(
                    item.dt * 1000
                ).toLocaleTimeString(
                    undefined,
                    {
                        hour: "numeric"
                    }
                )
        );


    const temperatures =
        data.map(
            item =>
                Math.round(
                    item.main.temp
                )
        );


    temperatureChart =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    labels,


                    datasets: [

                        {

                            label:
                                "Temperature",


                            data:
                                temperatures,


                            borderWidth:
                                2,


                            tension:
                                0.4,


                            fill:
                                true,


                            pointRadius:
                                3,


                            pointHoverRadius:
                                6
                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                false
                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display:
                                    false
                            },

                            ticks: {

                                color:
                                    getMutedColor()
                            }

                        },


                        y: {

                            ticks: {

                                color:
                                    getMutedColor(),

                                callback:
                                    value =>
                                        `${value}°`
                            },


                            grid: {

                                color:
                                    getGridColor()
                            }

                        }

                    }

                }

            }
        );
}


/* =========================================================
   INDIAN AQI CALCULATION
   ========================================================= */

/*
   Interpolates a pollutant concentration between
   its CPCB breakpoint values.
*/

function calculateSubIndex(
    concentration,
    breakpoints
) {

    if (
        concentration === null ||
        concentration === undefined ||
        !Number.isFinite(
            concentration
        )
    ) {

        return null;
    }


    for (
        const breakpoint
        of breakpoints
    ) {

        const {

            min,

            max,

            aqiMin,

            aqiMax

        } = breakpoint;


        if (
            concentration >= min &&
            concentration <= max
        ) {

            /*
               Linear interpolation:

               I =
               [(IHi - ILo) /
               (BHi - BLo)]
               × (Cp - BLo)
               + ILo
            */


            if (
                max === Infinity
            ) {

                return 500;
            }


            const result =
                (
                    (aqiMax - aqiMin) /
                    (max - min)
                )
                *
                (
                    concentration - min
                )
                +
                aqiMin;


            return Math.round(
                Math.max(
                    0,
                    Math.min(
                        500,
                        result
                    )
                )
            );
        }

    }


    return null;
}


/* =========================================================
   CALCULATE OVERALL INDIAN AQI
   ========================================================= */

function calculateIndianAQI(
    pollutants
) {

    const subIndices = [];


    Object.entries(
        pollutants
    ).forEach(
        ([pollutant, concentration]) => {

            if (
                concentration === null ||
                concentration === undefined ||
                !Number.isFinite(
                    concentration
                )
            ) {

                return;
            }


            const breakpoints =
                AQI_BREAKPOINTS[
                    pollutant
                ];


            if (!breakpoints) {
                return;
            }


            const subIndex =
                calculateSubIndex(
                    concentration,
                    breakpoints
                );


            if (
                subIndex !== null
            ) {

                subIndices.push({

                    pollutant,

                    concentration,

                    subIndex

                });

            }

        }
    );


    /*
       CPCB-style requirement:

       At least three pollutants,
       including PM2.5 or PM10.
    */

    const hasParticulate =
        subIndices.some(
            item =>
                item.pollutant === "PM25" ||
                item.pollutant === "PM10"
        );


    if (
        subIndices.length < 3 ||
        !hasParticulate
    ) {

        return {

            valid:
                false,

            subIndices

        };
    }


    /*
       Highest sub-index determines
       overall AQI.
    */

    const highest =
        subIndices.reduce(
            (currentHighest, item) => {

                if (
                    item.subIndex >
                    currentHighest.subIndex
                ) {

                    return item;
                }


                return currentHighest;

            }
        );


    return {

        valid:
            true,

        aqi:
            highest.subIndex,

        primaryPollutant:
            highest.pollutant,

        subIndices

    };
}


/* =========================================================
   UPDATE AQI DISPLAY
   ========================================================= */

function updateAQI(
    pollutionData
) {

    if (
        !pollutionData ||
        !pollutionData.components
    ) {

        showAQIUnavailable();

        return;
    }


    const components =
        pollutionData.components;


    /*
       OpenWeather units:

       PM2.5 → μg/m³
       PM10  → μg/m³
       NO2   → μg/m³
       SO2   → μg/m³
       O3    → μg/m³
       NH3   → μg/m³
       CO    → μg/m³


       CO is converted to mg/m³
       for the AQI breakpoint table.
    */


    const pollutants = {

        PM25:
            numberOrNull(
                components.pm2_5
            ),

        PM10:
            numberOrNull(
                components.pm10
            ),

        NO2:
            numberOrNull(
                components.no2
            ),

        SO2:
            numberOrNull(
                components.so2
            ),

        O3:
            numberOrNull(
                components.o3
            ),

        NH3:
            numberOrNull(
                components.nh3
            ),

        CO:
            numberOrNull(
                components.co
            ) / 1000

    };


    /*
       Display pollutant values
    */

    setText(
        pm25,
        formatNumber(
            pollutants.PM25
        )
    );


    setText(
        pm10,
        formatNumber(
            pollutants.PM10
        )
    );


    setText(
        no2,
        formatNumber(
            pollutants.NO2
        )
    );


    setText(
        so2,
        formatNumber(
            pollutants.SO2
        )
    );


    setText(
        o3,
        formatNumber(
            pollutants.O3
        )
    );


    setText(
        nh3,
        formatNumber(
            pollutants.NH3
        )
    );


    setText(
        co,
        formatNumber(
            pollutants.CO,
            2
        )
    );


    /*
       Calculate Indian AQI
    */

    const result =
        calculateIndianAQI(
            pollutants
        );


    if (!result.valid) {

        showAQIUnavailable();

        return;
    }


    const aqi =
        result.aqi;


    const category =
        getAQICategory(
            aqi
        );


    /*
       AQI number
    */

    setText(
        aqiDisplay,
        `AQI: ${aqi}`
    );


    /*
       AQI category
    */

    setText(
        aqiCategory,
        category
    );


    /*
       Primary pollutant
    */

    setText(
        primaryPollutant,
        getPollutantName(
            result.primaryPollutant
        )
    );


    /*
       AQI source text
    */

    setText(
        aqiSource,
        "Calculated from OpenWeather pollutant data using CPCB breakpoints"
    );


    /*
       AQI gauge
    */

    const percentage =
        Math.max(
            1,
            Math.min(
                99,
                (aqi / 500) * 100
            )
        );


    if (aqiIndicator) {

        aqiIndicator.style.left =
            `${percentage}%`;

        aqiIndicator.style.background =
            getAQIColor(
                aqi
            );
    }


    /*
       AQI number color
    */

    if (aqiDisplay) {

        aqiDisplay.style.color =
            getAQIColor(
                aqi
            );
    }


    /*
       Update AQI chart
    */

    updateAQIChart(
        aqi
    );
}


/* =========================================================
   AQI CATEGORY
   ========================================================= */

function getAQICategory(
    aqi
) {

    if (aqi <= 50) {

        return "Good";
    }


    if (aqi <= 100) {

        return "Satisfactory";
    }


    if (aqi <= 200) {

        return "Moderately polluted";
    }


    if (aqi <= 300) {

        return "Poor";
    }


    if (aqi <= 400) {

        return "Very Poor";
    }


    return "Severe";
}


/* =========================================================
   AQI COLOR
   ========================================================= */

function getAQIColor(
    aqi
) {

    if (aqi <= 50) {

        return "#22c55e";
    }


    if (aqi <= 100) {

        return "#84cc16";
    }


    if (aqi <= 200) {

        return "#facc15";
    }


    if (aqi <= 300) {

        return "#fb923c";
    }


    if (aqi <= 400) {

        return "#ef4444";
    }


    return "#7f1d1d";
}


/* =========================================================
   AQI CHART
   ========================================================= */

function initializeAQIChart() {

    const canvas =
        document.getElementById(
            "aqiChart"
        );


    if (!canvas) {
        return;
    }


    if (aqiChart) {

        aqiChart.destroy();
    }


    aqiChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels:
                        ["Indian AQI"],


                    datasets: [

                        {

                            label:
                                "Indian AQI",

                            data:
                                [0],

                            backgroundColor:
                                "#22c55e",

                            borderRadius:
                                8,

                            borderWidth:
                                0
                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    scales: {

                        y: {

                            min:
                                0,

                            max:
                                500,

                            ticks: {

                                color:
                                    getMutedColor(),

                                stepSize:
                                    100

                            },

                            grid: {

                                color:
                                    getGridColor()

                            }

                        },


                        x: {

                            ticks: {

                                color:
                                    getMutedColor()

                            },

                            grid: {

                                display:
                                    false

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }
        );
}


/* =========================================================
   UPDATE AQI CHART
   ========================================================= */

function updateAQIChart(
    aqi
) {

    if (!aqiChart) {

        initializeAQIChart();
    }


    if (!aqiChart) {
        return;
    }


    const color =
        getAQIColor(
            aqi
        );


    aqiChart.data.datasets[0].data =
        [aqi];


    aqiChart.data.datasets[0]
        .backgroundColor =
        color;


    aqiChart.update();
}


/* =========================================================
   WEATHER MAP
   ========================================================= */

function initializeMap(
    latitude,
    longitude
) {

    if (
        typeof L === "undefined"
    ) {

        console.warn(
            "Leaflet is not available."
        );

        return;
    }


    if (!weatherMap) {

        weatherMap =
            L.map(
                "weatherMap"
            )
            .setView(
                [
                    latitude,
                    longitude
                ],
                8
            );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                attribution:
                    "&copy; OpenStreetMap contributors",

                maxZoom:
                    19

            }
        ).addTo(
            weatherMap
        );

    } else {

        weatherMap.setView(
            [
                latitude,
                longitude
            ],
            8
        );
    }


    /*
       Remove old marker
    */

    if (locationMarker) {

        weatherMap.removeLayer(
            locationMarker
        );
    }


    /*
       Create marker
    */

    locationMarker =
        L.marker(
            [
                latitude,
                longitude
            ]
        )
        .addTo(
            weatherMap
        );


    locationMarker.bindPopup(
        "<strong>Current location</strong>"
    );


    /*
       Fix map rendering when card
       was initially hidden/loaded.
    */

    setTimeout(
        () => {

            weatherMap.invalidateSize();

        },
        200
    );
}


/* =========================================================
   FETCH CURRENT WEATHER
   ========================================================= */

async function fetchCurrentWeather(
    latitude,
    longitude,
    locationName = null
) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;


    const response =
        await fetch(
            url
        );


    if (!response.ok) {

        const errorText =
            await response.text();


        console.error(
            "Current weather API error:",
            response.status,
            errorText
        );


        throw new Error(
            `Weather API returned ${response.status}`
        );
    }


    const data =
        await response.json();


    if (locationName) {

        data.name =
            locationName;
    }


    updateCurrentWeather(
        data
    );


    return data;
}


/* =========================================================
   FETCH FORECAST
   ========================================================= */

async function fetchForecast(
    latitude,
    longitude
) {

    const url =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;


    const response =
        await fetch(
            url
        );


    if (!response.ok) {

        const errorText =
            await response.text();


        console.error(
            "Forecast API error:",
            response.status,
            errorText
        );


        throw new Error(
            `Forecast API returned ${response.status}`
        );
    }


    const data =
        await response.json();


    updateHourlyForecast(
        data.list
    );


    updateFiveDayForecast(
        data.list
    );


    updateTemperatureChart(
        data.list
    );


    return data;
}


/* =========================================================
   FETCH CURRENT AIR POLLUTION
   ========================================================= */

async function fetchAirPollution(
    latitude,
    longitude
) {

    const url =
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;


    try {

        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Air pollution API error:",
                response.status,
                errorText
            );


            showAQIUnavailable();

            return null;
        }


        const data =
            await response.json();


        const latest =
            data.list?.[0];


        if (!latest) {

            showAQIUnavailable();

            return null;
        }


        updateAQI(
            latest
        );


        return latest;

    } catch (error) {

        console.error(
            "AQI request failed:",
            error
        );


        showAQIUnavailable();

        return null;
    }
}


/* =========================================================
   MAIN WEATHER LOADER
   ========================================================= */

async function loadWeather(
    latitude,
    longitude,
    locationName = null
) {

    document.body.classList.add(
        "loading"
    );


    try {

        /*
           Run weather + forecast + AQI
           independently so an AQI
           problem doesn't break weather.
        */

        await Promise.all([

            fetchCurrentWeather(
                latitude,
                longitude,
                locationName
            ),

            fetchForecast(
                latitude,
                longitude
            ),

            fetchAirPollution(
                latitude,
                longitude
            )

        ]);


        /*
           Update map separately
        */

        initializeMap(
            latitude,
            longitude
        );


    } catch (error) {

        console.error(
            "Climlyze loading error:",
            error
        );


        showWeatherError(
            error
        );

    } finally {

        document.body.classList.remove(
            "loading"
        );
    }
}


/* =========================================================
   SEARCH LOCATION
   ========================================================= */

async function searchLocation() {

    const query =
        searchBar.value.trim();


    if (!query) {

        return;
    }


    const originalHTML =
        searchButton.innerHTML;


    searchButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i>';


    searchButton.disabled =
        true;


    try {

        const url =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`;


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                `Location API returned ${response.status}`
            );
        }


        const locations =
            await response.json();


        if (
            !locations ||
            locations.length === 0
        ) {

            alert(
                "Location not found. Please try another city."
            );

            return;
        }


        const location =
            locations[0];


        const displayName =
            [

                location.name,

                location.state,

                location.country

            ]
                .filter(Boolean)
                .join(", ");


        searchBar.value =
            displayName;


        await loadWeather(

            location.lat,

            location.lon,

            location.name

        );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        alert(
            "Unable to search for this location. Please try again."
        );

    } finally {

        searchButton.innerHTML =
            originalHTML;


        searchButton.disabled =
            false;
    }
}


/* =========================================================
   SEARCH BUTTON
   ========================================================= */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchLocation
    );
}


/* =========================================================
   ENTER KEY SEARCH
   ========================================================= */

if (searchBar) {

    searchBar.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                searchLocation();
            }

        }
    );
}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme(
    theme
) {

    const light =
        theme === "light";


    document.body.classList.toggle(
        "light-theme",
        light
    );


    if (themeToggle) {

        themeToggle.innerHTML =
            light
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
    }


    localStorage.setItem(
        "climlyze-theme",
        theme
    );


    /*
       Refresh charts so their
       colors match the theme.
    */

    updateChartTheme();
}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );


            applyTheme(
                isLight
                    ? "dark"
                    : "light"
            );

        }
    );
}


/* =========================================================
   UPDATE CHART THEME
   ========================================================= */

function updateChartTheme() {

    const muted =
        getMutedColor();


    const grid =
        getGridColor();


    if (temperatureChart) {

        temperatureChart.options
            .scales.x.ticks.color =
            muted;


        temperatureChart.options
            .scales.y.ticks.color =
            muted;


        temperatureChart.options
            .scales.y.grid.color =
            grid;


        temperatureChart.update();
    }


    if (aqiChart) {

        aqiChart.options
            .scales.x.ticks.color =
            muted;


        aqiChart.options
            .scales.y.ticks.color =
            muted;


        aqiChart.options
            .scales.y.grid.color =
            grid;


        aqiChart.update();
    }
}


/* =========================================================
   CHART COLORS
   ========================================================= */

function getMutedColor() {

    return document.body.classList.contains(
        "light-theme"
    )

        ? "#65778a"

        : "#8ea2b8";
}


function getGridColor() {

    return document.body.classList.contains(
        "light-theme"
    )

        ? "rgba(15,23,42,0.07)"

        : "rgba(255,255,255,0.06)";
}


/* =========================================================
   BRAND REFRESH
   ========================================================= */

if (brandButton) {

    brandButton.addEventListener(
        "click",
        () => {

            window.location.reload();

        }
    );
}


/* =========================================================
   SHOW AQI UNAVAILABLE
   ========================================================= */

function showAQIUnavailable() {

    setText(
        aqiDisplay,
        "AQI: --"
    );


    setText(
        aqiCategory,
        "Air quality unavailable"
    );


    setText(
        primaryPollutant,
        "--"
    );


    if (aqiSource) {

        aqiSource.textContent =
            "Air pollution data could not be retrieved";
    }


    if (aqiIndicator) {

        aqiIndicator.style.left =
            "0%";

        aqiIndicator.style.background =
            "var(--primary)";
    }


    /*
       Reset pollutants
    */

    setText(
        pm25,
        "--"
    );

    setText(
        pm10,
        "--"
    );

    setText(
        no2,
        "--"
    );

    setText(
        so2,
        "--"
    );

    setText(
        o3,
        "--"
    );

    setText(
        co,
        "--"
    );

    setText(
        nh3,
        "--"
    );


    /*
       Reset chart
    */

    if (aqiChart) {

        aqiChart.data.datasets[0].data =
            [0];

        aqiChart.data.datasets[0]
            .backgroundColor =
            "#64748b";

        aqiChart.update();
    }
}


/* =========================================================
   SHOW WEATHER ERROR
   ========================================================= */

function showWeatherError(
    error
) {

    console.error(
        error
    );


    if (mainCondition) {

        mainCondition.textContent =
            "Unable to load weather";
    }


    if (updatedText) {

        updatedText.textContent =
            "Please check your API connection";
    }
}


/* =========================================================
   UTILITY — SET TEXT
   ========================================================= */

function setText(
    element,
    value
) {

    if (element) {

        element.textContent =
            value;
    }
}


/* =========================================================
   UTILITY — NUMBER
   ========================================================= */

function numberOrNull(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return null;
    }


    return number;
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(
    value,
    decimals = 1
) {

    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(
            value
        )
    ) {

        return "--";
    }


    return value.toFixed(
        decimals
    );
}


/* =========================================================
   POLLUTANT NAME
   ========================================================= */

function getPollutantName(
    pollutant
) {

    const names = {

        PM25:
            "PM2.5",

        PM10:
            "PM10",

        NO2:
            "NO₂",

        SO2:
            "SO₂",

        O3:
            "O₃",

        CO:
            "CO",

        NH3:
            "NH₃"

    };


    return (
        names[pollutant] ||
        pollutant
    );
}


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

async function initializeApp() {

    /*
       Date
    */

    updateDate();


    /*
       Theme
    */

    const savedTheme =
        localStorage.getItem(
            "climlyze-theme"
        );


    if (savedTheme) {

        applyTheme(
            savedTheme
        );

    } else {

        applyTheme(
            "dark"
        );
    }


    /*
       Initialize AQI chart
    */

    initializeAQIChart();


    /*
       API KEY CHECK
    */

    if (
        !API_KEY ||
        API_KEY ===
        "YOUR_EXISTING_OPENWEATHER_API_KEY"
    ) {

        console.error(
            "Climlyze: OpenWeather API key is missing."
        );


        if (updatedText) {

            updatedText.textContent =
                "Add your OpenWeather API key in script.js";
        }


        return;
    }


    /*
       Browser location
    */

    if (
        navigator.geolocation
    ) {

        navigator.geolocation
            .getCurrentPosition(

                position => {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;


                    loadWeather(

                        latitude,

                        longitude

                    );

                },


                error => {

                    console.warn(
                        "Geolocation unavailable:",
                        error.message
                    );


                    /*
                       Fallback:
                       Kolkata
                    */

                    loadWeather(

                        DEFAULT_LOCATION.lat,

                        DEFAULT_LOCATION.lon,

                        DEFAULT_LOCATION.name

                    );

                },


                {

                    enableHighAccuracy:
                        true,

                    timeout:
                        10000,

                    maximumAge:
                        300000

                }

            );

    } else {

        /*
           Browser doesn't support
           geolocation.
        */

        loadWeather(

            DEFAULT_LOCATION.lat,

            DEFAULT_LOCATION.lon,

            DEFAULT_LOCATION.name

        );

    }

}


/* =========================================================
   START APPLICATION
   ========================================================= */

initializeApp();
