console.log('Loaded!');

/*var txt = document.getElementById('dynamic');
txt.innerHTML = "GHOST EDIT!";*/

var logo = document.getElementById('anim');
var marginVal = 0;
function moveLeft() {
    marginVal = marginVal + 1;
    logo.style.marginRight = marginVal + 'px';
}

logo.onclick = function() {
    var interval = setInterval(moveLeft, 50);
};

var button = document.getElementById('counter');
var count = document.getElementById('count');

button.onclick = function(){
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE)
            if (request.status == 200) {
                var counter = request.responseText;
                count.innerHTML = counter;
            }
    };
    
    request.open('GET', 'http://ee14b012.imad.hasura-app.io/counter', true);
    request.send(null);
};

var nameInput = document.getElementById('name');
var inName = nameInput.value;
var submit = document.getElementById('submit_btn');
var namelist = document.getElementById('namelist');

submit.onclick = function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE)
            if (request.status == 200) {
                var names = JSON.parse(request.responseText);
                var list = '';
                
                for (var i=0; i < names.length; ++i) {
                    list += "<li>" + names[i] + "</li>";
                }
                namelist.innerHTML = list;
            }
    };
    
    request.open('GET', 'http://ee14b012.imad.hasura-app.io/submit-name?name=' + inName, true);
    request.send(null);
};