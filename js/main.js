//(function(){ // ;P


class safe {
	
	constructor(){
		this.canvas = document.getElementById("c");
		this.ctx = this.canvas.getContext("2d");
		this.textDisplay = new textRenderer("c"); //Lebdeči text
		this.dialObj = null;
		this.combinations = []; //Dobi value on init
		
		this.locked = true;
		this.step = 0; // 0 - 3
		
		this.resetStatus = 0;
		
		this.resetInter = null;
	};
	
	
	//Nariši vse
	draw(){
		
		//Safe box
		this.ctx.fillStyle = "rgba(51, 51, 51, 1)";
		
		let boxW = innerWidth/2;
		let boxH = boxW/1.3;
		this.ctx.fillRect(innerWidth/2 - boxW/2, innerHeight/2 - boxH/2, boxW, boxH);
		
		
		//Gap
		this.ctx.strokeStyle = "rgba(40, 40, 40, 1)";
		this.ctx.lineWidth = 5;
		let w2 = boxW * 0.9;
		let h2 = boxH * 0.9;
		
		this.ctx.beginPath();
		this.ctx.moveTo(innerWidth/2 - w2/2, innerHeight/2 - h2/2);
		this.ctx.lineTo(innerWidth/2 + w2/2, innerHeight/2 - h2/2);
		this.ctx.lineTo(innerWidth/2 + w2/2, innerHeight/2 + h2/2);
		this.ctx.lineTo(innerWidth/2 - w2/2, innerHeight/2 + h2/2);
		this.ctx.lineTo(innerWidth/2 - w2/2, innerHeight/2 - h2/2);
		this.ctx.stroke();
		
		
		
		//Status box
		this.ctx.fillStyle = "rgba(111, 111, 111, 1)";
		let sBoxW = innerWidth/8;
		let sBoxH = sBoxW*1.3;
		
		this.ctx.fillRect(innerWidth/2 + w2/2 - sBoxW*1.1, innerHeight/2 - sBoxH/2, sBoxW, sBoxH);
        
		//Reset bottom box
		this.ctx.fillRect(innerWidth/2 + w2/2 - (sBoxW*0.9), innerHeight/2 + sBoxH/2-1, sBoxW*0.6, sBoxH/9);
		
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		this.ctx.fillRect(innerWidth/2 + w2/2 - (sBoxW*0.87), innerHeight/2 + sBoxH/2, sBoxW*0.54, sBoxH/12)
		
		
		//Dial še ne obstaja
		if(!this.dialObj){
			this.dialObj = new dial(innerWidth/20, innerWidth/2 + w2/2 - sBoxW*1.1 + sBoxW/2, innerHeight/2 - sBoxH/8);
			this.addDialEvents();
		} else {
			this.dialObj.updatePos(innerWidth/20, innerWidth/2 + w2/2 - sBoxW*1.1 + sBoxW/2, innerHeight/2 - sBoxH/8); //Če se je window resizal
		};
		
		this.ctx.lineWidth = 1;
		this.dialObj.draw(this.ctx);
		
		//Current number
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		this.ctx.fillRect(this.dialObj.x - (this.dialObj.radius/3)/2, this.dialObj.y + this.dialObj.radius, this.dialObj.radius/3, (this.dialObj.radius/3)*0.9)
		
		this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
		this.ctx.font = this.dialObj.radius/5 + "px Verdana";
		let tWidth = this.ctx.measureText(this.dialObj.currentNum);
		this.ctx.fillText(this.dialObj.currentNum, this.dialObj.x - tWidth.width/2, this.dialObj.y + this.dialObj.radius*1.2);
		
		
		
		//Status text
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		this.ctx.fillRect(this.dialObj.x - this.dialObj.radius, this.dialObj.y + this.dialObj.radius*1.4, this.dialObj.radius*2, this.dialObj.radius/2)
		
	    this.ctx.font = this.dialObj.radius/3 + "px Verdana";
		this.ctx.fillStyle = this.locked ? "rgba(255, 0, 0, 1)" : "rgba(0, 255, 0, 1)";
		let sTxt = this.locked ? "Zaklenjeno" : "Odklenjeno";
		let sTxtSize = this.ctx.measureText(sTxt);
		
		this.ctx.fillText(sTxt, this.dialObj.x - sTxtSize.width/2, this.dialObj.y + this.dialObj.radius*1.8);
		
		//Odklenjeno - vrti XD
		if(!this.locked){
			this.dialObj.rotation += Math.PI/100;
		};
		
		
		
		//Reset text
		if(this.resetStatus){
			this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
			this.ctx.font = this.dialObj.radius/5 + "px Verdana";
			let tw = this.ctx.measureText("Reset");
			
			this.ctx.fillText("Reset", innerWidth/2 + w2/2 - (sBoxW*0.6) - tw.width/2, innerHeight/2 + sBoxH/2 + this.dialObj.radius/5);
		};
		
		
		this.textDisplay.render();
		
		window.requestAnimationFrame(this.draw.bind(this));
	};
	
	
	
	isInRange(v, range){
	    return (v <= numberToGuess + range && v >= numberToGuess - range);
    };
	
	
	displayText(pos, val, color, size){ //Position: element or object ({x:int, y:int})
	    this.textDisplay.addText(pos, val, color, 30, size);
    };
	
	
	rndInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
	
	
    //Resize
    resize(){
	    this.canvas.width = window.innerWidth;
	    this.canvas.height = window.innerHeight;
    };
	
	
	
    flashReset(){
		let i = 0;
		
		clearInterval(this.resetInter);
		
		this.resetStatus = 0;
		
		this.resetInter = setInterval(function(){
			
			if(i <= 5){
				this.resetStatus = !this.resetStatus;
			} else {
				clearInterval(this.resetInter);
			};
			
			i++;
			
		}.bind(this), 300);
	};
	
	
	
	//Resetiral dial
	resetDial(){
		
		let inter = setInterval(function(){
		
		if(this.dialObj.currentNum != 0){
			this.dialObj.rotation = this.dialObj.interpolate(this.dialObj.rotation, 0, 0.1);
		}else {
			clearInterval(inter);
		}
		
		}.bind(this), 10);
		
	};
	
	
	//Poskus..? You tried atleast
	takeGuess(num){
		
		//Preveč
		if(num > this.combinations[this.step]){
			this.displayText({
				x: this.dialObj.x,
				y: this.dialObj.y - this.dialObj.radius
			},
			"Preveč", "rgb(255, 0, 0)", 20);
			
			//Spet na prvo stopnjo
		    this.step = 0;
			
			this.flashReset();
			
			this.resetDial();
		};
		
		
		//Premalo
		if(num < this.combinations[this.step]){
			this.displayText({
				x: this.dialObj.x,
				y: this.dialObj.y - this.dialObj.radius
			},
			"Premalo", "rgb(255, 0, 0)", 20);
			
			//Spet na prvo stopnjo
		    this.step = 0;
			
			this.flashReset();
			
			this.resetDial();
		};
		
		//Točno
		if(num == this.combinations[this.step]){
			this.displayText({
				x: this.dialObj.x,
				y: this.dialObj.y - this.dialObj.radius
			},
			"Zadetek", "rgb(0, 255, 0)", 20);
	
			//Naslednja stopnja
			this.step++;
			
			if(this.step == 3){
				this.locked = false;
			} else {
				this.resetDial();
			};
		};
		
	};
	
	
	
	addDialEvents(){
		
		//Končal se je poskus za vrtenje
		this.dialObj.mouseReleased = function(){
			
			//Prva smer
			if(this.step == 0){
				
				if(this.dialObj.direction == 1){
					this.takeGuess(this.dialObj.currentNum);
				};
				
			};
			
			//Drugi guess
			if(this.step == 1){
				
				if(this.dialObj.direction == 0){
					this.takeGuess(this.dialObj.currentNum);
				};
				
			};
			
			
			//Tretji guess
			if(this.step == 2){
				
				if(this.dialObj.direction == 1){
					this.takeGuess(this.dialObj.currentNum);
				};
				
			};
			
		}.bind(this);
	};
	
	
	addEvents(){
		window.onresize = this.resize.bind(this);
        this.resize();
	};
	
	
	//1st call
	init(){
        this.addEvents();
		
		this.combinations = [this.rndInt(0, 99), this.rndInt(0, 99), this.rndInt(0, 99)];
		console.log(this.combinations);
		
		window.requestAnimationFrame(this.draw.bind(this));
	};
};


let a = new safe();
a.init();