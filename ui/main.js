console.log('Loaded!');

var txt = document.getElementById('dynamic');
txt.innerHTML = "GHOST EDIT!";

var logo = document.getElementById('anim');
var marginVal = 0;
function moveLeft() {
    marginVal = marginVal + 1;
    logo.style.marginRight = marginVal;
}

logo.onclick = function() {
    var interval = setInterval(moveLeft, 50);
}