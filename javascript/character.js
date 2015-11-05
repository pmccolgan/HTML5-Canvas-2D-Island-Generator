function isIslandCellTypeWalkable(type)
{
		var result = false;
		
		switch (type)
		{
			case ISLAND_CELL_TYPE.DEEP_WATER:
			case ISLAND_CELL_TYPE.TREE:
			case ISLAND_CELL_TYPE.ROCK:
				result = false;
				break;
			case ISLAND_CELL_TYPE.SHALLOW_WATER:
			case ISLAND_CELL_TYPE.SAND:
			case ISLAND_CELL_TYPE.GRASS:
				result = true;
				break;
			default:
				break;
		}
		
		return result;
}

function Character(x, y, colour, island)
{
	var _position = new Vector2f(x, y);
	var _colour = colour;
	var _island = island;
	
	this.getPosition = function ()
	{
		return _position;
	}
	
	this.getColour = function ()
	{
		return _colour;
	}
	
	this.up = function ()
	{
		if (isIslandCellTypeWalkable(_island.getCellType(_position.getX(), _position.getY() - 1)))
		{
			_position.setY(_position.getY() - 1);
		}
	}
	
	this.down = function ()
	{
		if (isIslandCellTypeWalkable(_island.getCellType(_position.getX(), _position.getY() + 1)))
		{
			_position.setY(_position.getY() + 1);
		}
	}
	
	this.left = function ()
	{
		if (isIslandCellTypeWalkable(_island.getCellType(_position.getX() - 1, _position.getY())))
		{
			_position.setX(_position.getX() - 1);
		}
	}
	
	this.right = function ()
	{
		if (isIslandCellTypeWalkable(_island.getCellType(_position.getX() + 1, _position.getY())))
		{
			_position.setX(_position.getX() + 1);
		}
	}
}