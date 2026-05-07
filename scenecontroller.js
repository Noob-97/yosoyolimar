window.RufflePlayer.config = {
    "autoplay": "on",
    "unmuteOverlay": "hidden",
};

function execflashcontinue() {
    flash = document.getElementById("flash-file");
    flash.flacontinue(null);
};

function proceedfire() {
    if (yieldf) {
        yieldf = false;
        next_available = true;
        updatebutton();
        readNextLine();
    }
}

function endwaitfire() {
    if (waitf) {
        waitf = false;
        line_finished();
    }
}