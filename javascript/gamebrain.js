
	var MINI_MAP_CANVAS = "miniMapCanvas";
	var MEGA_MAP_CANVAS = "megaMapCanvas";
	var CONTEXT = "2d";
	var MINI_CANVAS_DIMENSION = 200;
	var MINI_CANVAS_WIDTH = 20;
	var MINI_CANVAS_HEIGHT = 20;

	var MEGA_CANVAS_DIMENSION = 200;
	var MEGA_CANVAS_WIDTH = 5;
	var MEGA_CANVAS_HEIGHT = 5;

	var ISLAND_BORDER = 3;

	var UPDATE_INTERVAL_MILLISECONDS = 40

	var renderMini;
	var renderMega;
	var mini_grid;
	var mega_grid;
	var mouseCellColumn = -1;
	var mouseCellRow = -1;
	var character;
	var console;
	var island;
	
		
	function init()
	{
		console = new ConsolePrinter("consoleText", 10);
		console.addLine("Console");
		
		renderMini = new Render(document, MINI_MAP_CANVAS, CONTEXT);
		renderMega = new Render(document, MEGA_MAP_CANVAS, CONTEXT);
		
		mini_grid = new Grid(MINI_CANVAS_WIDTH, MINI_CANVAS_HEIGHT, MINI_CANVAS_DIMENSION);
		mega_grid = new Grid(MEGA_CANVAS_WIDTH, MEGA_CANVAS_HEIGHT, MEGA_CANVAS_DIMENSION);
		
		var canvas = getCanvas(document, MINI_MAP_CANVAS);
		
		console.addLine("Add controls...");
	 
		canvas.addEventListener('mousemove', updateMousePosition, false);
	 
		canvas.addEventListener('mouseover', updateMousePosition, false);
	 
		canvas.addEventListener('mouseout', releaseMousePosition, false);
	 
		canvas.addEventListener('mousedown', changeCell, false);
		
		window.addEventListener('keydown', handleInput, false);
		
		console.addLine("Generate island...");
		
		island = new Island(MINI_CANVAS_WIDTH, MINI_CANVAS_HEIGHT);
		
		console.addLine("Generate character position...");
		
		var x = -1;
		var y = -1;
		
		do
		{
			x = randomInteger(ISLAND_BORDER, (MINI_CANVAS_WIDTH - ISLAND_BORDER) - 1);
			y = randomInteger(ISLAND_BORDER, (MINI_CANVAS_HEIGHT - ISLAND_BORDER) - 1);
			
			if (!isIslandCellTypeWalkable(island.getCellType(x, y)))
			{
				x = -1;
				y = -1;
			}
		}while((x == -1) || (y == -1))
				
		character = new Character(x, y, COLOUR.PINK, island);
		
		console.addLine("Render scene...");
		
		renderScene();
		
		console.addLine("Start timer...");
	
		requestTick();
		
		console.addLine("Init complete!");
	}


	function requestTick()
	{
		setTimeout("update()", UPDATE_INTERVAL_MILLISECONDS);
	}


	function update()
	{
		requestTick();
	}


	function updateMousePosition(event)
	{
		var initialColumn = mouseCellColumn;
		var initialRow = mouseCellRow;
		
		var objectPosition = findPos(this);
		
		var gridPosition = new Point(event.pageX - objectPosition.x, event.pageY - objectPosition.y);

		mouseCellColumn = mini_grid.getColumn(gridPosition.x);
		
		mouseCellRow = mini_grid.getRow(gridPosition.y);
		
		var cell_position = mini_grid.getCellPosition(mouseCellColumn, mouseCellRow);
		
		if ((initialColumn != mouseCellColumn) ||
			(initialRow != mouseCellRow))
		{
			renderMini.drawRectangleOutline(cell_position.x + 0.5, 
										cell_position.y + 0.5, 
										mini_grid.getWidthInterval() - 1, 
										mini_grid.getHeightInterval() - 1, 
										COLOUR.RED);
								
			if ((initialColumn > -1) && 
				(initialRow > -1))
			{
				renderMiniMapCell(initialColumn, initialRow, island.getCellColour(initialColumn, initialRow))
			
				console.addLine("Mouse cell [" + mouseCellColumn + "][" + mouseCellRow + "]");
			}
		}
	}


	function releaseMousePosition(event)
	{
		var initialColumn = mouseCellColumn;
		var initialRow = mouseCellRow;

		mouseCellColumn = -1;
		mouseCellRow = -1;
		
		if ((initialColumn != mouseCellColumn) ||
			(initialRow != mouseCellRow))
		{
			if ((initialColumn > -1) && 
				(initialRow > -1))
			{
				renderMiniMapCell(initialColumn, initialRow, island.getCellColour(initialColumn, initialRow))
			
				console.addLine("No mouse cell");
			}
		}
	}


	function changeCell(event)
	{
		// Stop highlighting text
		event.preventDefault();
	
		if ((mouseCellColumn > -1) && 
			(mouseCellRow > -1))
		{
			var initialType = island.getCellType(mouseCellColumn, mouseCellRow);
			
			var newType = getNextIslandCellType(initialType);
			
			island.setCellType(mouseCellColumn, mouseCellRow, newType);
			
			renderMiniMapCell(mouseCellColumn, mouseCellRow, island.getCellColour(mouseCellColumn, mouseCellRow))
		
			renderMegaMap();
	
			console.addLine("Update cell[" + mouseCellColumn + "][" + mouseCellRow + "] type from " + initialType + " to " + newType);
		}
	}
	
	
	function handleInput(e)
	{
		var code = e.keyCode;
		switch (code) 
		{
			// change arrow keys to WASD so page doesn't scroll
			case 65: //37: 
				//Left A
				character.left();
				renderMegaMap();
				break;
			case 87: //38: 
				//Up W
				character.up();
				renderMegaMap();
				break;
			case 68: //39: 
				//Right D
				character.right();
				renderMegaMap();
				break;
			case 83: //40: 
				//Down S
				character.down();
				renderMegaMap();
				break;
			default: 
				console.addLine("Unhandled key: " + code);
				break;;
		}
	}


	function renderScene()
	{
		renderMiniMap();
		
		renderMegaMap();
	}


	function renderMapCell(Column, Row, Map, Colour)
	{
		var position = Map.getCellPosition(Column, Row);
		
		renderMini.drawRectangle(position.x, 
								 position.y, 
								 Map.getWidthInterval(), 
								 Map.getHeightInterval(), 
								 Colour);
	}


	function renderMiniMapCell(Column, Row, Colour)
	{
		renderMapCell(Column, Row, mini_grid, Colour);
	}


	function renderMegaMapCell(Column, Row, Colour)
	{
		var start_x = character.getPosition().getX() - Math.floor(MEGA_CANVAS_WIDTH/2);
		var start_y = character.getPosition().getY() - Math.floor(MEGA_CANVAS_HEIGHT/2);
		
		if (start_x < 0)
		{
			start_x = 0;
		}
		else if ((start_x + MEGA_CANVAS_WIDTH) >= MINI_CANVAS_WIDTH)
		{
			start_x = (MINI_CANVAS_WIDTH - 1) - MEGA_CANVAS_WIDTH;
		} 
		
		if (start_y < 0)
		{
			start_y = 0;
		}
		else if ((start_y + MEGA_CANVAS_HEIGHT) >= MINI_CANVAS_HEIGHT)
		{
			start_y = (MINI_CANVAS_HEIGHT - 1) - MEGA_CANVAS_HEIGHT;
		} 
			
		renderMapCell(Column, Row, mega_grid, Colour);
	}

	
	function renderMiniMap()
	{
		for (var i = 0; i < MINI_CANVAS_WIDTH; ++i)
		{
			for (var j = 0; j < MINI_CANVAS_HEIGHT; ++j)
			{
				renderMiniMapCell(i, j, island.getCellColour(i, j));
			}
		}
	}


	function renderMegaMap()
	{
		var x = character.getPosition().getX();
		var y = character.getPosition().getY();
	
		if ((x > -1) && 
			(y > -1))
		{
			var start_x = x - Math.floor(MEGA_CANVAS_WIDTH/2);
			var start_y = y - Math.floor(MEGA_CANVAS_HEIGHT/2);
			
			if (start_x < 0)
			{
				start_x = 0;
			}
			else if ((start_x + MEGA_CANVAS_WIDTH) >= MINI_CANVAS_WIDTH)
			{
				start_x = (MINI_CANVAS_WIDTH - 1) - MEGA_CANVAS_WIDTH;
			} 
			
			if (start_y < 0)
			{
				start_y = 0;
			}
			else if ((start_y + MEGA_CANVAS_HEIGHT) >= MINI_CANVAS_HEIGHT)
			{
				start_y = (MINI_CANVAS_HEIGHT - 1) - MEGA_CANVAS_HEIGHT;
			} 
			
			for (var i = 0; i < MEGA_CANVAS_WIDTH; ++i)
			{
				for (var j = 0; j < MEGA_CANVAS_HEIGHT; ++j)
				{
					var position = mega_grid.getCellPosition(i, j);
					
					var colour = island.getCellColour(start_x + i, start_y + j);
					
					if ((x == start_x + i) &&
						(y == start_y + j))
					{
						colour = character.getColour();
					}
					
					renderMega.drawRectangle(position.x, 
											 position.y, 
											 mega_grid.getWidthInterval(), 
											 mega_grid.getHeightInterval(), 
											 colour);				 
				}
			}
		}
		else
		{
			renderMega.drawRectangle(0, 
									 0, 
									 mega_grid.getDimension(), 
									 mega_grid.getDimension(), 
									 COLOUR.WHITE);
		}
	}


	function isInGrid(column, row)
	{
		var result = false;
		
		if (((column >= 0) && (column <= (MINI_CANVAS_WIDTH - 1))) &&
			((row >= 0) && (row <= (MINI_CANVAS_HEIGHT - 1))))
		{
			result = true;
		}
		
		return result;
	}


	function isInBounds(column, row)
	{
		var result = false;
		
		if (((column >= ISLAND_BORDER) && (column <= ((MINI_CANVAS_WIDTH - 1) - ISLAND_BORDER))) &&
			((row >= ISLAND_BORDER) && (row <= ((MINI_CANVAS_HEIGHT - 1) - ISLAND_BORDER))))
		{
			result = true;
		}
		
		return result;
	}