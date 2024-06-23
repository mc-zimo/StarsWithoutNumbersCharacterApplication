let character;
let key;

window.onload = function () {
    initCharacterData();
    loadCharacter();
    var elements = document.querySelectorAll('[contenteditable][id]');
    Array.prototype.forEach.call(elements, function (element, index) {
        if (element.id == "name") {
            element.addEventListener('blur', function () {
                characterExists(this.innerHTML, function(exists){
                    console.log(exists);
                    if(exists){
                        loadCharacterDataByName(this.innerHTML);
                        setCharacterData();
                    }
                    else {
                        var answer = window.confirm("Create New Character?");
                        if (answer) {
                            character[this.id] = this.innerHTML;
                            setCharacterData();
                            saveCharacterData();
                        }
                        else {
                            character[this.id] = this.innerHTML;
                            setCharacterData();
                            saveCharacterData();
                        }
                    }
                });
            });
        } else {
            element.addEventListener('blur', function () {
                character[this.id] = this.innerHTML;
                setCharacterData();
                saveCharacterData();
            });
        }
    });

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

function setCharacterData() {
    for (const [key, value] of Object.entries(character)) {
        if (key != "id") {
            document.getElementById(key).innerHTML = value;
        }
    }
}

function initCharacterData() {
    character = {}
    var stats = document.querySelectorAll('[id]');

    Array.prototype.forEach.call(stats, function (element, index) {
        character[element.id] = element.innerHTML;
    });
}

function getCharacterData() {
    character = {}
    var stats = document.querySelectorAll('[id]');

    Array.prototype.forEach.call(stats, function (element, index) {
        character[element.id] = element.innerHTML;
    });
}

function saveCharacterData() {
    // Open the database
    let request = window.indexedDB.open("CharacterDatabase", 1);
    let db;

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
        const transaction = db.transaction("characters", "readwrite");

        const store = transaction.objectStore("characters");
        const nameIndex = store.index("name")

        var stats = document.querySelectorAll('[contenteditable][id]');

        store.put(character);

        transaction.oncomplete = function () {
            db.close();
        };
    };


}

function characterExists(characterName, callback) {
    // Open the database
    let request = window.indexedDB.open("CharacterDatabase", 1);
    let db;

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
        const transaction = db.transaction("characters", "readwrite");

        const store = transaction.objectStore("characters");
        const nameIndex = store.index("name")

        let nameQuery = store.get(characterName);

        nameQuery.onsuccess = function () {
            console.log(nameQuery);
            if (nameQuery.result) {
                callback(true);
            } else {
                callback(false);
            }
        }

        nameQuery.onerror = function () {
            callback(false);
        }

        transaction.oncomplete = function () {
            db.close();
        };
    };


}

function loadCharacter() {
    // Open the database
    let request = window.indexedDB.open("CharacterDatabase", 1);
    let db;

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
        const transaction = db.transaction("characters", "readwrite");

        const store = transaction.objectStore("characters");
        const nameIndex = store.index("name")

        let idQuery = store.getAll();

        idQuery.onsuccess = function () {
            if (idQuery.result.length > 0) {
                character = idQuery.result[idQuery.result.length - 1];
                setCharacterData();
            }
        }

        idQuery.onerror = function () {
            console.log(idQuery);
        }

        transaction.oncomplete = function () {
            db.close();
        };
    };


}

function loadCharacterDataByName(characterName) {
    // Open the database
    let request = window.indexedDB.open("CharacterDatabase", 2);
    let db;

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
        const transaction = db.transaction("characters", "readwrite");

        const store = transaction.objectStore("characters");
        const nameIndex = store.index("name")

        let nameQuery = store.get(characterName);

        nameQuery.onsuccess = function () {
            console.log(nameQuery.result);
        }

        nameQuery.onerror = function () {
            console.log(nameQuery);
        }

        transaction.oncomplete = function () {
            db.close();
        };
    };


}


