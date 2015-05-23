
/*******************************************************************************************************
	Controller: game
*******************************************************************************************************/
app.controller('gameController', function ($scope, $rootScope, gameFactory) {
	
	
	
	function init() {
		$rootScope.playerGold = 0;
		$rootScope.playerLog = {
				timePlayed: 0,
				goldCollected: 0,
				mobsKilled: 0,
				mobTypesKilled: [],
				mobNameKilled: []
		};
		
		setTimeout(function(){ $scope.gameReady(); }, 100);
	}
	
	
	function CheckScopeBeforeApply() {
		if(!$scope.$$phase) {
			 $scope.$apply();
		}
		else {
				setTimeout(function(){ CheckScopeBeforeApply(); }, 5);
		}
	};
	
	
	// **************** On game start ******************** 
	$rootScope.$on('startGame', function() {
		console.log('startGame');
	});
	
	/*************************************************************/
	
	$scope.gameReady = function() {
		$rootScope.$broadcast('startGame');
		CheckScopeBeforeApply();
	}
	
	init();
	
});


/*******************************************************************************************************
	Controller: mobs
*******************************************************************************************************/
app.controller('mobsController', function ($scope,$rootScope, mobsFactory) {
	
	init();
	
	var groundYPos = -2;
	
	function init() {
		$scope.mobTypes = [];
		$scope.mobsOnBoard = [];
		$scope.displayBoard = [];
	}
	
	// **************** On start of game ******************** 
	$rootScope.$on('startGame', function() {
		
		$scope.mobTypes = mobsFactory.getMobTypes();
		$scope.mobsOnBoard = mobsFactory.getMobsBoard();
		$scope.displayBoard = $scope.mobsOnBoard;
	});
	
	// **************** On updateMobsBoard ******************** 
	$rootScope.$on('updateMobsBoard', function() {
		$scope.mobsOnBoard = mobsFactory.getMobsBoard();
	});
	
	// **************** On newRow ******************** 
	$rootScope.$on('newRow', function() {
		
		// hide mob label
		$('.mob-label').removeClass('show');
		
		// create "move row down" effect by adding "moving" class and remove
		$('.mob-row').addClass('moving');
		setTimeout(function(){ 
			$('.mob-row').removeClass('moving');
			
			// get first mob
			var firstMob = $scope.mobsOnBoard[0][0];
			
			// update and show mob label
			$('.mob-label').html( firstMob.name ).addClass('show');
		}, 100);
		
		// move the ground by moving the background pos
		// this is bad, find a better way!
		groundYPos++;
		if ( groundYPos > 0 ) {
			$( ".mob-ground" ).css('background-position','0 '+(75*groundYPos)+'px'	);
		}
		
	});
	
	
	$rootScope.damageMob = function(boardPos,damage, weapon) {
		var thisMob = $scope.mobsOnBoard[boardPos[0]][boardPos[1]];
		
		// add hit effect
		thisMob.elemClass = "hit";
		
		var hitLabelElem = $('<div />')
			.addClass('hit-label')
			.addClass('class-text-'+weapon.hero)
			.html(damage+'hp')
			.appendTo( '#mob-'+thisMob.mobId )
			.animate({
				top: 0,
			}, 800,'linear');
		
		
		setTimeout(function(){ 
			thisMob.elemClass = "normal";
			hitLabelElem.remove();
			$scope.$apply(); 
		}, 800);
		
		// damage mob
		thisMob.hp -= damage;
		
		// is mob killed
		if (  thisMob.hp < 1 ) {
			// hp to zero
			thisMob.hp = 0;
			hitLabelElem.remove();
			
			// add log - mobsKilled
			$rootScope.playerLog.mobsKilled++; 
			
			// add log - mobTypesKilled
			if ( !(thisMob.types in $rootScope.playerLog.mobTypesKilled) ) {
				$rootScope.playerLog.mobTypesKilled[thisMob.types] = 0;
			}
			$rootScope.playerLog.mobTypesKilled[thisMob.types]++;
			
			// add log - mobNameKilled
			if ( !(thisMob.name in $rootScope.playerLog.mobNameKilled) ) {
				$rootScope.playerLog.mobNameKilled[thisMob.name] = 0;
			}
			$rootScope.playerLog.mobNameKilled[thisMob.name]++;
			
			
			// gold!
			var goldDrop = thisMob.maxHp + thisMob.bonusGold;
			$rootScope.playerGold += goldDrop;
			$rootScope.playerLog.goldCollected += goldDrop; // add log
			
			// create death-holder, to hold visuals for mob after it has beeen removed
			var deadMobElemPos = $('#mob-'+thisMob.mobId).position();
			var deathHolderElem = $('<div />')
				.addClass('death-holder')
				.addClass('vpos-'+boardPos[0])
				.css('left', deadMobElemPos.left)
				.appendTo( $('.mob-panel') );
			
			// move hit label to death holder
			hitLabelElem.appendTo(deathHolderElem);
			
			// add coin drop label
			var coinDropLabelElem = $('<div />')
				.addClass('coindrop-label')
				.html(goldDrop)
				.appendTo( deathHolderElem )
				.animate({
					top: 0
				}, 1500,'linear');
			
			// remove death holder
			setTimeout(function(){ 
				deathHolderElem.remove();
			}, 1500);
			
			// remove mob from the board
			$scope.mobsOnBoard = mobsFactory.killMob( boardPos[0], boardPos[1] );
		}
		
		$scope.$apply();
	}
	
	
	// get mob life in %
	$scope.lifeInPer = function(hp,maxHp) {
		return Math.round( ( hp / maxHp ) * 100 );
	}
	
});


/*******************************************************************************************************
	Controller: heros
*******************************************************************************************************/
app.controller('herosController', function ($scope,$rootScope, herosFactory) {
	
	init();
	
	function init() {
		$scope.heros = [];
		$scope.activeHeroKey = 0;
		$scope.selectedItem = null;
	}
	
	
	// **************** On start of game ******************** 
	$rootScope.$on('startGame', function() {
		$scope.heros = herosFactory.getHeros();
		updateCooldowns();
	});
	
	
	// for width of weapon cool down bar
	$scope.coolDownPer = function(coolDownLeft,coolDownTotal) {
		var per = Math.round( ( coolDownLeft / coolDownTotal ) * 100 );
		return 100 - per;
	}
	
	
	$scope.selectThisHero = function(thisActiveHeroKey) {
			if ( thisActiveHeroKey != $scope.activeHeroKey ) {
					$scope.activeHeroKey = thisActiveHeroKey;
					$scope.selectedItem = null;
			}
	}
	

	$scope.isWeaponEquipped = function(activeHeroKey,itemId) {
			var isEquipped = false;
			
			$.each($scope.heros[activeHeroKey].weapons , function() {
				if ( this.id == itemId )  {
					isEquipped = true;
					return true;
				}
			});

		return isEquipped;
	}
	
	$scope.selectThisItem = function(itemObj,inventoryKey) {
			if  ( $scope.selectedItem != null && itemObj.name == $scope.selectedItem.name ) {
				$scope.selectedItem = null;
			}
			else {
				$scope.selectedItem = itemObj;
				$scope.selectedItem.inventoryKey = inventoryKey;
			}
	}
	
	$scope.addWeaponToSlot = function(thisHeroKey,slot) {
		if ( $scope.selectedItem != null && thisHeroKey == $scope.activeHeroKey  ) {
				herosFactory.equipWeapon(thisHeroKey,slot,$scope.selectedItem.inventoryKey);
				$scope.selectedItem = null;
		}
	}
	
	
	// update hero attack cool downs
	function updateCooldowns() {
		var coolDownTimoout = setTimeout(function(){ 

			for ( h=0; h<$scope.heros.length; h++ ) {
				for ( w=0; w<2; w++ ) {
					if ( $scope.heros[h].coolDowns[w] > -1 ) {
						
						// count down
						$scope.heros[h].coolDowns[w]--;
						
						// update page
						$scope.$apply();
						
						// if coolDown = 0
						if ( $scope.heros[h].coolDowns[w] == 0 ) {
							
							// attack with weapon
							herosFactory.weaponAttack(h,$scope.heros[h].weapons[w]);
							
							// show attack
							var thisHeroElem = $('.hero.hero-box-'+$scope.heros[h].id);
							thisHeroElem.addClass('attacking');
							setTimeout(function(){ $('.hero').removeClass('attacking'); }, 500);
							
							// reset timeout
							$scope.heros[h].coolDowns[w] = $scope.heros[h].weapons[w].coolDown;
						}
						
					}
				}
			}
			
			// loop
			updateCooldowns();
			
		}, 100);
		
		
	}
	
});

