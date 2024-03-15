// api key
let api_key = '883c10babbeb4103add25909241203'

// dark mode
let mode_btn = document.querySelector('#mode_btn')
let light_img = document.querySelector('#light_img')
let dark_img = document.querySelector('#dark_img')
let html = document.querySelector('html')
mode_btn.addEventListener('click', () => {
    html.classList.toggle('dark')
    if (html.classList.contains('dark')) {
        dark_img.classList.add('hidden')
        light_img.classList.remove('hidden')
    } else {
        dark_img.classList.remove('hidden')
        light_img.classList.add('hidden')
    }
})

// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 8,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
        1190: {
          slidesPerView: 8,
        },
        900: {
          slidesPerView: 6,
          spaceBetween:0,
        },
        600: {
          slidesPerView: 4,
          spaceBetween:0,
        },
        500: {
          slidesPerView: 3,
          spaceBetween:0,
        },
        350: {
          slidesPerView: 2,
          spaceBetween:0,
        },
        250: {
          slidesPerView: 2,
          spaceBetween:0,
        },
      }
  });


//   fetching the api function
function callingData(url) {
    let loading = document.querySelector('#loading')
    loading.classList.remove('hidden')
    fetch(url)
    .then((res) => {
        loading.classList.add('hidden')
        return res.json()
    })
    .then((res) => {
        let noResult = document.querySelector('#noResult')
        let cityName = document.querySelector('#cityName')
        if (res.error) {
            noResult.classList.remove('hidden')
            cityName.textContent = 'No Result'
        } else {
            loopingData(res.forecast.forecastday)
            fillingTempData(res)
            fillingCards(res)
            noResult.classList.add('hidden')
        }
    })
    .catch((error) => console.log(error))
}

    // search though input field
    let cityName = document.querySelector('#cityName')
    let search_feild = document.querySelector('#search_feild')
    let searchBtn = document.querySelector('#searchBtn')
        searchBtn.addEventListener('click', () => {
            if (search_feild.value.length == 0) {
                alert('enter the querry')
            }else{
            let url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${search_feild.value}&days=1&aqi=yes&alerts=yes`
            let parent = document.querySelector('.swiper-wrapper')
            parent.innerHTML = ""
            callingData(url)
            cityName.textContent = search_feild.value
            }
        })

// calling the function on window load
window.addEventListener('load', () => {
    let url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=gumia&days=1&aqi=yes&alerts=yes`
    callingData(url)
    let cityName = document.querySelector('#cityName')
    cityName.textContent = 'Gumia'
})

function loopingData(data) {
    // select the template forecast
    let templateForecast = document.querySelector('#hourlyForecastTemplate')
    let parent = document.querySelector('.swiper-wrapper')
    parent.innerHTML = ""
    let arr = data[0].hour
   
    // looping the array and make clone
    arr.forEach((item) => {
        // make local date to match with data and show with relative time with device and api
        let date = new Date()
        let localTime;
        let globalTime = item.time

        // checking the first condition that current month is less than 10 or not so we add 0 in less than 10 to match with api time
        if (date.getMonth() + 1 < 10) {
            // in second condition we check hour is less than 10 os we add 0 in every hour less than 10 to match with api hours
            if (date.getHours() < 10) {
                localTime = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()} 0${date.getHours()}:00`
            }else{
                localTime = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`
            }
        }else {
            localTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`
        }

        if (localTime <= globalTime) {
            let clone = templateForecast.content.cloneNode(true)
            fillingData(item, clone)
            parent.appendChild(clone)
        }
       
    })
}

// filling data in main second cards
function fillingData(arr, clone) {
    let globalImg = arr.condition.icon
    let globalTime = arr.time
    let globalTemp = arr.temp_c

    let time = clone.querySelector('#forecast-time')
    let img = clone.querySelector('#forecast-img')
    let temp = clone.querySelector('#forecast-temp')


    img.src = globalImg
    time.textContent = globalTime
    temp.textContent = globalTemp
}

// filling data in main first card
function fillingTempData(data) {
    let arrayOfData = data.forecast.forecastday
    let temp_deg = document.querySelector('#temp_deg')
    let temp_mini = document.querySelector('#temp_mini')
    let temp_max = document.querySelector('#temp_max')
    let temp_status = document.querySelector('#temp_status')
    let temp_img = document.querySelector('#temp-img')

    temp_mini.textContent = arrayOfData[0].day.mintemp_c 
    temp_max.textContent = arrayOfData[0].day.maxtemp_c 
    temp_deg.textContent = data.current.temp_c
    temp_status.textContent = data.current.condition.text
    temp_img.src = data.current.condition.icon
}

// filling data in main last cards
function fillingCards(data) {
    let rain = document.querySelector('#rain')
    let humidity = document.querySelector('#humidity')
    let air_quality = document.querySelector('#air_quality')
    let uv_index = document.querySelector('#uv_index')
    let visibility = document.querySelector('#visibility')
    let sunrise = document.querySelector('#sunrise')
    let sunset = document.querySelector('#sunset')
    let snow = document.querySelector('#snow')

    rain.textContent = data.forecast.forecastday[0].day.daily_chance_of_rain
    humidity.textContent = data.current.humidity
    air_quality.textContent = data.current.air_quality.o3
    uv_index.textContent = data.current.uv
    visibility.textContent = data.current.vis_km
    sunrise.textContent = data.forecast.forecastday[0].astro.sunrise
    sunset.textContent = data.forecast.forecastday[0].astro.sunset
    snow.textContent = data.forecast.forecastday[0].day.daily_chance_of_snow
}

    