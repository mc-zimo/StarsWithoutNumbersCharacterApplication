window.onload = function () {
    setupCollapsibles();
    setupSelectors();
    setupEditButtons();
    setupDatabase();
}
let db;
let characterObj;

function setupCollapsibles() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function setupSelectors() {
    var sels = document.getElementsByClassName("fociSelect");
    var i;

    for (i = 0; i < sels.length; i++) {
        sels[i].addEventListener("change", function () {
            setFoci();
        });
    }
}

function setupEditButtons() {
    let button = document.getElementById("new-button");
    button.addEventListener("click", function () {
        let name = prompt("Please enter character name", "New Character");
        if (name != null) {
            characterObj = {};
            characterObj["name"] = name;
        }
        const transaction = db.transaction("characters", "readwrite");

        const store = transaction.objectStore("characters");

        store.put(characterObj);

        resetFields();
        setFields();
    })

    button = document.getElementById("load-button");
    button.addEventListener("click", function () {
        let name = prompt("Please enter character name", "New Character");
        if (name != null) {
            const transaction = db.transaction("characters", "readwrite");
            const store = transaction.objectStore("characters");
            const nameIndex = store.index("name")

            let nameQuery = store.get(name);

            nameQuery.onsuccess = function () {
                characterObj = nameQuery.result;
                setFields();
            }

            nameQuery.onerror = function (event) {
                console.log(`Database error: ${event.target.errorCode}`);
            }

        }
    })

    button = document.getElementById("save-button");
    button.addEventListener("click", function () {
        getFields();
        const transaction = db.transaction("characters", "readwrite");

        const store = transaction.objectStore("characters");
        const nameIndex = store.index("name")
        store.put(characterObj);
    })
}

function setupDatabase() {
    let request = window.indexedDB.open("CharacterDB", 1);

    request.onerror = function (event) {
        console.log(`Database error: ${event.target.errorCode}`);
    };

    // Create object store
    request.onupgradeneeded = function () {
        db = request.result;
        let objectStore = db.createObjectStore("characters", { keyPath: "name" });
        objectStore.createIndex("name", "name", { unique: true });
    };

    request.onsuccess = function () {
        db = request.result;
    };
}

function resetFields() {
    var stats = document.querySelectorAll('[contenteditable][id]');

    Array.prototype.forEach.call(stats, function (element, index) {
        if (element.tagName == "SELECT" || element.tagName == "INPUT") {
            element.value = "";
        }
        else {
            element.innerHTML = "";
        }
    });

    setFoci();
}

function setFields() {
    for (const [key, value] of Object.entries(characterObj)) {
        if (key != "id") {
            var element = document.getElementById(key);
            if (element.tagName == "SELECT" || element.tagName == "INPUT") {
                document.getElementById(key).value = value;
            }
            else {
                document.getElementById(key).innerHTML = value;
            }
        }
    }
    setFoci();
}

function getFields() {
    var stats = document.querySelectorAll('[contenteditable][id]');

    Array.prototype.forEach.call(stats, function (element, index) {
        if (element.tagName == "SELECT" || element.tagName == "INPUT") {
            characterObj[element.id] = element.value;
        }
        else {
            characterObj[element.id] = element.innerHTML;
        }
    });
}

function setFoci(){
    var foci = document.querySelectorAll('.foci');
    var text = "";

    Array.prototype.forEach.call(foci, function (focus, index) {
        console.log(document.getElementById("foci"+(index+1)).value);
        switch(document.getElementById("foci"+(index+1)).value){
            case('alert'): text = "Gain Notice as a bonus skill. You cannot be surprised, nor can others use the Execution Attack option on you. When you roll initiative, roll twice and take the best result.<br>You always act first in a combat round unless someone else involved is also this Alert."
            break;
            case('armsman'): text = "Gain Stab as a bonus skill. You can draw or sheath a Stowed melee or thrown weapon as an Instant action. You may add your Stab skill level to a melee or thrown weapon’s damage roll or Shock damage, assuming it has any to begin with.\n\nYour primitive melee and thrown weapons count as TL4 weapons for the purpose of overcoming advanced armors. Even on a miss with a melee weapon, you do an unmodified 1d4 damage to the target, plus any Shock damage. This bonus damage doesn’t apply to thrown weapons or attacks that use the Punch skill."
            break;
            case('assassin'): text = "Gain Sneak as a bonus skill. You can conceal an object no larger than a knife or pistol from anything less invasive than a strip search, including normal TL4 weapon detection devices. You can draw or produce this object as an On Turn action, and your point-blank ranged attacks made from surprise with it cannot miss the target.\n\nYou can take a Move action on the same round as you make an Execution Attack, closing rapidly with a target before you attack. You may split this Move action when making an Execution Attack, taking part of it before you murder your target and part of it afterwards. This movement happens too quickly to alert a victim or to be hindered by bodyguards, barring an actual physical wall of meat between you and your prey."
            break;
            case('authority'): text = "Gain Lead as a bonus skill. Once per day, you can make a request from an NPC who is not openly hostile to you, rolling a Cha/Lead skill check at a difficulty of the NPC’s Morale score. If you succeed, they will comply with the request, provided it is not harmful or extremely uncharacteristic.\n\nThose who follow you are fired with confidence. Any NPC being directly led by you gains a Morale and hit roll bonus equal to your Lead skill and a +1 bonus on all skill checks. Your followers will not act against your interests unless under extreme pressure."
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            case('xxx'): text = "xxx\n\nxxx"
            break;
            default: text="";
        }
        focus.innerHTML = text;
    });
}