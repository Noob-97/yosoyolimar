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
    initScene("scn1");
}

current_scene = "N/A"
line = -1


function initScene(scene_name) {
    current_scene = scene_name;
    line = 0;
    console.log("Scene " + scene_name + " starting.");
    readNextLine();
}

function readNextLine() {
    line++;
    current_row = scenes[current_scene] + line;
    columns = rows[current_row].split(columnlimiter);

    // ACCIONES (columna 0) -----
    // Acción texto: vacio
    if (columns[0] == "") {
        console.log(columns[1] + ": " + columns[2]);
        readNextLine();
    }
    if (columns[0] == "end") {
        endScene();
    }
}

function endScene() {
    current_scene = "N/A";
    line = -1;
    console.log("Scene " + scene_name + " ended.");
}