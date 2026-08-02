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

    const profit = earnings - fuel;

    document.getElementById("earnings").innerHTML =
    "Earnings: $" + earnings.toFixed(2);

    document.getElementById("fuel").innerHTML =
    "Fuel: $" + fuel.toFixed(2);

    const profitBox =
    document.getElementById("profit");

    profitBox.innerHTML =
    "Net Profit: $" + profit.toFixed(2);

    if(profit>=0){
        profitBox.className="profit";
    }else{
        profitBox.className="loss";
    }

    const list =
    document.getElementById("history");

    list.innerHTML="";

    history.forEach(function(item,index){

        const li=document.createElement("li");

        li.innerHTML=`
        <span>
        ${item.type==="earnings"?"💵":"⛽"}
        $${item.amount.toFixed(2)}
        </span>

        <button onclick="deleteItem(${index})">
        Delete
        </button>
        `;

        list.appendChild(li);

    });

}

// ===========================

function addEarnings(){

    const amount=parseFloat(
    document.getElementById("earningsInput").value);

    if(isNaN(amount)||amount<=0){
        alert("Enter valid earnings.");
        return;
    }

    earnings+=amount;

    history.unshift({

        type:"earnings",

        amount:amount

    });

    document.getElementById("earningsInput").value="";

    saveData();

}

// ===========================

function addFuel(){

    const amount=parseFloat(
    document.getElementById("fuelInput").value);

    if(isNaN(amount)||amount<=0){
        alert("Enter valid fuel amount.");
        return;
    }

    fuel+=amount;

    history.unshift({

        type:"fuel",

        amount:amount

    });

    document.getElementById("fuelInput").value="";

    saveData();

}

// ===========================

function deleteItem(index){

    const item=history[index];

    if(item.type==="earnings"){
        earnings-=item.amount;
    }else{
        fuel-=item.amount;
    }

    history.splice(index,1);

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