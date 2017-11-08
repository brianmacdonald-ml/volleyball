scores <- function(matchtype , event_name, event_id) {
  #matchtype = list return a list of event names and ids
  
  if (!is.na(event_name) && matchtype == "match") {
    event_id <- EVENTGROUPINGS[EVENTGROUPINGS$CACHEDNAME == event_name,]$EVENTGROUPING
  }

  print(matchtype)
  print(event_name)
  print (event_id)
  
  if (matchtype=="list") { results <- unique(EVENTGROUPINGS[,c(1,4),])}

  if (matchtype != "list") {results <- EVENTGROUPINGS[EVENTGROUPINGS$EVENTGROUPING == event_id,c(1,4,6,7)]}
  
  results
}

get_players <- function(season=NULL,game=NULL) {
  #add season filter at some time
  season <- if (season=="ALL") {NULL} else {season}
  players <- if (!is.null(season)) {stats[stats$TEAMNAME==season,]} else {stats}
  players <- if (!is.null(game)) {players[players$GAME==game,]} else {players}
  
  a <- as.character(unique(players$FULLNAME))
  a <- c("ALL",a)
  a
}

get_seasons <- function(player=NULL,game=NULL) {
  #add season filter at some time
  seasons <- if (!is.null(player)) {stats[stats$FULLNAME==player,]} else {stats}
  seasons <- if (!is.null(game)) {seasons[seasons$GAME==game,]} else {seasons}
  
  a <- as.character(unique(seasons$TEAMNAME))
  a <- c("ALL",a)
  a
}

get_player_id <- function(last_first) {
  name_length <- nchar(last_first)
  comma <- regexpr(",",last_first)[[1]]
  a <- PLAYERS[PLAYERS$LASTNAME == substr(last_first,1,comma-1) & PLAYERS$FIRSTNAME == substr(last_first,comma+2,name_length),]$PLAYER
  a 
}

num_games_played <- function(playerid=NULL,game_id=NULL) {
  
  my_stats <- if (is.null(playerid) & is.null(game_id)) {stats}
    else if  (is.null(playerid)) { stats[ stats$GAME==game_id,]}
  else {stats[stats$PLAYER==playerid,]}
  
  games <- my_stats %>%
         group_by(FULLNAME) %>% 
         summarise(count = n_distinct(GAME)) %>%
         arrange(desc(count))
  games <- as.data.frame(games)
  return(games)
}
  
get_stat <- function(stats,game_stat=NULL,playerid=NULL,game_id=NULL){
  
  game_stat <- if(is.null(game_stat)) {c( "Assist"    ,             "Attempt"       ,         "Ball Handling Error"   ,
                                           "Block Touch"  ,          "Blocking Error" ,        "Cover "             ,    "Dig"            ,       
                                           "Double Block"  ,         "Error"           ,       "Free Ball-Overpass Dig", "Freeball"        ,      
                                           "Kill"           ,        "Missed Dig"       ,      "Net"            ,        "Over Pass Attempt",     
                                           "Over Pass Error" ,       "Over Pass Kill"    ,     "Passer Rating"  ,        "Serve Rating"      ,    
                                           "Service Ace"      ,      "Service Attempt"  ,      "Service Error"   ,       "Set Attempt"        ,   
                                           "Set Setter"        ,     "Setter Out"       ,      "Solo Block "    ,        "Starting Lineup"    ,   
                                           "Sub"                )} 
              else {game_stat}
  
  #print(game_stat)
  my_stats <- if (is.null(playerid) & is.null(game_id)) {stats}
  else if  (is.null(playerid)) { stats[ stats$GAME==game_id,]}
  else {stats[stats$PLAYER==playerid,]}
  my_stats <-my_stats[,c("FULLNAME",game_stat)]
  stats <-  my_stats %>%
    group_by(FULLNAME) %>% 
    summarise_each (funs(sum(.,na.rm=TRUE)), game_stat)
  as.data.frame(stats)
}  
