class Notify {
	static instruct(message) {
		console.log(message);
		game.instruct = game.make.text(80, game.world.height-200, message,  { font: "22px Arial black", fill: "#9e5c1d" });
		game.groundGroup.add(game.instruct);
		
		//setTimeout(function() {
		//	game.instruct.text = "";
		//}, 2500);
	}

	static log(message, mArray) {
		console.log(message);
		// game.notify = game.make.text(game.world.width/2, game.world.height - 30, message,  { font: "18px Arial", fill: "#fff" });
		// game.textGroup.add(game.notify);
		
		// setTimeout(function() {
		// 	game.notify.text = "";
		// }, 1500);
	}
}