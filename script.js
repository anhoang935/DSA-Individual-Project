// Individual project 
// Hoàng Thiên Ân - ITCSIU22248 
// Purpose: Implement function and element to ensure the project works

// HTML Elements

const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventSubmit = document.querySelector(".add-event-btn"),
    addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to"),
    manageBtn = document.querySelector(".manage-list"),
    filterBtn = document.querySelector(".filter-btn"),
    sortBtn = document.querySelector(".sort-btn"),
    searchBtn = document.querySelector(".search-btn"),
    searchText = document.querySelector(".search-text"),
    searchBar = document.querySelector(".search-bar"),
    filterContainer = document.querySelector(".filter-event-wrapper"),
    filterMonth = document.querySelector(".filter-month"),
    filterYear = document.querySelector(".filter-year"),
    filterDo = document.querySelector(".filter-do"),
    filterAll = document.querySelector(".filter-all"),
    sortContainer = document.querySelector(".sort-event-wrapper"),
    ascendingBtn = document.querySelector(".ascending-btn"),
    descendingBtn = document.querySelector(".descending-btn"),
    helpBtn = document.querySelector(".help-btn"),
    helpContainer = document.querySelector(".help-wrapper"),
    overlay = document.querySelector(".overlay");

// Attribute

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let eventsArr = [];
let eventsMap = new Map();
let eventsManaged = [];

// eventsArr visualization

// const eventsArr = [
//   {
//     day: 5,
//     month: 6,
//     year: 2024,
//     events: [
//       {
//         title: "Event 1",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
//   {
//     day: 6,
//     month: 6,
//     year: 2024,
//     events: [
//       {
//         title: "Event 1",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   }
// ];

getEvents();

// Method to setup the calendar
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    date.innerHTML = months[month] + " " + year;

    let days = "";

    for (let x = day; x>0; x--){
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }
    for (let i = 1; i <= lastDate; i++){
        
        let event = eventsMap.has(`${i}-${month + 1}-${year}`);
        
        if(i === new Date().getDate() && 
        year === new Date().getFullYear() && 
        month === new Date().getMonth()){
            if(!manageBtn.classList.contains("active")){
                activeDay = i;
                getActiveDay(i);
            }
            updateEvents(i);
            if(event){
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } else {
            if(event){
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day ">${i}</div>`;
            }
        }
    }
    for(let j = 1; j<= nextDays; j++){
        days += `<div class="day next-date ">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListener();
}

initCalendar();

// Method to move to next month
function prevMonth(){
    month--;
    if (month < 0){
        month = 11;
        year;
    }
    initCalendar();
}

// Method to move to previous month
function nextMonth() {
    month++;
    if(month>11){
        month = 0;
        year++;
    }
    initCalendar();
}

// Implementation buttons to navigate month
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Implementation button to jump to today date
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

// Implementation input space to type month and year
dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if(dateInput.value.length === 2){
        dateInput.value += "/";
    }
    if(dateInput.value.length > 7){
        dateInput.value = dateInput.value.slice(0,7);
    }
    if(e.inputType === "deleteContentBackward"){
        if(dateInput.value.length === 3){
            dateInput.value = dateInput.value.slice(0,2);
        }
    }
});

// Implementation button to jump to the month and year inputed above
gotoBtn.addEventListener("click", gotoDate);

// Method to jump to month and year based on the inputed above
function gotoDate(){
    const dateArr = dateInput.value.split("/");
    if(dateArr.length === 2){
        if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4){
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    alert("Invalid Date");
}

// Implementation button to turn on manage list mode
manageBtn.addEventListener("click", () => {
    filterBtn.classList.toggle("show");
    manageBtn.classList.toggle("active");
    sortBtn.classList.toggle("show");
    searchBar.classList.toggle("show");
    addEventBtn.classList.toggle("show");
});

// Implementation button to filter events
filterBtn.addEventListener("click", () => {
    filterContainer.classList.toggle("active");
    filterBtn.classList.toggle("active");
});

// Implementation button to sort events
sortBtn.addEventListener("click", () => {
    sortContainer.classList.toggle("active");
    sortBtn.classList.toggle("active");
});

// Implementation button to add new event 
addEventBtn.addEventListener("click", () => {
    addEventBtn.classList.toggle("active");
    addEventContainer.classList.toggle("active");
});
// Implementation button to close add event wrapper
addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

// Implementation button to open the help container
helpBtn.addEventListener("click", () => {
    helpContainer.classList.add("active");
    overlay.classList.add("active");
});

// Implementation function to close any wrapper or container by checking location of mouse click based on spercific conditinos
document.addEventListener("click", (e) => {
    if(e.target !== addEventBtn && !addEventContainer.contains(e.target)){
        addEventContainer.classList.remove("active");
        addEventBtn.classList.remove("active");
    }
    if(e.target !== sortBtn && !sortContainer.contains(e.target)){
        sortContainer.classList.remove("active");
        sortBtn.classList.remove("active");
    }
    if(e.target !== filterBtn && !filterContainer.contains(e.target)){
        filterContainer.classList.remove("active");
        filterBtn.classList.remove("active");
    }
    if(overlay.contains(e.target)){
        helpContainer.classList.remove("active");
        overlay.classList.remove("active");
    }
});

// Implementation input space for add event wrapper
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0,50);
});
addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2){
        addEventFrom.value += ":";
    }
    if(addEventFrom.value.length > 5){
        addEventFrom.value = addEventFrom.value.slice(0,5);
    }
});
addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2){
        addEventTo.value += ":";
    }
    if(addEventTo.value.length > 5){
        addEventTo.value = addEventTo.value.slice(0,5);
    }
});

// Implementation button to submit and add new event based on inputed information in event wrapper
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    if(eventTitle === "" || eventTimeFrom === "" || eventTimeTo === ""){
        alert("Please fill all the fields");
        return;
    }
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if(timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59){
        alert("Invalid Time Format");
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo
    };

    let eventAdded = false;

    if(eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if(item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year){
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if(!eventAdded){
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent]
        });
    }

    addEventContainer.classList.remove("active")
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    updateEvents(activeDay);

    const activeDayElem = document.querySelector(".day.active");
    if(!activeDayElem.classList.contains("event")){
        activeDayElem.classList.add("event");
    }
});

// Implementation input space for filter event wrapper
filterMonth.addEventListener("input", (e) => {
    filterMonth.value = filterMonth.value.replace(/[^0-9:]/g, "");
});
filterYear.addEventListener("input", (e) => {
    filterYear.value = filterYear.value.replace(/[^0-9:]/g, "");
});

// Method to set choosen day to active state
function addListener(){
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);
            getActiveDay(e.target.innerHTML); 
            updateEvents(Number(e.target.innerHTML));
            days.forEach((day) => {
                day.classList.remove("active");
            });

            if(e.target.classList.contains("prev-date")){
                prevMonth();
                const days = document.querySelectorAll(".day");
                days.forEach((day) => {
                    day.classList.remove("active");
                });
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if(!day.classList.contains("prev-date") &&
                        day.innerHTML === e.target.innerHTML){
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if(e.target.classList.contains("next-date")){
                nextMonth();
                const days = document.querySelectorAll(".day");
                days.forEach((day) => {
                    day.classList.remove("active");
                });
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if(!day.classList.contains("next-date") &&
                        day.innerHTML === e.target.innerHTML){
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
                
            }
        });
    });
}

// Method to convert number inputed from event wrapper into time as a string
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

// Method to show active day including date, month and year for title
function getActiveDay(date) {
    const day = new Date (year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date+" "+months[month]+" "+year;
}

// Method to show event of active day
function updateEvents(date){
    let eventsHTML = '';
    if(!manageBtn.classList.contains("active")){
        const key = `${date}-${month + 1}-${year}`;
        const eventList = eventsMap.get(key) || [];
        
        for (const event of eventList) {
            eventsHTML += `<div class="event">
                <div class="title">
                    <i class="fas fa-circle"></i>
                    <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-time">
                    <span class="event-time">${event.time}</span>
                </div>
            </div>`;
        }

        if((eventsHTML === "")){
            eventsHTML = `<div class="no-event">
                        <h3>No Events</h3>
                    </div>`;
        }

        eventsContainer.innerHTML = eventsHTML;
    }

    saveEvents();
}


// Implementation function to remove event considered as done by click on the event appear in event container
// or jump to the date where the event belong to in manage list mode
eventsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("event")){
        const eventTitle = e.target.querySelector(".event-title").innerText;
        const eventTime = e.target.querySelector(".event-time").innerText;
        
        eventsArr.forEach((eventObj) => {
            if(!manageBtn.classList.contains("active")){
                if(eventObj.day === activeDay &&
                    eventObj.month === month + 1 &&
                    eventObj.year === year){
                        eventObj.events.forEach((item, index) => {
                            if(item.title === eventTitle){
                                eventObj.events.splice(index, 1);
                            }
                        });
        
                        if(eventObj.events.length === 0){
                            eventsArr.splice(eventsArr.indexOf(eventObj), 1);
        
                            const activeDayElem = document.querySelector(".day.active");
                            if(activeDayElem.classList.contains("event")){
                                activeDayElem.classList.remove("event");
                            }
                        }
                    }
            } else {
                eventObj.events.forEach((event) => {
                    if(event.title === eventTitle && event.time === eventTime){
                        activeDay = eventObj.day;
                        month = eventObj.month - 1;
                        year = eventObj.year;
                        getActiveDay(activeDay);
                        initCalendar();
                        const days = document.querySelectorAll(".day");
                        days.forEach((day) => {
                            day.classList.remove("active");
                        });
                        days.forEach((day) => {
                            if(parseInt(day.innerText) === activeDay &&
                                day.classList.contains("event")
                            ){
                                day.classList.add("active");
                            }
                        });
                        return;
                    }
                });
            }
        });
        updateEvents(activeDay);
    }
});

// Method to divides inputed array into halves until each subarray has only one element or empty
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

// Method to to merge to sorted array into a single sorted array
function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        const leftDate = new Date(left[leftIndex].year, left[leftIndex].month - 1, left[leftIndex].day);
        const rightDate = new Date(right[rightIndex].year, right[rightIndex].month - 1, right[rightIndex].day);

        if (leftDate <= rightDate) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Method to inverse Merge Sort for descending order
function inverseMergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return inverseMerge(inverseMergeSort(left), inverseMergeSort(right));
}

// Method to set merge function for descending order
function inverseMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        const leftDate = new Date(left[leftIndex].year, left[leftIndex].month - 1, left[leftIndex].day);
        const rightDate = new Date(right[rightIndex].year, right[rightIndex].month - 1, right[rightIndex].day);

        if (leftDate >= rightDate) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}


// Implementation button to sort the filtered events by ascending order based on date time
ascendingBtn.addEventListener("click", () => {
    eventsManaged = mergeSort(eventsManaged);
    let events = "";
    eventsManaged.forEach((event) => {
            event.events.forEach((event) => {
                events += `<div class="event">
                <div class="title">
                  <i class="fas fa-circle"></i>
                  <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-time">
                  <span class="event-time">${event.time}</span>
                </div>
            </div>`;
            });
    });

    if((events === "")){
        events = `<div class="no-event">
                    <h3>No Events</h3>
                </div>`;
    }

    eventsContainer.innerHTML = events;
});

// Implementation button to sort the filtered events by descending order based on date time
descendingBtn.addEventListener("click", () => {
    eventsManaged = inverseMergeSort(eventsManaged);
    let events = "";
    eventsManaged.forEach((event) => {
            event.events.forEach((event) => {
                events += `<div class="event">
                <div class="title">
                  <i class="fas fa-circle"></i>
                  <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-time">
                  <span class="event-time">${event.time}</span>
                </div>
            </div>`;
            });
    });

    if((events === "")){
        events = `<div class="no-event">
                    <h3>No Events</h3>
                </div>`;
    }
    eventsContainer.innerHTML = events;
});

// Implementation button to filter event based on inputed month or year in the filter wrapper
filterDo.addEventListener("click", () => {
    const monthInput = parseInt(filterMonth.value);
    const yearInput = parseInt(filterYear.value);

    if (filterMonth.value === "" && filterYear.value === "") {
        alert("Please fill at least month or year");
        return;
    }
    if (monthInput > 12 || monthInput < 1) {
        alert("Invalid Input Format");
        return;
    }

    let eventsHTML = "";
    eventsManaged = [];

    eventsArr.forEach((event) => {
        const matchesFilter =
        (filterMonth.value === "" && yearInput === event.year) ||
        (filterYear.value === "" && monthInput === event.month) ||
        (filterYear.value!== "" && filterMonth.value!== "" && yearInput === event.year && monthInput === event.month);
  
        if (matchesFilter) {
            eventsManaged.push(event);
            event.events.forEach((event) => {
                eventsHTML += `<div class="event">
                    <div class="title">
                    <i class="fas fa-circle"></i>
                    <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                    <span class="event-time">${event.time}</span>
                    </div>
                </div>`;
            });
        }
    });


    if (eventsHTML === "") {
        eventsHTML = `<div class="no-event">
                    <h3>No Events</h3>
                </div>`;
    }

    eventsContainer.innerHTML = eventsHTML;
});

// Implementation button to return all events existed
filterAll.addEventListener("click", () => {
    let eventsHTML = "";
    eventsManaged = [];

    eventsArr.forEach((event) => {
        eventsManaged.push(event);
        event.events.forEach((event) => {
            eventsHTML += `<div class="event">
                <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-time">
                <span class="event-time">${event.time}</span>
                </div>
            </div>`;
        });        
    });

    if (eventsHTML === "") {
        eventsHTML = `<div class="no-event">
                    <h3>No Events</h3>
                </div>`;
    }

    eventsContainer.innerHTML = eventsHTML;
});

// Implementation button to search the filtered events by their title
searchBtn.addEventListener("click", () => {
    const searchInput = searchText.value.toLowerCase().trim();
    
    if(searchInput === ""){
        alert("Search bar should not be blank");
        return;
    }

    let eventsHTML = "";
    eventsManaged.forEach((eventObj) => {
        eventObj.events.forEach((event) => {
            if(event.title.toLowerCase().includes(searchInput)){
                eventsHTML += `<div class="event">
                <div class="title">
                  <i class="fas fa-circle"></i>
                  <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-time">
                  <span class="event-time">${event.time}</span>
                </div>
            </div>`;
            }
        });
    });

    if((eventsHTML === "")){
        eventsHTML = `<div class="no-event">
                    <h3>No Events</h3>
                </div>`;
    }
    eventsContainer.innerHTML = eventsHTML;
});

// Method to save events to local storage
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
    eventsMap.clear();
    eventsArr.forEach(event => {
        const dateKey = `${event.day}-${event.month}-${event.year}`;
        eventsMap.set(dateKey, event.events);
    });
}

// Method to get events from local storage
function getEvents() {
    if(localStorage.getItem("events" === null)){
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
    eventsArr.forEach(event => {
        const dateKey = `${event.day}-${event.month}-${event.year}`;
        eventsMap.set(dateKey, event.events);
    });
}