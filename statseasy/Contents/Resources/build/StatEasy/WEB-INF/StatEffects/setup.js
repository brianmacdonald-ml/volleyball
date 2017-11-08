importPackage(com.ressq.stateasy.model);
var currentState = new GameState();
currentState.set("ourScore", "0");
currentState.set("theirScore", "0");
currentState.set("position_1", "1");
currentState.set("position_2", "2");
currentState.set("position_3", "3");
currentState.set("position_4", "4");
currentState.set("position_5", "5");
currentState.set("position_6", "6");

var newState = new GameState();

var relevantStat = new Stat();
relevantStat.id = 1;

var somePlayer = new Player();
somePlayer.firstName = "Michael";
somePlayer.lastName = "Ressler";
somePlayer.id = 1;
relevantStat.player = somePlayer;

var someStatType = new StatType();
someStatType.name = "Sample Test";
someStatType.shortcut = "st";
relevantStat.statType = someStatType;

var someGame = new Game();
relevantStat.game = someGame;

relevantStat.data = new Integer(1);