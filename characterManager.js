window.onload = function () {
    setupCollapsibles();
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
        if (element.tagName == "SELECT") {
            element.value = "";
        }
        else {
            element.innerHTML = "";
        }
    });
}

function setFields() {
    for (const [key, value] of Object.entries(characterObj)) {
        if (key != "id") {
            var element = document.getElementById(key);
            if (element.tagName == "SELECT") {
                document.getElementById(key).value = value;
            }
            else {
                document.getElementById(key).innerHTML = value;
            }
        }
    }
}

function getFields() {
    var stats = document.querySelectorAll('[contenteditable][id]');

    Array.prototype.forEach.call(stats, function (element, index) {
        if (element.tagName == "SELECT") {
            characterObj[element.id] = element.value;
        }
        else {
            characterObj[element.id] = element.innerHTML;
        }
    });
}