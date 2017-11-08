# DQ script

# check for accurate points per game

# win variable should be -1,0 or 1
as.data.frame(table(game_ranges$win))

game_ranges %>% group_by(GAME) %>%
  arrange(GAME,ourScore,theirScore) %>%
  mutate(our_prior = lag(ourScore),
         their_prior = lag(theirScore)) %>% 
  filter(GAME == 120) %>%
  select(GAMESTATE, GAME,ourScore, our_prior,theirScore, their_prior, win) %>% 
  as.data.frame()

#check ranges arround 6894-6929
state[(state$GAMESTATE >= 7060 & state$GAMESTATE  <= 7099) & (state$PROPERTYNAME == 'theirScore' | state$PROPERTYNAME == 'ourScore'),]

#select games where win out of range
game_ranges[abs(game_ranges$win) > 1 , c("GAME","win")]





#################

test_state <- state %>% filter(PROPERTYNAME == 'theirScore' |PROPERTYNAME == 'ourScore' |PROPERTYNAME == 'hasServe'|PROPERTYNAME == 'firstAttempt') %>%
  select(GAMESTATE,PROPERTYNAME,PROPERTYVALUE) %>%
  group_by(GAMESTATE) %>%
  spread(key=PROPERTYNAME, value=PROPERTYVALUE) %>%
  filter(is.na(firstAttempt)  ) %>%
  filter( !is.na(hasServe))

%>% 
  distinct(ourScore, theirScore)


state  %>% filter(GAMESTATE > 0 & GAMESTATE < 4)
