function Island(width, height)
{
	var _width = width;
	var _height = height;

	var _cellArray = new Array(_width);
	
	var height_width = _width + 1;
	var height_height = _height + 1;
		
	for (var i = 0; i < height_width; ++i)
	{
		_cellArray[i] = new Array(height_height);
		
		for (var j = 0; j < height_height; ++j)
		{
			if (((i > ISLAND_BORDER) && (i < (_width) - ISLAND_BORDER)) &&
				((j > ISLAND_BORDER) && (j < (_height) - ISLAND_BORDER)))
			{
				_cellArray[i][j] = randomFloat(0, 1);
			}
			else
			{
				_cellArray[i][j] = 0;
			}
		}
	}
	
	_materialGrid = new Array(_width);
	for (var i = 0; i < _width; ++i)
	{
		_materialGrid[i] = new Array(_height);
		
		for (var j = 0; j < _height; ++j)
		{
			var height_1 = _cellArray[i][j];
			var height_2 = _cellArray[i + 1][j];
			var height_3 = _cellArray[i + 1][j + 1];
			var height_4 = _cellArray[i][j + 1];
			var height = (height_1 + height_2 + height_3 + height_4)/4;
			var gradient = ((height - height_1) + (height - height_2) + (height - height_3) + (height - height_4))/4;
			
			var type = ISLAND_CELL_TYPE.DEEP_WATER;
			
			if (height < 0.2)
			{
				type = ISLAND_CELL_TYPE.DEEP_WATER;
			}
			else if (height < 0.4)
			{
				type = ISLAND_CELL_TYPE.SHALLOW_WATER;
			}
			else if (height < 0.7)
			{
				type = ISLAND_CELL_TYPE.SAND;
			}
			else
			{
				type = ISLAND_CELL_TYPE.ROCK;
			}
			
			_materialGrid[i][j] = new IslandCell(type);
		}
	}
	
	// Add grass
	for (var i = 0; i < _width; ++i)
	{	
		for (var j = 0; j < _height; ++j)
		{
			var cell = _materialGrid[i][j];
			
			// if tile is surrounded by sand or rock
			if ((cell.getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				((i > 0) && (i < (_width - 1))) &&
				((j > 0) && (j < (_height - 1))) &&
				(_materialGrid[i - 1][j - 1].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i][j - 1].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i + 1][j - 1].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i + 1][j].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i + 1][j + 1].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i][j + 1].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i - 1][j + 1].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) &&
				(_materialGrid[i - 1][j].getType() > ISLAND_CELL_TYPE.SHALLOW_WATER) )
			{
				_materialGrid[i][j].setType(ISLAND_CELL_TYPE.GRASS);
			}
		}
	}
	
	// Add trees
	for (var i = 0; i < _width; ++i)
	{	
		for (var j = 0; j < _height; ++j)
		{
			var cell = _materialGrid[i][j];
			
			// if tile is surrounded by grass
			if ((cell.getType() == ISLAND_CELL_TYPE.GRASS) &&
				((i > 0) && (i < (_width - 1))) &&
				((j > 0) && (j < (_height - 1))) &&
				(_materialGrid[i - 1][j - 1].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i][j - 1].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i + 1][j - 1].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i + 1][j].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i + 1][j + 1].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i][j + 1].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i - 1][j + 1].getType() == ISLAND_CELL_TYPE.GRASS) &&
				(_materialGrid[i - 1][j].getType() == ISLAND_CELL_TYPE.GRASS) &&
				randomBool())
			{
				_materialGrid[i][j].setType(ISLAND_CELL_TYPE.TREE);
			}
		}
	}
	
	this.getCell = function (column, row)
	{
		if (row < 0)
		{
			row = 0;
		}
		
		if (row >= _height)
		{
			row = _height - 1;
		}
		
		if (column < 0)
		{
			column = 0;
		}
		
		if (column >= width)
		{
			column = _width - 1;
		}
		
		return _materialGrid[column][row];
	}
	
	this.getCellType = function (column, row)
	{	
		return this.getCell(column, row).getType();
	}
	
	this.setCellType = function (column, row, type)
	{	
		return this.getCell(column, row).setType(type);
	}
	
	this.getCellColour = function (column, row)
	{	
		return this.getCell(column, row).getColour();
	}
}