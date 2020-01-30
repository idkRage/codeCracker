//Ja... 

class textRenderer {
	constructor(id){
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext("2d");
		
		this.text = [];
	};
	
	
	addText(pos, text, color, speed, size){
		this.text.push({
			text, color,
			time: Date.now(),
			pos,
			speed,
			size,
		});
	};
	
	
	render(){
//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		let newText = []; //Izloči stari text
		
		for(let i = 0; i < this.text.length; i++){
			let txt = this.text[i];
		    let txtAge = Date.now() - txt.time;
			
			if(txtAge < 1000){
				newText.push(txt);
			} else {
				continue;
			};
			
			//this.ctx.fillStyle = txt.color;
			this.ctx.font = txt.size + "px Ubuntu";
			
            let fs = "rgba(" + txt.color.substr(4, txt.color.length-5) + ", " + (1 - txtAge / 1000)+ ")";
			this.ctx.fillStyle = fs;
			
			
			
			let txtWidth = this.ctx.measureText(txt.text);
			this.ctx.fillText(txt.text, txt.pos.x - txtWidth.width/2, txt.pos.y - txtAge/txt.speed);
		};
		
		this.text = newText;
		
	};
	
};