
const koleso = document.getElementById("koleso");
const znak = document.getElementById("znak");

document.addEventListener("keydown",function(event){
	jump();
});

function jump () {
	
	if (koleso.classList != "jump"){
		koleso.classList.add("jump")
	}
	setTimeout (function (){
		koleso.classList.remove("jump")
	}, 300)
}

let isAlive = setInterval (function(){
	let kolesoTop = parseInt(window.getComputedStyle(koleso).getPropertyValue("top"));
	let znakleft = parseInt(window.getComputedStyle(znak).getPropertyValue("left"));
  
    if (znakleft < 55 && znakleft > 20 && kolesoTop >= 150){
    	alert("БАМБУК ПРОИГРАЛ ")
    }
}, )