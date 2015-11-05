var ISLAND_CELL_TYPE = { DEEP_WATER:0,
						 SHALLOW_WATER:1,
						 SAND:2,
					     GRASS:3,
					     TREE:4,
					     ROCK:5};

var ISLAND_CELL_TYPE_COLOUR = { DEEP_WATER:"#004DFF",
								SHALLOW_WATER:"#00CCFF",
								SAND:"#FFFF99",
								GRASS:"#66CC00",
								TREE:"#339900",
								ROCK:"#C2C2C2"};

								
function randomIslandCellType()
{
	return randomInteger(ISLAND_CELL_TYPE.DEEP_WATER, ISLAND_CELL_TYPE.ROCK);
}

								
function getNextIslandCellType(type)
{
	var newType = type + 1;
	
	if (newType > ISLAND_CELL_TYPE.ROCK)
	{
		newType = ISLAND_CELL_TYPE.DEEP_WATER;
	}
	
	return newType;
}

				 
function IslandCell(type)
{
	var _type = type;

	
	this.getType = function ()
	{
		return _type;
	}

	
	this.setType = function (type)
	{
		_type = type;
	}

	
	this.getColour = function ()
	{
		var result = COLOUR.PINK;
		
		switch (_type)
		{
			case ISLAND_CELL_TYPE.DEEP_WATER:
				result = ISLAND_CELL_TYPE_COLOUR.DEEP_WATER;
				break;
			case ISLAND_CELL_TYPE.SHALLOW_WATER:
				result = ISLAND_CELL_TYPE_COLOUR.SHALLOW_WATER;
				break;
			case ISLAND_CELL_TYPE.SAND:
				result = ISLAND_CELL_TYPE_COLOUR.SAND;
				break;
			case ISLAND_CELL_TYPE.GRASS:
				result = ISLAND_CELL_TYPE_COLOUR.GRASS;
				break;
			case ISLAND_CELL_TYPE.TREE:
				result = ISLAND_CELL_TYPE_COLOUR.TREE;
				break;
			case ISLAND_CELL_TYPE.ROCK:
				result = ISLAND_CELL_TYPE_COLOUR.ROCK;
			default:
				break;
		}
		
		return result;
	}
}