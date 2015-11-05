var MATERIAL = { NONE:0,
			     SAND:1,
			     ROCK:2};

				 
function getColourForMaterial(material)
{
	switch (material)
	{
		case MATERIAL.NONE:
			result = COLOUR.WHITE;
			break;
		case MATERIAL.SAND:
			result = COLOUR.YELLOW;
			break;
		case MATERIAL.ROCK:
			result = COLOUR.GRAY;
			break;
		default:
			result = COLOUR.PINK;
			break;
	}
	
	return result;
}


function randomMaterial()
{
	return randomInteger(MATERIAL.NONE, MATERIAL.ROCK);
}