library(dplyr)
library(tidyr)
library(sqldf)

setwd("C:\\volleyball\\statseasy\\csv")
filenames <- list.files(pattern="*csv")

df_names <- substr(filenames,1,regexpr('csv',filenames)-2)
rm(EVENTSHARES)
rm(GAMEVIDEOS)
rm(LOCATIONDATA)
rm(PLAYERFOLLOWERS)
rm(PLAYLISTS)
rm(PLAYLISTENTRIES)
rm(PLAYLISTSHARES)
rm(STATIMPORTS)
rm(SUMMARYVIEWENTRIES)
rm(SUMMARYVIEWS)
rm(TUTORIALLINKS)
rm(USERGROUPMEMBERS)
rm(USERGROUPS)
rm(USERMESSAGES)
rm(VIDEOPARTETAGS)
rm(VIDEOSEGMENTS)
rm(VIDEOSOURCES)
rm(VIDEOSYNCPOINTS)
rm(STATUSERS)
rm(SPORTS)
rm(CONFIGPROPERTIES)
rm(EVENTGROUPINGSERIESES) # has data not needed
rm(LIVEVIEWS) # has data for generating HTML
rm(STATEFFECTS)  # has data for generating HTML
rm(SEASONFOLLOWERS) # HAs list of admins not needed 
rm(STATVIEWS)  # categories for views on stats - likely used for UI

###Load all files
for(i in df_names){
  filepath <- file.path(paste(i,".csv",sep=""))
  assign(i, read.csv(filepath,header=TRUE,sep = "|"))
}

#Merge Stat Dataframes

stats <- merge(STATDATA,STATS[,c(1,3,4,6,7,8,9,10,11,12,13,14,15)],by = "STAT")
stats <- merge(stats,STATTYPES[,c(1,3,5,7:12)],by = "STATTYPE")
stats <- merge(stats,PLAYERS[,c(1,3,4)])
stats <- merge(stats,GAMES[,c(1,4,5,6,7)],by="GAME")
stats <- merge(stats,SEASONS[,c(1,3,4,5,7,9)],by.x="OURSEASON",by.y="SEASON")
stats$FULLNAME <- paste(stats$LASTNAME,stats$FIRSTNAME,sep=", ")
colnames(stats)[33] <- "TEAMNAME" 

#convert stats category to columns
stats <- stats %>% 
  mutate(ind=1) %>% 
  spread(NAME.x,ind)


#merge gamestate data
state <- merge(GAMESTATE_GAMESTATEPROPERTIES,GAMESTATEPROPERTIES, by="GAMESTATEPROPERTY")
state <- merge(state,GAMESTATES, by="GAMESTATE")


##############
#
#  Create Game and Match Data Frames
#
###############

# First Merge with other data
dim(EVENTGROUPINGS)
dim(EVENTGROUPINGTYPES)
events <- merge(EVENTGROUPINGS[,c(1,3,4,6:8,12:15)],EVENTGROUPINGTYPES[,c(1,2,5)],by="EVENTGROUPINGTYPE")
dim(events)
events <- merge(events,EVENTGROUPINGATTRIBUTE[EVENTGROUPINGATTRIBUTE$NAME=="Location",c(1,2)],
                by.x="ASSOCIATEDEVENT",by.y="EVENTGROUPINGATTRIBUTE",all.x=TRUE)
events <- merge(events,EVENTGROUPINGATTRIBUTE[EVENTGROUPINGATTRIBUTE$NAME=="Start Date",c(1,2)],
                by.x="ASSOCIATEDEVENT",by.y="EVENTGROUPINGATTRIBUTE",all.x=TRUE)
events <- merge(events,EVENTGROUPINGATTRIBUTE[EVENTGROUPINGATTRIBUTE$NAME=="Start Time",c(1,2)],
                by.x="ASSOCIATEDEVENT",by.y="EVENTGROUPINGATTRIBUTE",all.x=TRUE)
colnames(events)[13] <- "location"
colnames(events)[14] <- "start_date"
colnames(events)[15] <- "start_time"
events$game_date <- ISOdatetime(1970,1,1,0,0,0) +as.numeric(as.character(events$start_date))/1e3
events$game_time <- ISOdatetime(1970,1,1,0,0,0) +as.numeric(as.character(events$start_time))/1e3
dim(events)

###  Need to fill in blank locations


###  Who is competitor 

# Matches

matches <- EVENTGROUPINGS[is.na(EVENTGROUPINGS$PARENTGROUP),c(1,3,4,6:8,12,13,15)]

games <- EVENTGROUPINGS[!is.na(EVENTGROUPINGS$PARENTGROUP),c(1,3,4,6:8,12:15)]


############
#
# Create Player data frame
#
###############
dim(PLAYERS)
dim(PLAYERSINSEASONS)
player <- merge(PLAYERS[,c("PLAYER","FIRSTNAME","LASTNAME")],PLAYERSINSEASONS[,c(1,3:6)],by="PLAYER")
dim(player)
player <- merge(player, SEASONS[,c(1,3:5,7)],by="SEASON")
dim(player)
player <- merge(player,TEAMS[,c(1,3)],by="TEAM")
dim(player)
player$fullname <- paste(player$LASTNAME,player$FIRSTNAME,sep=", ")


#############
#
#create point by point data
#
##############

point_data <- state %>%
  select(GAMESTATE,PROPERTYNAME,PROPERTYVALUE) %>%
  group_by(GAMESTATE) %>%
  spread(key=PROPERTYNAME, value=PROPERTYVALUE) 
point_data <- as.data.frame(point_data)

#get currentstate ranges for each game - CURRENSTATE refers to last state of the game
#so to get first state, get prior games CURRENTSTATE +1

game_ranges <- GAMES[,c(1,5)]
game_ranges <- game_ranges[order(game_ranges$CURRENTSTATE ),]
game_ranges$first_state <- lag(game_ranges$CURRENTSTATE,1)+1

game_ranges <- sqldf("select * from point_data f1 inner join game_ranges f2 
       on (f1.GAMESTATE >= f2.first_state and f1.GAMESTATE <= f2.CURRENTSTATE) ")

# Filter out when hasServe = NA - I m noit sure why this is yet though
game_ranges <- game_ranges[!is.na(game_ranges$hasServe),]
game_ranges$ourScore <- as.numeric(as.character(game_ranges$ourScore))
game_ranges$theirScore <- as.numeric(as.character(game_ranges$theirScore))

# Add unique ID
game_ranges$ID <- seq.int(nrow(game_ranges))

#remove mistakes 
#  I think this is if the column firstAttempt = Yes

game_ranges <- game_ranges[is.na(game_ranges$firstAttempt),]
game_ranges$total_points <- game_ranges$ourScore+game_ranges$theirScore
game_ranges <- game_ranges[order(game_ranges$GAME,game_ranges$total_points),]
# now add more game data

# Add win/loss for each point
temp <- game_ranges %>% group_by(GAME) %>%
  arrange(GAME,ourScore,theirScore) %>%
  mutate(our_prior = lag(ourScore),
         their_prior = lag(theirScore)) %>% 
  select(ID, GAME,our_prior,their_prior) %>% 
  as.data.frame()
#  add game won/loss for each point

game_ranges <- merge(game_ranges,temp, by=c("ID","GAME")) 

# Their are some data gaps where difference can be > 1  this is due to missing recordds from data entry
game_ranges$win <- ifelse(game_ranges$ourScore - game_ranges$our_prior == 0, 0, 1)
# Add player names 
game_ranges <- merge(game_ranges,PLAYERS[,c("FIRSTNAME","LASTNAME","PLAYER")],by.x="position_1",by.y="PLAYER")
game_ranges$poistion_1_name <- paste(game_ranges$LASTNAME, game_ranges$FIRSTNAME,sep=", ")
game_ranges$FIRSTNAME <- NULL
game_ranges$LASTNAME <- NULL
#player#2
game_ranges <- merge(game_ranges,PLAYERS[,c("FIRSTNAME","LASTNAME","PLAYER")],by.x="position_2",by.y="PLAYER")
game_ranges$poistion_2_name <- paste(game_ranges$LASTNAME, game_ranges$FIRSTNAME,sep=", ")
game_ranges$FIRSTNAME <- NULL
game_ranges$LASTNAME <- NULL
#player#3
game_ranges <- merge(game_ranges,PLAYERS[,c("FIRSTNAME","LASTNAME","PLAYER")],by.x="position_3",by.y="PLAYER")
game_ranges$poistion_3_name <- paste(game_ranges$LASTNAME, game_ranges$FIRSTNAME,sep=", ")
game_ranges$FIRSTNAME <- NULL
game_ranges$LASTNAME <- NULL
#player#4
game_ranges <- merge(game_ranges,PLAYERS[,c("FIRSTNAME","LASTNAME","PLAYER")],by.x="position_4",by.y="PLAYER")
game_ranges$poistion_4_name <- paste(game_ranges$LASTNAME, game_ranges$FIRSTNAME,sep=", ")
game_ranges$FIRSTNAME <- NULL
game_ranges$LASTNAME <- NULL
#player#5
game_ranges <- merge(game_ranges,PLAYERS[,c("FIRSTNAME","LASTNAME","PLAYER")],by.x="position_5",by.y="PLAYER")
game_ranges$poistion_5_name <- paste(game_ranges$LASTNAME, game_ranges$FIRSTNAME,sep=", ")
game_ranges$FIRSTNAME <- NULL
game_ranges$LASTNAME <- NULL
#player#6
game_ranges <- merge(game_ranges,PLAYERS[,c("FIRSTNAME","LASTNAME","PLAYER")],by.x="position_6",by.y="PLAYER")
game_ranges$poistion_6_name <- paste(game_ranges$LASTNAME, game_ranges$FIRSTNAME,sep=", ")
game_ranges$FIRSTNAME <- NULL
game_ranges$LASTNAME <- NULL

# add game details
game_ranges <- merge(game_ranges,GAMES[,c("GAME","OURSEASON")],by="GAME")

# add column for streaks
 


#diagnostics

game_id <- 374

plot(game_ranges[game_ranges$GAME==game_id,]$ourScore,type="l",col="red",ylim=c(0,30))
lines(game_ranges[game_ranges$GAME==game_id,]$theirScore,type="l",col="blue")

game_ranges[game_ranges$GAME==game_id,c(1:4,14)]

#
View(game_ranges[,c("ID","GAME","ourScore","our_prior","theirScore","their_prior")])