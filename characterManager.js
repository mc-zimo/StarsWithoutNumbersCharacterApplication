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

function setFoci() {
    var foci = document.querySelectorAll('.foci');
    var text = "";

    Array.prototype.forEach.call(foci, function (focus, index) {
        console.log(document.getElementById("foci" + (index + 1)).value);
        switch (document.getElementById("foci" + (index + 1)).value) {
            case ('alert'): text = "Gain Notice as a bonus skill. You cannot be surprised, nor can others use the Execution Attack option on you. When you roll initiative, roll twice and take the best result.<br><br>You always act first in a combat round unless someone else involved is also this Alert."
                break;
            case ('armsman'): text = "Gain Stab as a bonus skill. You can draw or sheath a Stowed melee or thrown weapon as an Instant action. You may add your Stab skill level to a melee or thrown weapon’s damage roll or Shock damage, assuming it has any to begin with.<br><br>Your primitive melee and thrown weapons count as TL4 weapons for the purpose of overcoming advanced armors. Even on a miss with a melee weapon, you do an unmodified 1d4 damage to the target, plus any Shock damage. This bonus damage doesn’t apply to thrown weapons or attacks that use the Punch skill."
                break;
            case ('assassin'): text = "Gain Sneak as a bonus skill. You can conceal an object no larger than a knife or pistol from anything less invasive than a strip search, including normal TL4 weapon detection devices. You can draw or produce this object as an On Turn action, and your point-blank ranged attacks made from surprise with it cannot miss the target.<br><br>You can take a Move action on the same round as you make an Execution Attack, closing rapidly with a target before you attack. You may split this Move action when making an Execution Attack, taking part of it before you murder your target and part of it afterwards. This movement happens too quickly to alert a victim or to be hindered by bodyguards, barring an actual physical wall of meat between you and your prey."
                break;
            case ('authority'): text = "Gain Lead as a bonus skill. Once per day, you can make a request from an NPC who is not openly hostile to you, rolling a Cha/Lead skill check at a difficulty of the NPC’s Morale score. If you succeed, they will comply with the request, provided it is not harmful or extremely uncharacteristic.<br><br>Those who follow you are fired with confidence. Any NPC being directly led by you gains a Morale and hit roll bonus equal to your Lead skill and a +1 bonus on all skill checks. Your followers will not act against your interests unless under extreme pressure."
                break;
            case ('close combatant'): text = "Gain any combat skill as a bonus skill. You can use pistol-sized ranged weapons in melee without suffering penalties for the proximity of melee attackers. You ignore Shock damage from melee assailants, even if you’re unarmored at the time.<br><br>The Shock damage from your melee attacks treats all targets as if they were AC 10. The Fighting Withdrawal combat action is treated as an On Turn action for you and can be performed freely."
                break;
            case ('connected'): text = "Gain Connect as a bonus skill. If you’ve spent at least a week in a not-entirely-hostile location, you’ll have built a web of contacts willing to do favors for you that are no more than mildly illegal. You can call on one favor per game day and the GM decides how far they’ll go for you.<br><br>Once per game session, if it’s not entirely implausible, you meet someone you know who is willing to do modest favors for you. You can decide when and where you want to meet this person, but the GM decides who they are and what they can do for you."
                break;
            case ('die hard'): text = "You gain an extra 2 maximum hit points per level. This bonus applies retroactively if you take this focus after first level. You automatically stabilize if mortally wounded by anything smaller than a Heavy weapon.<br><br>The first time each day that you are reduced to zero hit points by an injury, you instead survive with one hit point remaining. This ability can’t save you from Heavy weapons or similar trauma."
                break;
            case ('diplomat'): text = "Gain Talk as a bonus skill. You speak all the languages common to the sector and can learn new ones to a workable level in a week, becoming fluent in a month. Reroll 1s on any skill check dice related to negotiation or diplomacy.<br><br>Once per game session, shift an intelligent NPC’s reaction roll one step closer to friendly if you can talk to them for at least thirty seconds."
                break;
            case ('gunslinger'): text = "Gain Shoot as a bonus skill. You can draw or holster a Stowed ranged weapon as an On Turn action. You may add your Shoot skill level to a ranged weapon’s damage roll.<br><br>Once per round, you can reload a ranged weapon as an On Turn action if it takes no more than one round to reload. Even on a miss with a Shoot attack, you do an unmodified 1d4 damage."
                break;
            case ('hacker'): text = "Gain Program as a bonus skill. When attempting to hack a database or computerized system, roll 3d6 on the skill check and drop the lowest die.<br><br>Your hack duration increases to 1d4+Program skill x 10 minutes. You have an instinctive understanding of the tech; you never need to learn the data protocols for a strange system and are always treated as familiar with it."
                break;
            case ('healer'): text = "Gain Heal as a bonus skill. You may attempt to stabilize one mortally-wounded adjacent person per round as an On Turn action. When rolling Heal skill checks, roll 3d6 and drop the lowest die.<br><br>Stims or other technological healing devices applied by you heal twice as many hit points as normal. Using only basic medical supplies, you can heal 1d6+Heal skill hit points of damage to every injured or wounded person in your group with ten minutes of first aid spread among them. Such healing can be applied to a given target only once per day."
                break;
            case ('henchkeeper'): text = "Gain Lead as a bonus skill. You can acquire henchmen within 24 hours of arriving in a community, assuming anyone is suitable hench material. These henchmen will not fight except to save their own lives, but will escort you on adventures and risk great danger to help you. Most henchmen will be treated as Peaceful Humans from the Xenobestiary section of the book. You can have one henchmen at a time for every three character levels you have, rounded up. You can release henchmen with no hard feelings at any plausible time and pick them back up later should you be without a current henchman.<br><br>Your henchmen are remarkably loyal and determined, and will fight for you against anything but clearly overwhelming odds. Whether through natural competence or their devotion to you, they’re treated as Martial Humans from the Xenobestiary section. You can make faithful henchmen out of skilled and highly-capable NPCs, but this requires that you actually have done them some favor or help that would reasonably earn such fierce loyalty. "
                break;
            case ('ironhide'): text = "You have an innate Armor Class of 15 plus half your character level, rounded up.<br><br>Your abilities are so effective that they render you immune to unarmed attacks or primitive weaponry as if you wore powered armor."
                break;
            case ('psychic training'): text = "Gain any psychic skill as a bonus. If this improves it to level-1 proficiency, choose a free level-1 technique from that discipline. Your maximum Effort increases by one.<br><br>When you advance a level, the bonus psychic skill you chose for the first level of the focus automatically gets one skill point put toward increasing it or purchasing a technique from it. You may save these points for later, if more are required to raise the skill or buy a particular technique. These points are awarded retroactively if you take this focus level later in the game."
                break;
            case ('savage fray'): text = "Gain Stab as a bonus skill. All enemies adjacent to you at the end of your turn whom you have not attacked suffer the Shock damage of your weapon if their Armor Class is not too high to be affected.<br><br>After suffering your first melee hit in a round, any further melee attacks from other assailants automatically miss you. If the attacker who hits you has multiple attacks, they may attempt all of them, but other foes around you simply miss."
                break;
            case ('shocking assault'): text = "Gain Punch or Stab as a bonus skill. The Shock damage of your weapon treats all targets as if they were AC 10, assuming your weapon is capable of harming the target in the first place.<br><br>In addition, you gain a +2 bonus to the Shock damage rating of all melee weapons and unarmed attacks. Regular hits never do less damage than this Shock would do on a miss."
                break;
            case ('sniper'): text = "Gain Shoot as a bonus skill. When making a skill check for an Execution Attack or target shooting, roll 3d6 and drop the lowest die.<br><br>A target hit by your Execution Attack takes a -4 penalty on the Physical saving throw to avoid immediate mortal injury. Even if the save is successful, the target takes double the normal damage inflicted by the attack."
                break;
            case ('specialist'): text = "Gain a non-combat, non-psychic skill as a bonus. Roll 3d6 and drop the lowest die for all skill checks in this skill.<br><br>Roll 4d6 and drop the two lowest dice for all skill checks in this skill."
                break;
            case ('star captain'): text = "Gain Lead as a bonus skill. Your ship gains 2 extra Command Points at the start of each turn.<br><br>A ship you captain gains bonus hit points equal to 20% of its maximum at the start of each combat. Damage is taken from these bonus points first, and they vanish at the end of the fight and do not require repairs to replenish before the next. In addition, once per engagement, you may resolve a Crisis as an Instant action by explaining how your leadership resolves the problem."
                break;
            case ('starfarer'): text = "Gain Pilot as a bonus skill. You automatically succeed at all spike drill-related skill checks of difficulty 10 or less.<br><br>Double your Pilot skill for all spike drill-related skill checks. Spike drives of ships you navigate are treated as one level higher; thus, a drive-1 is treated as a drive-2, up to a maximum of drive-7. Spike drills you personally oversee take only half the time they would otherwise require."
                break;
            case ('tinker'): text = "Gain Fix as a bonus skill. Your Maintenance score is doubled, allowing you to maintain twice as many mods. Both ship and gear mods cost only half their usual price in credits, though pretech salvage requirements remain the same.<br><br>Your Fix skill is treated as one level higher for purposes of building and maintaining mods and calculating your Maintenance score. Advanced mods require one fewer pretech salvage part to make, down to a minimum of zero."
                break;
            case ('unarmed combatant'): text = "Gain Punch as a bonus skill. Your unarmed attacks become more dangerous as your Punch skill increases. At level-0, they do 1d6 damage. At level-1, they do 1d8 damage. At level-2 they do 1d10, level-3 does 1d12, and level-4 does 1d12+1. At Punch-1 or better, they have the Shock quality equal to your Punch skill against AC 15 or less. While you normally add your Punch skill level to any unarmed damage, don’t add it twice to this Shock damage.<br><br>You know locks and twists that use powered servos against their wearer. Your unarmed attacks count as TL4 weapons for the purpose of overcoming advanced armors. Even on a miss with a Punch attack, you do an unmodified 1d6 damage."
                break;
            case ('unique gift'): text = "Whether due to exotic technological augmentation, a unique transhuman background, or a remarkable human talent, you have the ability to do something that’s simply impossible for a normal human.<br><br>This is a special focus which serves as a catch-all for some novel power or background perk that doesn’t have a convenient fit in the existing rules. A transhuman who can function normally in lethal environments, a nanotech-laden experimental subject with a head full of exotic sensors, or a brilliant gravitic scientist who can fly thanks to their personal tech might all take this focus to cover their special abilities.<br><br>It’s up to the GM to decide what’s reasonable and fair to be covered under this gift. If an ability is particularly powerful, it might require the user to take System Strain to use it, as described on page 32.<br><br>As a general rule this ability should be better than a piece of gear the PC could buy for credits. The player is spending a very limited resource when they make this focus pick, so what they get should be good enough that they can’t just duplicate it with a fat bank account."
                break;
            case ('wanderer'): text = "Gain Survive as a bonus skill. You can convey basic ideas in all the common languages of the sector. You can always find free transport to a desired destination for yourself and a small group of your friends provided any traffic goes to the place. Finding this transport takes no more than an hour, but it may not be a strictly legitimate means of travel and may require working passage.<br><br>You can forge, scrounge, or snag travel papers and identification for the party with 1d6 hours of work. These papers and permits will stand up to ordinary scrutiny, but require an opposed Int/Administer versus Wis/Notice check if examined by an official while the PC is actually wanted by the state for some crime. When finding transport for the party, the transportation always makes the trip at least as fast as a dedicated charter would."
                break;
            case ('wild psychic talent'): text = "Pick a psychic discipline. You gain an ability equivalent to the level-0 core power of that discipline. Optionally, you may instead pick a level-1 technique from that discipline, but that technique must stand alone; you can’t pick one that augments another technique or core ability. For example, you could pick the Telekinetic Armory technique from Telekinesis, because that ability does not require the use of any other Telekinesis power. You could not pick the Mastered Succor ability from Biopsionics, because that technique is meant to augment another power you don’t have.<br><br>You now have a maximum Effort of two points. You may pick a second ability according to the guidelines above. This second does not need to be a stand-alone technique if it augments the power you chose for level 1 of this focus. Thus, if your first pick was gaining the level-0 power of Psychic Succor, your second could be Mastered Succor. You still could not get the level-1 core power of Psychic Succor, however, as you’re still restricted to level-0."
                break;
            default: text = "";
        }
        focus.innerHTML = text;
    });
}