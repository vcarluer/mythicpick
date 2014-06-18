window.onload = function () {
	"use strict";
    var div = document.getElementById("dyn");
    var para = document.createElement("p");
    para.innerHTML = "Hello js";
    div.appendChild(para);
};