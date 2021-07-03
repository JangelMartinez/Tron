// Clase Game: es la clase donde se verifica todas las pautas del juego 
// tiene las funciones de movimiento, choque, dibujar, inicio, reset, etc..

class Game{
	constructor(width=800, height=600){
			
		// Configuración ancho y alto de tablero
			this.anchoTablero = width;
			this.altoTablero = height;

		// Declaración de canvas
			this.canvas = document.getElementById('tron');
			this.ctx = this.canvas.getContext('2d');

		// Iniciar variables de los jugadores
			
			this.iniciar();

		// Declaro el audio y el botón para iniciar el juego
			this.audio = document.querySelector('audio');
			const button = document.getElementById('iniciar');

		// Creo un listener para el botón. 
		// Ejecuto función reset
		// Declaro variable setInterval para ejecutar la función render()
		// Pongo en play el audio
			button.addEventListener('click',()=>{
				this.reset();
				this.TimeId = setInterval(()=>{
					this.render();
				
				}, 50);
				
				this.audio.play();
			})
	}

	
	// La función iniciar() reinicializa los jugadores a la posición inicial
	iniciar(){

		this.playerA = {
			name: 'azul',
			gps: { x: 390, y: 290 },
			direction: 'top',
			color: '0,0,255,255',
			size: 5,
			velocidad: 5
		};

		this.playerB = {
			name: 'roja',
			gps: { x: 410, y: 310 },
			direction: 'down',
			color: '255,0,0,255',
			size: 5,
			velocidad: 5
		};
			
	}

	// La función reset() borra el canvas y llama a iniciar()
	reset(){
		this.ctx.clearRect(0,0,this.anchoTablero,this.altoTablero);
		this.iniciar();

	}

	// La función render() lanza las funciones que ejecutan el juego 
	render(){
		
		this.pintar_moto(this.playerB);
		this.pintar_moto(this.playerA);
		this.next_step(this.playerA);
		this.next_step(this.playerB);
		this.check_crash(this.playerA);
		this.check_crash(this.playerB);
	}

	// La función next_step() cambia la coordenada según la tecla / dirección que pulses
	// Le suma o resta a la coordenada la velocidad
	// Tiene como parámetro al jugador para modificar los valores de ese jugador en concreto
	next_step(moto){

		
		if(moto.direction=="top"){
			moto.gps.y -= moto.velocidad;
		}
		if(moto.direction=="down"){
			moto.gps.y += moto.velocidad;
		}
		if(moto.direction == "left"){
			moto.gps.x -= moto.velocidad;
		}
		if(moto.direction == "right"){
			moto.gps.x += moto.velocidad;
		}

	}

	// La función check_crash() es la encargada de revisar si los jugadores chocan entre si o con las paredes
	// Recibe el parámetro de jugador para verificar cual de ellos ha chocado
	check_crash(moto){

		// Llamamos a la función getpixel()

		this.color = this.getpixel(moto);

		// Según si es el color de color del pixel es distinto a negro o si llega a las coordenadas
		// que tiene el tablero la moto choca

		if(this.color != '0,0,0,0' || 
			moto.gps.x == 0 || 
			moto.gps.y == 0 || 
			moto.gps.x == this.anchoTablero || 
			moto.gps.y == this.altoTablero){

				// Introduzco el mensaje del perdedor en un parrafo con id message del HTML
				document.getElementById("message").textContent = "La moto " + moto.name + " se ha chocado";
				
				// Termino la función setInterval para que termine la función render()
				clearInterval(this.TimeId);

				// Pauso el audio ya que ha terminado el juego
				this.audio.pause();
			
		}

	}

	// La función getpixel() verifica el pixel que tiene delante según la dirección que tiene el jugador
	// Recibe el parámetro del jugador para verificar el pixel correspondiente de este
	// Devuelve el parámetro color_pixel para verificarlo dentro de la función check_crash()
	getpixel(moto){

		if(moto.direction=="top"){
			this.color_pixel = this.ctx.getImageData(
				moto.gps.x + 2,
				moto.gps.y,
				1,
				1).data;
		}
		if(moto.direction=="down"){
			this.color_pixel = this.ctx.getImageData(
				moto.gps.x + 2,
				moto.gps.y + 5,
				1,
				1).data;
		}
		if(moto.direction == "left"){
			this.color_pixel = this.ctx.getImageData(
				moto.gps.x,
				moto.gps.y + 2,
				1,
				1).data;
		}
		if(moto.direction == "right"){
			this.color_pixel = this.ctx.getImageData(
				moto.gps.x + 5,
				moto.gps.y + 2,
				1,
				1).data;
		}

		return this.color_pixel;
		
	
	}


	// La función pintar_moto() pinta en el canvas por donde pasa el jugador
	// Recibe el parámetro del jugador para pintar el color correspondiente de cada jugador
	pintar_moto(moto){

		this.ctx.fillStyle ='rgba('+ moto.color +')';
		this.ctx.fillRect (moto.gps.x, moto.gps.y, moto.size, moto.size)
		
	}


}

// Clase Input: según las teclas, toma una dirección u otra

class Input{
	constructor(){

		document.addEventListener("keydown", event => {
			this.keydown(event.code);
		});

	}

	keydown(key){

		// Player 1 (A,W,S, D)
			if(key == "KeyA"){ game.playerA.direction = "left"; }
			if(key == "KeyW"){ game.playerA.direction = "top"; }
			if(key == "KeyS"){ game.playerA.direction = "down"; }
			if(key == "KeyD"){ game.playerA.direction = "right"; }

		// Player 2 (A,W,S, D)
			if(key == "ArrowLeft"){ game.playerB.direction = "left"; }
			if(key == "ArrowUp"){ game.playerB.direction = "top"; }
			if(key == "ArrowDown"){ game.playerB.direction = "down"; }
			if(key == "ArrowRight"){ game.playerB.direction = "right"; }

		//console.log(game.playerA.direction);
	}
}

// Se ejecuta el código una vez que se carga la página web
// Se inicia las clases Game e Input

window.onload = function (){
	game = new Game();
	input = new Input();
	
}