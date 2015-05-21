
app.factory('mobsFactory', function($rootScope) {
	
	var factory = {};
	
	var mobTypes = [];
	var mobsOnBoard = [ [], [], [] ];
	var mobCount = 0;
	
	/***************************************************************************
		function - getMobTypes
	***************************************************************************/
	factory.getMobTypes = function() {
		mobTypes = [
			{
				typeId: 'briske',
				name: 'Brittle Skeleton',
				level: 1,
				maxHp: 10,
				bonusGold: 0,
				types: 'undead',
				sprite: 'Skeleton1',
				rowMin: 4,
				rowMax: 5
			},
			{
				typeId: 'anggob',
				name: 'Angry Goblin',
				level: 1,
				maxHp: 15,
				bonusGold: 0,
				types: 'greenskin',
				sprite: 'Goblin1',
				rowMin: 3,
				rowMax: 4
			},
			{
				typeId: 'fliimp',
				name: 'Flint Imp',
				level: 1,
				maxHp: 12,
				bonusGold: 0,
				types: 'demon',
				sprite: 'imp1',
				rowMin: 3,
				rowMax: 5
			},
			{
				typeId: 'cyclops',
				name: 'Cyclops',
				level: 1,
				maxHp: 30,
				bonusGold: 0,
				types: 'gaint',
				sprite: 'cyclops1',
				rowMin: 1,
				rowMax: 2
			}
		];
		
		return mobTypes;
	}
	
	
	/***************************************************************************
		function - getMobBoard
	***************************************************************************/
	factory.getMobsBoard = function() {
		
		function moveRow(old_index, new_index) {
			if (new_index >= this.length) {
				var k = new_index - this.length;
				while ((k--) + 1) {
					this.push(undefined);
				}
			}
			this.splice(new_index, 0, this.splice(old_index, 1)[0]);
			return this; // for testing purposes
		}
		
		var lastRow = (mobsOnBoard.length-1);
		for (var n=lastRow;n >= 0;n--) {
			
			if ( mobsOnBoard[n].length == 0 ) {
				
				
				
				if ( n == lastRow ) {
					// spawn new mobs on last row
					mobsOnBoard[n] = factory.getMobRow();
				}
				else {
					// if non-last row is empty then copy from above
					mobsOnBoard.move(n+1,n);
					
					// reset loop
					n=(lastRow+1);
					continue;
				}
				
				$rootScope.$broadcast('newRow');
			
			}
			
		}
		
		return mobsOnBoard;
	}
	
	
	/***************************************************************************
		function - getMobRow
	***************************************************************************/
	factory.getMobRow = function() {
		var row = [ ];
		var mobKey = Math.floor(Math.random() * mobTypes.length); 
		var selectedMobType = mobTypes[mobKey];
		var rowLength = randomIntFromInterval(selectedMobType.rowMin,selectedMobType.rowMax);
		
		
		// loop to create mob row
		for ( i=0; i<rowLength; i++ ) {
			mobCount++;
			
			// create mob for row
			row[i] = { }
			row[i].name = selectedMobType.name;
			row[i].types = selectedMobType.types;
			row[i].mobId = mobCount;
			row[i].maxHp = selectedMobType.maxHp;
			row[i].bonusGold = selectedMobType.bonusGold;
			row[i].hp = selectedMobType.maxHp;
			row[i].elemClass = 'normal';
			row[i].sprite = selectedMobType.sprite;
			row[i].mobId = mobCount;
		}

		return row;
	}
	
	
	/***************************************************************************
		function - killMob
	***************************************************************************/
	factory.killMob = function(row,col) {
		var boardRow = mobsOnBoard[row];
		
		boardRow.splice( col ,1 );
		
		return factory.getMobsBoard();
	}
	
	/***************************************************************************
		function - selectMobFromLeft
	***************************************************************************/
	factory.getMobFromId = function(mobId) {
		for ( r=0; r < mobsOnBoard.length; r++ ) {
			for ( c=0; c < mobsOnBoard[r].length; c++ ) {
				if (  mobsOnBoard[r][c].mobId == mobId ) {
					return [ r,c ]
				}
			}
		}
	}
	
	
	/********************************** Targeting functions ***************************/
	
	
	/***************************************************************************
		function - targeting - selectMobFromLeft
	***************************************************************************/
	factory.selectMobFromLeft = function(nFromLeft,row) {
		var row = mobsOnBoard[row];
		
		var mobKey = nFromLeft;
		if ( mobKey > row.length ) { mobKey = row.length; }
		if ( mobKey < 1 ) { mobKey = 1; }
		mobKey--;

		return row[mobKey];
	}
	
	/***************************************************************************
		function - targeting - selectRandomInRow
	***************************************************************************/
	factory.selectRandomInRow = function(row) {
		var row = mobsOnBoard[row];
		var mobKey = Math.floor(Math.random() * row.length);
		
		return row[mobKey];
	}
	
	
	/***************************************************************************
		function - targeting - selectNeighbours
	***************************************************************************/
	factory.selectNeighbours = function(mainMobObj) {
		var pos = factory.getMobFromId(mainMobObj.mobId);
		var row = mobsOnBoard[pos[0]];
		var mainCol = pos[1];
		
		// left mob
		var left = row[mainCol-1];
		if ( typeof left === 'undefined' ) {
			left = false;
		}
		
		// right mob
		var right = row[mainCol+1];
		if ( typeof right === 'undefined' ) {
			right = false;
		}
		
		var selectedMobs = {
			left: left,
			right: right
		};
		
		return selectedMobs;
	}
	
	
	return factory;
});