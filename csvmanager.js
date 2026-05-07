text = "N/A"
rowlimiter = "\n"
columnlimiter = "\t"
getCSV();

async function getCSV() {
    file = await fetch("dialogue.csv");
    text = await file.text();
    getScenes();
}

scenes = {}
rows = []

function getScenes() {
    rows = text.split(rowlimiter);

    for (let i = 0; i < rows.length; i++) {
        columns = rows[i].split(columnlimiter);

        // Una definición de escena tiene que empezar por #... y estar en columna 0
        if (columns[0].startsWith("#")) {
            scene_name = columns[0].substring(1);
            scenes[scene_name] = i;
        }
    }

    console.log(scenes);
    initScene("infierno");
}

current_scene = "N/A"
line = -1

function initScene(scene_name) {
    current_scene = scene_name;
    line = 0;
    console.log("Scene " + scene_name + " starting.");
    next_available = true;
    updatebutton();
    readNextLine();
}

var next_available = false;
// FLAGS ACCIONES Y CONTROL -----
var endf = false;
var yieldf = false;
var waitf = false;
var endtemp = false;

function readNextLine() {
    if (current_scene == "N/A") {
        console.warn("No scene is playing; no next line to follow. Ignoring.");
        return;
    }
    if (!next_available) {
        console.warn("Next line is not available yet.");
        return;
    }

    line++;
    current_row = scenes[current_scene] + line;
    columns = rows[current_row].split(columnlimiter);
    next_available = false;
    updatebutton();

    // ACCIONES (columna 0) -----
    // Acción texto: vacio
    if (columns[0] == "") {
        //console.log(columns[1] + ": " + columns[3]);
        showTextLine(columns[3]);
    }
    // Acción narrador
    if (columns[0] == "narrator") {
        showTextLine(columns[3]);
    }
    // Acción mando a flash
    if (columns[0] == "yieldf") {
        yieldf = true;
        execflashcontinue();
    }
    // Acción final escena
    if (columns[0] == "end") {
        endScene();
    }
    // Acción final escena (publicado hasta la fecha)
    if (columns[0] == "end-temp") {
        endtemp = true;
        showEndTemp();
        endScene();
    }

    // CONTROL (columna 2) -----
    // Control continuar flash
    if (columns[2] == "!f") {
        execflashcontinue();
    }
    // Control continuar flash cuando fin de dialogo
    if (columns[2] == "!endf") {
        endf = true;
    }
    // Control esperar a flash para continuar dialogo
    if (columns[2] == "!waitf") {
        waitf = true;
    }
}

function showTextLine() {
    text = '<p class="' + columns[1] + '" id="current-line"></p>';
    document.getElementById("dialogue").innerHTML += text;
    message = columns[3];
    writeText(message, 0);
}

function showEndTemp() {
    text = '<p id="current-line"></p>';
    document.getElementById("dialogue").innerHTML += text;
    message = "(HAS LLEGADO AL FINAL DE LA HISTORIA PUBLICADA)";
    writeText(message, 0);
}

function writeText(message, i) {
    document.getElementById("current-line").innerHTML += message.charAt(i);
    i++;
    if (i < message.length) {
        setTimeout(writeText, 50, message, i);
    }
    else {
        if (endf) {
            execflashcontinue();
            endf = false;
        }
        if (!waitf) {
            line_finished();
        }
    }
}

function line_finished() {
    document.getElementById("current-line").id = "";
    if (!endtemp) {
        next_available = true;
        updatebutton();
    }
}

function endScene() {
    current_scene = "N/A";
    line = -1;
    console.log("Scene " + scene_name + " ended.");
}

function updatebutton() {
    console.log(document.getElementById("next-button").disabled);
    document.getElementById("next-button").disabled = !next_available;
}