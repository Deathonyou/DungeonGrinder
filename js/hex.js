S(document).ready(function(){

	// Create an object attached to a DOM element with the ID "hexmap-1"
	var hexmap = S.hexmap('hexmap-1');

	// Position the hexes and scale them to the container
	hexmap.positionHexes().resize();

});