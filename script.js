var byid = id => document.getElementById(id)
	var rdrt = (num, dec) => Math.round((num + Number.EPSILON) * (10 ** dec)) / (10 ** dec)
	var theme = localStorage.getItem("theme") || "light"
	localStorage.setItem("theme", theme)
	settheme(theme)
	if(theme == "dark")
		byid("switch").classList.toggle("switched")
	var CASHE = {}
	var rgbtheme = [Math.floor(Math.random() * 180 + 60), Math.floor(Math.random() * 180 + 60), Math.floor(Math.random() * 180 + 60)]
	byid("all").style.setProperty("--r", rgbtheme[0])
	byid("all").style.setProperty("--g", rgbtheme[1])
	byid("all").style.setProperty("--b", rgbtheme[2])
	
	function resizeme(el){
		if(!validnum(el.value, " 0123456789/*.,+-()".split("")))
			el.classList.add("invalid")
		else
			el.classList.remove("invalid")
		if(el.value.length <= 1){
			el.style.width = "2rem"}
		else{
			el.style.width = `calc(${el.value.length}ch + 1.1rem)`}
		if(byid("coefa").value.length != 0 && byid("coefb").value.length != 0 && byid("coefc").value.length != 0){
			gogo()}
	}
	
	function doswitch(){
		byid("switch").classList.toggle("switched")
		theme = theme == "light" ? "dark" : "light"
		localStorage.setItem("theme", theme)
		settheme(theme)
	}
	
	function settheme(desired){
		if(desired=="dark"){
			byid("all").style.setProperty("--fg", 255)
			byid("all").style.setProperty("--bg", 0)
		}
		else{
			byid("all").style.setProperty("--fg", 0)
			byid("all").style.setProperty("--bg", 255)
		}
	}
	function equationstyle(a, b, c){
		if(a == 0)
			return "nekvadratická rovnice"
		if(b == 0 && c == 0)
			return "nulová rovnice <div class='tip'>není potřeba počítat dále</div>"
		if(b == 0)
			return "ryze kvadratická rovnice <div class='tip'>lze řešit jednoduchým odmocněním</div>"
		if(c == 0)
			return "rovnice bez absolutního členu <div class='tip'>lze řešit vytknutím x</div>"
		if(a == 1)
			return "normovaná kvadratická rovnice <div class='tip'>lze řešit rozkladem</div>"
		return "standartní kvadratická rovnice"
	}
	function getD(a = 1, b = 1, c = 0){
		return b ** 2 - (4 * a * c)
	}
	function compute(a, b, c, D){
		return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)]
	}
	function givememenumber(str){
		try{
			var x = eval(str.split(",").join("."))
		}catch(e){
			return {valid: false}
		}
		if(typeof x != "number")
			return {valid: false}
		return {valid: true, val: x}
	}
	function getcoefs(progress){
		try{
			var A = givememenumber(byid("coefa").value)
			var B = givememenumber(byid("coefb").value)
			var C = givememenumber(byid("coefc").value)
			if(!(A.valid && B.valid && C.valid))
				return {allvalid: false}
			return {
				allvalid: true,
				a: A.val,
				b: B.val,
				c: C.val,
				written: {
					a: byid("coefa").value,
					b: byid("coefb").value,
					c: byid("coefc").value
				},
				rounded: {
					a: rdrt(A.val, 5),
					b: rdrt(B.val, 5),
					c: rdrt(C.val, 5)
				}
			}
		}catch(e){
			progress.error = e
			return
		}
	}
	function writedown(progress, coefs){
		if(!coefs.allvalid){
			byid("step1").innerHTML = `zadané údaje nejde přečíst!`
			byid("result").innerHTML = `zadané údaje nejde přečíst!`
			progress.error = "invalid input"
			console.error(progress)
			return
		}
		if(coefs.a == 0){
			byid("result").innerHTML = `nekvadratická rovnice!`
			progress.error = "formula not quadratic, a = 0"
			console.error(progress)
		}
		byid("step1").innerHTML = `a = ${coefs.written.a} = ${coefs.rounded.a}<br>b = ${coefs.written.b} = ${coefs.rounded.b}<br>c = ${coefs.written.c} = ${coefs.rounded.c}<br>typ rovnice: ${equationstyle(coefs.a, coefs.b, coefs.c)}`
	}
	function expressD(progress, coefs){
		if(progress.error){
			byid("step2").innerHTML = "nelze pokračovat"
			return
		}
		var d = getD(coefs.a, coefs.b, coefs.c)
		byid("step2").innerHTML = `D = b<sup>2</sup> - 4ac <b>=</b><wbr> (${coefs.written.b})<sup>2</sup> - 4 * (${coefs.written.a}) * (${coefs.written.c}) <b>=</b><wbr> ${coefs.rounded.b}<sup>2</sup> - 4 * ${coefs.rounded.a} * ${coefs.rounded.c} <b>=</b><wbr> ${rdrt(d, 5)}<br><br>`
		if(d < 0){
			byid("step2").innerHTML += "D < 0, bude 0 řešení"
			progress.error = "discriminant below 0"
			console.error(progress)
			byid("result").innerHTML = "K = ∅ = {}  (D < 0)"
		}
		if(d == 0)
			byid("step2").innerHTML += "D = 0, bude 1 řešení (dvojitý kořen) <div class='tip'>stačí vypočítat jeden kořen</div>"
		if(d > 0)
			byid("step2").innerHTML += "D > 0, budou 2 řešení"
		return d
		
	}
	function dosolve(progress, coefs, d){
		if(progress.error){
			byid("step3").innerHTML = "nelze pokračovat"
			return
		}
		var xses = compute(coefs.a, coefs.b, coefs.c, d)
		byid("step3").innerHTML = `x<sub>1</sub> <b>=</b><wbr> (-b + √D) / 2a <b>=</b><wbr> (-1 * ${coefs.rounded.b} + √(${rdrt(d, 5)})) / (2 * ${coefs.rounded.a}) <b>=</b><wbr> ${rdrt(xses[0], 5)}<br><br>`
		byid("step3").innerHTML += `x<sub>2</sub> <b>=</b><wbr> (-b - √D) / 2a <b>=</b><wbr> (-1 * ${coefs.rounded.b} - √(${rdrt(d, 5)})) / (2 * ${coefs.rounded.a}) <b>=</b><wbr> ${rdrt(xses[1], 5)}`
		byid("result").innerHTML = `K = {${rdrt(xses[0], 5)}; ${rdrt(xses[1], 5)}} <wbr><small>(x<sub>1</sub> = ${rdrt(xses[0], 5)}; x<sub>2</sub> = ${rdrt(xses[1], 5)})</small>`
		return xses
	}
	function prepdraw(progress, coefs, d){
		if(progress.error && progress.error != "discriminant below 0"){
			byid("step4").innerHTML = "nelze pokračovat"
			return
		}
		byid("step4").innerHTML = '<button onclick="godraw()">Vytvořit graf</button>'
	}
	function godraw(){
		var cf = CASHE.coefs
		if(!CASHE.solution)
			CASHE.solution = [solvey(cf.a,cf.b,cf.c,parabolatip(cf.a,cf.b,cf.c)), solvey(cf.a,cf.b,cf.c,parabolatip(cf.a,cf.b,cf.c))]
		var plotw = Math.floor(byid("solution").getBoundingClientRect().width * 0.8)
		var ploth = Math.floor((window.innerWidth + window.innerHeight * 2) / 6)
		byid("step4").innerHTML = `<div><canvas id="plotlab" width="${plotw}" height="${ploth}"></canvas></div><br>průnik s osou y: y = ${rdrt(solvey(cf.a,cf.b,cf.c,0),5)}<br>průniky s osou x: <a href="#result">viz výsledek</a><br>vrchol paraboly: [${rdrt(parabolatip(cf.a,cf.b,cf.c),5)}; ${rdrt(solvey(cf.a,cf.b,cf.c,parabolatip(cf.a,cf.b,cf.c)), 5)}] (x<sub>V</sub> = -b / 2a)`
		$("#plotlab").quadraticPlot({
		coeff: {a: CASHE.coefs.a, b: CASHE.coefs.b, c: CASHE.coefs.c},  //Coefficients a,b,c in ax^2+bx+c
		background: theme == "dark" ? "#000" : "#FFF",    //The background of the canvas element 
		curveColour : `rgba(${rgbtheme.join(",")}, 1)`, //The colour to draw the parabola
		curveWidth:2.5,         //The width of the line for the parabola
		drawAxis : true,      //Draw x and y axis
		axisColour: theme == "dark" ? "#FFF" : "#000",    // Colour for the x and y axis
		step: 1 / getscale(plotw, ploth, CASHE.solution, cf.a,cf.b,cf.c),             //Value to increment the x value. smaller means smoother lines
		unitPixels: getscale(plotw, ploth, CASHE.solution, cf.a,cf.b,cf.c),        //1unit = X pixels. Default is 1unit=10px
		drawGrid : getscale(plotw, ploth, CASHE.solution, cf.a,cf.b,cf.c) >= 3,      //draw grids of defined unitPixels
		gridColour: theme == "dark" ? "#444" : "#DDD",    //The colour of the grid
	})
	}
	function gogo(){
		var progress = {error: false, step: 0}
		var coefs = getcoefs(progress)
		progress.step++
		writedown(progress, coefs)
		progress.step++
		var d = expressD(progress, coefs)
		progress.step++
		var xses = dosolve(progress, coefs, d)
		progress.step++
		prepdraw(progress, coefs, d)
		CASHE = {"progr": progress, "coefs": coefs, "d": d, "solution": xses}
	}
function getscale(pwidth, pheight, roots, a,b,c){
    var target = (roots.includes(0) || ((roots[0] / roots[1]) > 0)) ? 3 : 4;
    var maximum = Math.max(Math.abs(roots[0]), Math.abs(roots[1]))
    return minmidmax(0, Math.min(
        ((pwidth / 2) / target) / maximum,
        ((pheight / 2) / 1.2) / Math.abs(solvey(a,b,c,parabolatip(a,b,c)))
    ), Math.min(pwidth, pheight) * 0.45)
}
function minmidmax(min, mid, max){
    if(mid < min)
        return min
    if(mid > max)
        return max
    return mid
}
	function parabolatip(a, b, c){
		return -b / (2 * a)
	}
	function solvey(a, b, c, x){
		return a * (x ** 2) + b * x + c
	}
	function validnum(str, chrs){
		for(var char of str.split("")){
			if(!chrs.includes(char))
				return false
		}
		return true
	}