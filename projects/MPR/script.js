function draftSubmission(){
    var text = document.getElementById("mathText").value;
    var new_text = "$$" + text + "$$";
    document.getElementById("HTML_CSS").innerHTML = new_text;
    MathJax.Hub.Typeset("HTML_CSS",function(){
        putSvg(getSvg());
    });
}

function clearDraft(){
    document.getElementById("mathText").value = "";
}

function getSvg(){
    if(!document.getElementById("mathText").value) return;
    var svg = document.getElementsByTagName("svg")[2];
    var SvgStr = new XMLSerializer().serializeToString(svg);
    return SvgStr;
}

function putSvg(svgStr){
    if(svgStr==undefined) svgStr="";
    document.getElementById("svgCode").value = svgStr;
}

function pickExample(n){
    switch(n){
        case 1: return "f(x|\\mu,\\sigma^2)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-\\frac{(x-\\mu)^2}{2\\mu^2}}";
        case 2: return "e^{i\\pi}+1=0";
        case 3: return "e^{x}=\\lim_{n\\to\\infty}\\left(1+\\frac{x}{n}\\right)^{n}";
        case 4: return "e^{ix}=\\cos{x}+i\\sin{x}";
        case 5: return "\\Gamma(z) = \\int_{0}^{\\infty}x^{z-1}e^{-x}dx";
        case 6: return "\\int_{-\\infty}^{\\infty}e^{-x^2}dx=\\sqrt{\\pi}"
        default: return "";
    }
}

function putExample(str){
    document.getElementById("mathText").value = str;
    draftSubmission();
}

function copySVGCodetoClipboard(timer){
    document.getElementById("svgCode").select();
    document.execCommand("copy");
    var btn = document.getElementById("copyContent");
    var pre = btn.value;
    btn.disabled = true;

    var countDown = setInterval(function(){
                        if(timer==0) {
                            btn.value = pre;
                            btn.disabled = false;
                            clearInterval(countDown)
                        }
                        else{
                            btn.value = "Copied("+timer+")";
                            timer--;
                        }
                    },1000);
}

function svgToPng(){
    var svgText = getSvg();
    if(svgText==undefined){alert("SVG is absent or invaild! Check your LATEX Code."); return;}
    else{
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var DOMURL = self||self.url||self.webkitURL;
        
        var img = new Image();
        var svg = new Blob([svgText], {type: 'image/svg+xml'});
        var url = (window.DOMURL ? DOMURL : URL).createObjectURL(svg);
        var png_img = "a";
        img.onload = function () { //onload event
            ctx.drawImage(img, 0, 0);
            (window.DOMURL ? DOMURL : URL).revokeObjectURL(url);
            png_img = canvas.toDataURL("image/png");
            downloadFile(png_img);
            ctx.clearRect(0, 0, canvas.width, canvas.height);//clear drawing or it will get overlap by multiple requests
        }
          
        img.src = url; //this is to trigger onload event
    }
}

function downloadFile(src){
    console.log(src);
    var elem = document.createElement("a");
    elem.style.display = "none";
    elem.setAttribute("href",src);
    elem.setAttribute("download","math.png");
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}