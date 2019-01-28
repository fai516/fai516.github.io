'use strict';
let htmlTemplate = [
  {}
]


let myForm = document.getElementById("myForm");
let labels = [
  "name",
  "position",
  "email",
  "dl",
  "hkm",
  "chm"
]
let mapping = {
  "name":"qname",
  "position":"qposition",
  "email":"qemail",
  "dl":"qdl",
  "hkm":"qhkm",
  "chm":"qchm"
};

let json = {};

let metaData = function(str){
  switch(str){
    case "name": return `<span style="font-weight:bold">${json[str]}</span>`;
    case "position": return `${json[str]}`;
    case "email": return `<a href="mailto:${json[str]}">${json[str]}</a>`;
    case "dl": return `D +852 ${json[str]} `;
    case "hkm": return `HKM +852 ${json[str]} `;
    case "chm": return `CHM +852 ${json[str]} `;
    default: return "";
  }
}

function getData(){
  for(let label of labels){
    json[label] = myForm.querySelector(`input[name='${mapping[label]}']`).value;
  }
}


function render(){
  let select = [1,3,9,10,13,14];
  let p = document.querySelectorAll("body>div>p");
  console.log(p);
  let j=0;
  for(let i=0;i<p.length;i++){
    if(i==select[j]){
      let str = metaData(labels[j]);
      // let parser = new DOMParser();
      // let html = parser.parseFromString(str,"text/html");
      p[i].innerHTML = str;

      (j>=select.length?j=0:j++);
    }
  }
}



function run(){
  console.log("run");
  getData();
  render();
}

function clearForm(){
  console.log("clear");
  for(let label of labels){
    myForm.querySelector(`input[name='${mapping[label]}']`).value = "";
  }
}

run();