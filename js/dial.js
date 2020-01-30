//Vrteča stvar za odklepanje sefa
class dial {
	
	constructor(size, x, y){
		this.radius = size;
		this.rotation = 0; // 0-2*PI
		
		this.numRanges = {}; //... why?
		
		this.x = x;
		this.y = y;
		
		//Št na dial-u
		this.currentNum = 0;
		
		//Trenutna pozicija miške
		this.mouse = {
			sRot: 0, //Rotation at the point of a click - da je rotacija potem relativna na prejšnjo in se ne resetira na 0
			down: false,
			
			downPoint: {
				x: 0,
				y: 0,
			},
			
			x: 0,
			y: 0,
		};
		
		this.sensitivity = 1; //Rotacijska hjitrost manjše = hitrejše (defau1t 1: 1 to 1)
        this.direction = 0; //Current direction (0, 1 - left, right)
		
		this.addEvents();
	};
	
	
	//Posodobi velikost in pozicijo
	updatePos(size, x, y){
		this.radius = size;
		this.x = x;
		this.y = y;
	};
	
	
	rotate(rad){
		
		this.direction = this.rotation > rad ? 1 : 0;
		this.rotation = rad; //Radians

	};
	
	
	//Nariši
	draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.x, -this.y);

    
		ctx.beginPath();
		
		//Krog
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.strokeStyle = "rgba(220, 220, 220, 1)";
		
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		
		
		//Številke
		let fontSize = this.radius / 12;
		ctx.font = fontSize  + 'px verdana';
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        
		let n = 0;
		let bestDist = 9999;
		let bestNum = -1;
        
        //Nariši vse - 90°
		for(let i = -Math.PI/2; i < 2*Math.PI - Math.PI/2; i += (2*Math.PI)/100){
			
			let pos = this.rotatePoint(this.x, this.y, this.x, this.y - this.radius/2, this.rotation + i + Math.PI/2);
			let dist = this.dist(this.x, this.y - this.radius/2, pos[0], pos[1]);
			
			if(dist < bestDist){
				bestDist = dist;
				bestNum = n;
			};
			
			//Yes...
			this.numRanges[n] = i + Math.PI;
			
			let xPos = Math.cos(i) * (this.radius*0.9);
			let yPos = Math.sin(i) * (this.radius*0.9);
            
            let xPos2 = Math.cos(i) * (this.radius*0.78);
			let yPos2 = Math.sin(i) * (this.radius*0.78);
            
            let tWidth = ctx.measureText(n);
			
			//Velike številke
			if(n % 10 == 0){
				ctx.fillText(n, this.x + xPos2 - tWidth.width/2, this.y + yPos2+fontSize/2);
			};
            
			
			//Pikice
            let isFifth = n % 5 == 0;
            
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.arc(this.x + xPos, this.y + yPos, isFifth ? 2: 1, 0, 2*Math.PI);
            ctx.fill();
			
			n++;
		};
        
        ctx.restore();
		
		//Indikator
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 0, 0, 1)";
		ctx.moveTo(this.x, this.y - this.radius + this.radius/30);
		ctx.lineTo(this.x - this.radius/30, this.y - this.radius - this.radius/20 + this.radius/30);
		ctx.lineTo(this.x + this.radius/30, this.y - this.radius - this.radius/20 + this.radius/30);
		ctx.fill();
		
		this.currentNum = bestNum;
	};
	
	
	findClosestNum(){

	};
	
	
	dist(ax, ay, bx, by){
		return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2))
	};
	
	
	//Miška na dial-u?
	inDialRange(x, y){
		return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) < this.radius;
	};
	
	
	//Kot med 2. točkama
	angle(cx, cy, ex, ey) {
        let dy = ey - cy;
        let dx = ex - cx;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        return theta;
    };
	
	
	rotatePoint(cx, cy, x, y, radians) {
        let cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    };
	
	
	//Linear interpolation
	interpolate(start, end, amt){
        return (1-amt)*start+amt*end
    };
	
	
	
	//Overwritten v main.js
	mouseReleased(){};
	
	
	
	//Mouse events
	addEvents(){
		
		//Movement
		document.addEventListener("mousemove", ev => {
			this.mouse.x = ev.clientX;
			this.mouse.y = ev.clientY;
			
			//Začetna in dst poticija sta na dial-u, rotate!
			if(this.mouse.down && this.inDialRange(this.mouse.x, this.mouse.y) && this.inDialRange(this.mouse.downPoint.x, this.mouse.downPoint.y)){
				let startAng = this.angle(this.x, this.y,/* this.x, this.y - this.radius/2*/this.mouse.downPoint.x, this.mouse.downPoint.y);
				let dstAng = this.angle(this.x, this.y, this.mouse.x, this.mouse.y);
				
				let finalAng = dstAng - startAng;
				
				this.rotate(finalAng/this.sensitivity + this.mouse.sRot);
			};
		});
		
		//Press
		document.addEventListener("mousedown", ev => {
			this.mouse.sRot = this.rotation;
			this.mouse.down = true;
			this.mouse.downPoint.x = ev.clientX;
			this.mouse.downPoint.y = ev.clientY;
		});
		
		//Release
		document.addEventListener("mouseup", ev => {
			this.mouse.down = false;
			
			if(this.inDialRange(this.mouse.x, this.mouse.y)){
			    this.mouseReleased();
			};
		});
	};
	
	
};