// ===========================
// GigTracker v2.0
// ===========================

let earnings =
parseFloat(localStorage.getItem("earnings")) || 0;

let fuel =
parseFloat(localStorage.getItem("fuel")) || 0;

let history =
JSON.parse(localStorage.getItem("history")) || [];

// ===========================

function updateDisplay(){

  // Recalculate totals from history

earnings = 0;
fuel = 0;

history.forEach(function(item){

    if(item.type==="earnings"){

        earnings += item.amount;

    }else{

        fuel += item.amount;

    }

});

const profit = earnings - fuel;

document.getElementById("earnings").innerHTML =
"Earnings: $" + earnings.toFixed(2);

document.getElementById("fuel").innerHTML =
"Fuel: $" + fuel.toFixed(2);

const profitBox =
document.getElementById("profit");

profitBox.innerHTML =
"Net Profit: $" + profit.toFixed(2);

    if(profit >= 0){

        profitBox.className = "profit";

    }else{

        profitBox.className = "loss";

    }

    // -------------------------
    // Calculate Week / Month Totals
    // -------------------------

    let weekGross = 0;
    let weekFuel = 0;

    let monthGross = 0;
    let monthFuel = 0;

    const now = new Date();

    const currentWeek =
    getWeekNumber(now);

    const currentMonth =
    now.getMonth();

    const currentYear =
    now.getFullYear();

    // -------------------------

    const list =
    document.getElementById("history");

    list.innerHTML = "";

    history.forEach(function(item,index){

        // Backward compatibility
        if(!item.date){

            item.date =
            now.toISOString().split("T")[0];

        }

        if(!item.time){

            item.time =
            now.toLocaleTimeString([],{

                hour:"numeric",

                minute:"2-digit"

            });

        }

        const itemDate =
        new Date(item.date);

        if(

            getWeekNumber(itemDate) === currentWeek &&

            itemDate.getFullYear() === currentYear

        ){

            if(item.type==="earnings"){

                weekGross += item.amount;

            }else{

                weekFuel += item.amount;

            }

        }

        if(

            itemDate.getMonth()===currentMonth &&

            itemDate.getFullYear()===currentYear

        ){

            if(item.type==="earnings"){

                monthGross += item.amount;

            }else{

                monthFuel += item.amount;

            }

        }

        const li =
        document.createElement("li");

        li.innerHTML = `

        <div>

            <strong>

            ${item.type==="earnings" ? "💵 Earnings" : "⛽ Fuel"}

            </strong>

            <br>

            $${item.amount.toFixed(2)}

            <br>

            <small>

            ${item.date}

            ${item.time}

            </small>

        </div>

<div style="margin-top:8px;">

<button onclick="editItem(${index})">

✏ Edit

</button>

<button onclick="deleteItem(${index})">

🗑 Delete

</button>

</div>
        `;

        list.appendChild(li);

    });

    // -------------------------
    // Week Totals
    // -------------------------

    const weekGrossBox =
    document.getElementById("weekGross");

    if(weekGrossBox){

        weekGrossBox.innerHTML =
        "Gross: $" + weekGross.toFixed(2);

    }

    const weekFuelBox =
    document.getElementById("weekFuel");

    if(weekFuelBox){

        weekFuelBox.innerHTML =
        "Fuel: $" + weekFuel.toFixed(2);

    }

    const weekProfitBox =
    document.getElementById("weekProfit");

    if(weekProfitBox){

        weekProfitBox.innerHTML =
        "Profit: $" + (weekGross-weekFuel).toFixed(2);

    }

    // -------------------------
    // Month Totals
    // -------------------------

    const monthGrossBox =
    document.getElementById("monthGross");

    if(monthGrossBox){

        monthGrossBox.innerHTML =
        "Gross: $" + monthGross.toFixed(2);

    }

    const monthFuelBox =
    document.getElementById("monthFuel");

    if(monthFuelBox){

        monthFuelBox.innerHTML =
        "Fuel: $" + monthFuel.toFixed(2);

    }

    const monthProfitBox =
    document.getElementById("monthProfit");

    if(monthProfitBox){

        monthProfitBox.innerHTML =
        "Profit: $" + (monthGross-monthFuel).toFixed(2);

    }

}



// ===========================

function addEarnings(){

    const amount = parseFloat(

        document.getElementById("earningsInput").value

    );

    if(isNaN(amount) || amount <= 0){

        alert("Enter valid earnings.");

        return;

    }

    earnings += amount;

    history.unshift({

        id: Date.now(),

        type: "earnings",

        amount: amount,

        date: new Date().toISOString().split("T")[0],

        time: new Date().toLocaleTimeString([],{

            hour:"numeric",

            minute:"2-digit"

        })

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

        date: new Date().toISOString().split("T")[0],

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

    updateDisplay();

}

// ===========================

updateDisplay();