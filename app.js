// ===========================
// GIGTRACKER CONFIGURATION
// ===========================

const APP_NAME = "GigTracker";

const APP_SUBTITLE = "Driver Business Tracker";

const APP_VERSION = "2.3";

const APP_BUILD = "2026-08-02";
// ===========================
// GigTracker v2.0
// ===========================

let earnings =
parseFloat(localStorage.getItem("earnings")) || 0;

let fuel =
parseFloat(localStorage.getItem("fuel")) || 0;

let history =
JSON.parse(localStorage.getItem("history")) || [];
// Transaction ID

let nextId =
parseInt(localStorage.getItem("nextId")) || 1;
// ===========================
// Selected Gig App
// ===========================

// ===========================
// APP LIST
// ===========================

let apps =
JSON.parse(localStorage.getItem("apps")) ||

[
"Spark",
"Roadie",
"Amazon Flex",
"Shipt",
"DoorDash",
"Instacart"
];

let selectedApp =
localStorage.getItem("selectedApp") ||

apps[0];

localStorage.getItem("selectedApp") || "Spark";
// ===========================

// ===========================
// Date Helpers
// ===========================

function today(){

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    console.log("GIGTRACKER DATE TEST:", now.toString());
console.log("GIGTRACKER TODAY:", year + "-" + month + "-" + day);

    return year + "-" + month + "-" + day;

}
function currentTime(){

    return new Date().toLocaleTimeString([],{

        hour:"numeric",

        minute:"2-digit"

    });

}
function updateDisplay(){

    // ===========================
    // DATE SETUP
    // ===========================

    const now = new Date();

    const todayDate =
        today();

    // Monday = start of week
    const dayOfWeek = now.getDay();

    const daysFromMonday =
        dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart =
        new Date(now);

    weekStart.setDate(
        now.getDate() - daysFromMonday
    );

    weekStart.setHours(0,0,0,0);

    // Start of next week
    const weekEnd =
        new Date(weekStart);

    weekEnd.setDate(
        weekStart.getDate() + 7
    );

    // Start of current month
    const monthStart =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

    // Start of next month
    const monthEnd =
        new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );


    // ===========================
    // TODAY TOTALS
    // ===========================

    let todayGross = 0;
    let todayFuel = 0;


    // ===========================
    // WEEK TOTALS
    // ===========================

    let weekGross = 0;
    let weekFuel = 0;


    // ===========================
    // MONTH TOTALS
    // ===========================

    let monthGross = 0;
    let monthFuel = 0;


    // ===========================
    // APP EARNINGS
    // ===========================

    const appTotals = {};


    // ===========================
    // PROCESS HISTORY
    // ===========================

    history.forEach(function(item){

        // Backward compatibility
        if(!item.date){

            item.date = todayDate;

        }

        if(!item.time){

            item.time =
                now.toLocaleTimeString([],{
                    hour:"numeric",
                    minute:"2-digit"
                });

        }


        const itemDate =
            new Date(item.date + "T00:00:00");


        // -------------------------
        // TODAY
        // -------------------------

        if(item.date === todayDate){

            if(item.type === "earnings"){

                todayGross += item.amount;

            }else{

                todayFuel += item.amount;

            }

        }


        // -------------------------
        // WEEK
        // -------------------------

        if(
            itemDate >= weekStart &&
            itemDate < weekEnd
        ){

            if(item.type === "earnings"){

                weekGross += item.amount;

            }else{

                weekFuel += item.amount;

            }

        }


        // -------------------------
        // MONTH
        // -------------------------

        if(
            itemDate >= monthStart &&
            itemDate < monthEnd
        ){

            if(item.type === "earnings"){

                monthGross += item.amount;

            }else{

                monthFuel += item.amount;

            }

        }


        // -------------------------
        // TODAY'S APP EARNINGS
        // -------------------------

        if(
            item.type === "earnings" &&
            item.date === todayDate
        ){

            if(!appTotals[item.app]){

                appTotals[item.app] = 0;

            }

            appTotals[item.app] += item.amount;

        }

    });


    // ===========================
    // TODAY TOTALS
    // ===========================

    earnings = todayGross;

    fuel = todayFuel;

    const profit =
        todayGross - todayFuel;


    document.getElementById("earnings").innerHTML =
        "Earnings: $" +
        todayGross.toFixed(2);


    document.getElementById("fuel").innerHTML =
        "Fuel: $" +
        todayFuel.toFixed(2);


    const profitBox =
        document.getElementById("profit");


    profitBox.innerHTML =
        "Net Profit: $" +
        profit.toFixed(2);


    if(profit >= 0){

        profitBox.className =
            "profit";

    }else{

        profitBox.className =
            "loss";

    }


    // ===========================
    // HISTORY DISPLAY
    // ===========================

    const list =
        document.getElementById("history");

    list.innerHTML = "";


    history.forEach(function(item,index){

        const li =
            document.createElement("li");


        li.innerHTML = `

        <div class="historyLeft">

            <b>
                ${
                    item.type === "earnings"
                    ? "💵 " + item.app
                    : "⛽ Fuel"
                }
            </b>

            <br>

            $${item.amount.toFixed(2)}

            <br>

            <small>
                ${item.date}
                &nbsp;
                ${item.time}
            </small>

        </div>


        <div class="historyRight">

            <button onclick="editItem(${index})">
                ✏️ Edit
            </button>

            <button onclick="deleteItem(${index})">
                🗑 Delete
            </button>

        </div>

        `;


        list.appendChild(li);

    });


    // ===========================
    // WEEK DISPLAY
    // ===========================

    const weekGrossBox =
        document.getElementById("weekGross");

    if(weekGrossBox){

        weekGrossBox.innerHTML =
            "Gross: $" +
            weekGross.toFixed(2);

    }


    const weekFuelBox =
        document.getElementById("weekFuel");

    if(weekFuelBox){

        weekFuelBox.innerHTML =
            "Fuel: $" +
            weekFuel.toFixed(2);

    }


    const weekProfitBox =
        document.getElementById("weekProfit");

    if(weekProfitBox){

        weekProfitBox.innerHTML =
            "Profit: $" +
            (weekGross - weekFuel).toFixed(2);

    }


    // ===========================
    // MONTH DISPLAY
    // ===========================

    const monthGrossBox =
        document.getElementById("monthGross");

    if(monthGrossBox){

        monthGrossBox.innerHTML =
            "Gross: $" +
            monthGross.toFixed(2);

    }


    const monthFuelBox =
        document.getElementById("monthFuel");

    if(monthFuelBox){

        monthFuelBox.innerHTML =
            "Fuel: $" +
            monthFuel.toFixed(2);

    }


    const monthProfitBox =
        document.getElementById("monthProfit");

    if(monthProfitBox){

        monthProfitBox.innerHTML =
            "Profit: $" +
            (monthGross - monthFuel).toFixed(2);

    }


    // ===========================
    // APP LEADERBOARD
    // ===========================

    const sortedApps =
        Object.entries(appTotals)
        .sort(function(a,b){

            return b[1] - a[1];

        });


    // ===========================
    // BEST APP TODAY
    // ===========================

    const totalEarnings =
        todayGross;


    if(sortedApps.length){

        const best =
            sortedApps[0];


        const percent =
            totalEarnings > 0
            ? ((best[1] / totalEarnings) * 100).toFixed(0)
            : 0;


        document.getElementById("bestApp").innerHTML =
            "🥇 " + best[0];


        document.getElementById("bestAmount").innerHTML =
            "$" + best[1].toFixed(2);


        document.getElementById("bestPercent").innerHTML =
            percent +
            "% of today's earnings";

    }else{

        document.getElementById("bestApp").innerHTML =
            "--";

        document.getElementById("bestAmount").innerHTML =
            "$0.00";

        document.getElementById("bestPercent").innerHTML =
            "0% of today's earnings";

    }

// ===========================
// DAILY RESULTS
// ===========================

const dailyResults =
    document.getElementById("dailyResults");

let dailyHTML = "";

// Group transactions by date
const dailyTotals = {};

history.forEach(function(item){

if(!item.date){
    return;
}
    // Only show the current week
    const itemDate =
        new Date(item.date + "T00:00:00");

    if(
        itemDate >= weekStart &&
        itemDate < weekEnd
    ){

        if(!dailyTotals[item.date]){

            dailyTotals[item.date] = {
                earnings: 0,
                fuel: 0
            };

        }

        if(item.type === "earnings"){

            dailyTotals[item.date].earnings
                += Number(item.amount) || 0;

        }else if(item.type === "fuel"){

            dailyTotals[item.date].fuel
                += Number(item.amount) || 0;

        }

    }

});


// Sort dates oldest → newest
const dailyDates =
    Object.keys(dailyTotals).sort();


// Build daily cards
dailyDates.forEach(function(date){

    const totals =
        dailyTotals[date];

    const net =
        totals.earnings - totals.fuel;

console.log("DAILY RESULT DATE:", date);

const displayDate =
    new Date(date + "T12:00:00");
    const dayName =
        displayDate.toLocaleDateString(
            "en-US",
            { weekday: "long" }
        );

    const formattedDate =
        displayDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric"
            }
        );


    dailyHTML += `

        <div class="dailyCard">

            <h3>
                📅 ${dayName} — ${formattedDate}
            </h3>

            <div>
                Earnings:
                <strong>
                    $${totals.earnings.toFixed(2)}
                </strong>
            </div>

            <div>
                Fuel:
                <strong>
                    $${totals.fuel.toFixed(2)}
                </strong>
            </div>

            <div>
                Net:
                <strong>
                    $${net.toFixed(2)}
                </strong>
            </div>

        </div>

    `;

});


// Nothing recorded
if(dailyHTML === ""){

    dailyHTML =
        "<p>No daily results yet.</p>";

}


// Display results
if(dailyResults){

    dailyResults.innerHTML =
        dailyHTML;

}    // ===========================
    // APP SUMMARY
    // ===========================

    let appHTML = "";

    const highest =
        sortedApps.length
        ? sortedApps[0][1]
        : 1;


    const medals =
        ["🥇","🥈","🥉"];


    sortedApps.forEach(function(app,index){

        const percent =
            ((app[1] / highest) * 100)
            .toFixed(0);


        appHTML += `

        <div class="appCard">

            <div class="appTop">

                <span>
                    ${medals[index] || "🏅"}
                    ${app[0]}
                </span>

                <span>
                    $${app[1].toFixed(2)}
                </span>

            </div>


            <div class="progressBar">

                <div
                    class="progressFill"
                    style="width:${percent}%">
                </div>

            </div>


            <div class="percent">

                ${percent}% of top app

            </div>

        </div>

        `;

    });


    if(appHTML === ""){

        appHTML =
            "<p>No earnings yet.</p>";

    }


    const appSummary =
        document.getElementById("appSummary");


    if(appSummary){

        appSummary.innerHTML =
            appHTML;

    }

}


// ===========================

// ===========================

function addEarnings(){

    const amount = parseFloat(
        document.getElementById("earningsInput").value
    );

    if(isNaN(amount) || amount <= 0){

        alert("Enter valid earnings.");

        return;

    }

    history.unshift({

        id: nextId++,

        app: selectedApp,

        type: "earnings",

        amount: amount,

        date: today(),

        time: currentTime()

    });

    document.getElementById("earningsInput").value = "";

    saveData();

}
  



// ===========================

function addFuel(){

    const amount = parseFloat(

        document.getElementById("fuelInput").value

    );

    if(isNaN(amount) || amount <= 0){

        alert("Enter valid fuel amount.");

        return;

    }

    fuel += amount;

    history.unshift({

        id: Date.now(),

        type: "fuel",

        amount: amount,

date: today(),
        time: new Date().toLocaleTimeString([],{

            hour:"numeric",

            minute:"2-digit"

        })

    });

    document.getElementById("fuelInput").value = "";

    saveData();

}

// ===========================
// Week Number Helper
// ===========================

function getWeekNumber(date){

    const d = new Date(date);

    d.setHours(0,0,0,0);

    d.setDate(

        d.getDate() + 4 - (d.getDay() || 7)

    );

    const yearStart =

    new Date(

        d.getFullYear(),

        0,

        1

    );

    return Math.ceil(

        (((d - yearStart) / 86400000) + 1) / 7

    );

}

// ===========================
// ===========================
function updateSelectedApp(){

    document.getElementById("selectedApp").innerHTML =
    "Selected: <strong>" + selectedApp + "</strong>";

    document.querySelectorAll(".appBtn").forEach(function(btn){

        btn.classList.remove("activeApp");

        if(btn.innerText === selectedApp){

            btn.classList.add("activeApp");
        }

    });

}
// ===========================

function selectApp(app){

    selectedApp = app;

    localStorage.setItem("selectedApp",app);

    document.getElementById("selectedApp").innerHTML =
    "Selected: <strong>" + app + "</strong>";

    document.querySelectorAll(".appBtn").forEach(function(btn){

        btn.classList.remove("activeApp");

        if(btn.innerText===app){

            btn.classList.add("activeApp");

        }

    });

}
function renderApps(){

    const container =
    document.getElementById("appButtons");

    container.innerHTML = "";

    apps.forEach(function(app){

        const btn =
        document.createElement("button");

        btn.innerHTML = app;

        btn.className = "appBtn";

        if(app === selectedApp){

            btn.classList.add("activeApp");

        }

        btn.onclick = function(){

            selectApp(app);

        };

        container.appendChild(btn);

    });

}
// ===========================

function deleteItem(index){

    const item = history[index];

    if(!item){
        return;
    }

    const confirmed = confirm(

        "Delete this transaction?\n\n" +

        item.type.toUpperCase() +

        "\n$" +

        item.amount.toFixed(2)

    );

    if(!confirmed){
        return;
    }

    if(item.type==="earnings"){

        earnings -= item.amount;

    }else{

        fuel -= item.amount;

    }

    history.splice(index,1);

    saveData();

}

// ===========================

function editItem(index){

    const item = history[index];

    if(!item){
        return;
    }

    const newAmount = parseFloat(

        prompt(

            "Enter new amount:",

            item.amount.toFixed(2)

        )

    );

    if(isNaN(newAmount) || newAmount <= 0){

        return;

    }

    item.amount = newAmount;

    saveData();

}

// ===========================

function resetToday(){

    if(!confirm("Reset today's totals?")){
        return;
    }

    earnings=0;

    fuel=0;

    history=[];

    saveData();

}

// ===========================

function saveData(){

    localStorage.setItem(
    "earnings",
    earnings);

    localStorage.setItem(
    "fuel",
    fuel);

    localStorage.setItem(
    "history",
    JSON.stringify(history));
localStorage.setItem(
"nextId",
nextId);
   renderApps();

updateDisplay();

updateSelectedApp();



}

// ===========================

renderApps();
function renderManageApps(){

    const box =
    document.getElementById("manageApps");

    if(!box) return;

    box.innerHTML = "";

    apps.forEach(function(app,index){

        box.innerHTML += `

<div class="manageRow">

    <span>${app}</span>

    <div>

        <button onclick="renameApp(${index})">

        ✏️

        </button>

        <button onclick="deleteApp(${index})">

        🗑️

        </button>

    </div>

</div>

`;

    });

}

function addApp(){

    const input =
    document.getElementById("newApp");

    const name =
    input.value.trim();

    if(name==="") return;

    apps.push(name);

    localStorage.setItem(
        "apps",
        JSON.stringify(apps)
    );

    input.value="";

    renderApps();

    renderManageApps();

}

function renameApp(index){

    const newName =
    prompt("Rename App",apps[index]);

    if(!newName) return;

    apps[index] =
    newName.trim();

    localStorage.setItem(
        "apps",
        JSON.stringify(apps)
    );

    renderApps();

    renderManageApps();

}

function deleteApp(index){

    if(apps.length<=1){

        alert("At least one app is required.");

        return;

    }

    if(!confirm("Delete "+apps[index]+"?")){

        return;

    }

    apps.splice(index,1);

    if(!apps.includes(selectedApp)){

        selectedApp=apps[0];

        localStorage.setItem(
            "selectedApp",
            selectedApp
        );

    }

    localStorage.setItem(
        "apps",
        JSON.stringify(apps)
    );

    renderApps();

    renderManageApps();

}
function updateAppInfo(){

    document.getElementById("appTitle").innerHTML =
    "📊 " + APP_NAME;

    document.getElementById("appSubtitle").innerHTML =
    APP_SUBTITLE +
    " v" +
    APP_VERSION;

    document.title =
    APP_NAME +
    " v" +
    APP_VERSION;

}
renderApps();

renderManageApps();

updateAppInfo();

updateDisplay();

updateSelectedApp();
// ===========================
// EXPORT GIGTRACKER DATA
// ===========================

function exportGigTrackerData(){

    const historyData =
        JSON.parse(
            localStorage.getItem("history") || "[]"
        );

    if(historyData.length === 0){

        alert("No transaction data found.");

        return;

    }

    const backup = {
        app: "GigTracker",
        exportedAt: new Date().toString(),
        history: historyData
    };

    const json =
        JSON.stringify(backup, null, 2);

    const blob =
        new Blob(
            [json],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "GigTracker_Backup.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert(
        historyData.length +
        " transactions exported successfully."
    );

}