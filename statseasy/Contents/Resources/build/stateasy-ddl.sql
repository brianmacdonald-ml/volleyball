create table columnGroups (columngroup integer generated by default as identity (start with 1), name varchar(255), startIndex integer, endIndex integer, statview integer not null, primary key (columngroup));
create table configproperties (configproperty integer generated by default as identity (start with 1), propertyname varchar(255), propertyvalue varchar(255), primary key (configproperty), unique (propertyname));
create table eventGroupingAttribute (eventGroupingAttribute integer not null, value varchar(255), name varchar(255) not null, primary key (eventGroupingAttribute, name));
create table eventGroupingAttributeTypes (eventGroupingAttributeType integer generated by default as identity (start with 1), name varchar(255), defaultValue varchar(255), eventGroupingAttributeTypeIndex integer, specificationLevel varchar(255), attributeDataType varchar(255), eventGroupingType integer not null, primary key (eventGroupingAttributeType));
create table eventGroupingSerieses (eventGroupingSeries integer generated by default as identity (start with 1), uuid varchar(255), sport integer not null, primary key (eventGroupingSeries));
create table eventGroupingTypes (eventGroupingType integer generated by default as identity (start with 1), eventGroupingTypeIndex integer, leafType bit, eventGroupingSeries integer not null, name varchar(255), nameFormat varchar(255), contributeWinLoss bit, displayWinLoss bit, displayScore bit, displayTie bit, displayInStream bit, displayAsPractice bit, opponentSpecLevel varchar(255), primary key (eventGroupingType));
create table eventGroupings (eventGrouping integer generated by default as identity (start with 1), uuid varchar(255), eventGroupingIndex integer, cachedName varchar(255), thumbnailPath varchar(255), pointsFor integer, pointsTied integer, pointsAgainst integer, createdBy varchar(255), shareable bit, allAccess bit, associatedEvent integer, eventGroupingType integer not null, parentGroup integer, ourSeason integer not null, theirSeason integer, viewCount integer, createdDate timestamp, uploadDate timestamp, shared bit, demo bit, shareError bit, primary key (eventGrouping), unique (associatedEvent));
create table eventShares (eventShare integer generated by default as identity (start with 1), eventGrouping integer, fromUser integer, toUser integer, sharingPermissions varchar(255), sharedWhen timestamp, primary key (eventShare));
create table games (game integer generated by default as identity (start with 1), uuid varchar(255), starttime timestamp, nextstatindex integer default 0, currentstate integer, ourSeason integer, theirSeason integer, takeStatsNowEvent bit default 0, primary key (game));
create table gamestate_gamestateproperties (gamestate integer not null, gamestateproperty integer not null, primary key (gamestate, gamestateproperty));
create table gamestateproperties (gamestateproperty integer generated by default as identity (start with 1), propertyname varchar(255) not null, propertyvalue varchar(255) not null, primary key (gamestateproperty), unique (propertyname, propertyvalue));
create table gamestates (gamestate integer generated by default as identity (start with 1), hashCode integer, primary key (gamestate));
create table gamevideos (gamevideo integer generated by default as identity (start with 1), uuid varchar(255), eventGrouping integer, displayname varchar(255), readytoshare bit, thumbnailPath varchar(255), sport integer, primary key (gamevideo));
create table groupings (grouping integer generated by default as identity (start with 1), uuid varchar(255), name varchar(255), groupingData varchar(255), defaultGrouping bit, sport integer not null, primary key (grouping));
create table liveviews (liveview integer generated by default as identity (start with 1), uuid varchar(255), displayname varchar(255), displayorder integer, classname varchar(255), version double, contents longvarchar, style longvarchar, displayInVideoReplay bit, displayInMediaView bit, displayInPlaylistReplay bit, sport integer not null, primary key (liveview));
create table locationdata (locationdata integer generated by default as identity (start with 1), uuid varchar(255), x integer, y integer, startPoint bit, endPoint bit, stat integer not null, dataindex integer, primary key (locationdata));
create table playerFollowers (playerFollower integer generated by default as identity (start with 1), followUser integer not null, player integer not null, isAdmin bit, followedOn timestamp, primary key (playerFollower));
create table players (player integer generated by default as identity (start with 1), uuid varchar(255), firstname varchar(255), lastname varchar(255), height varchar(255), weight varchar(255), birthday varchar(255), hometown varchar(255), autogenerated bit, sport integer not null, primary key (player));
create table playersinseasons (playerinseason integer generated by default as identity (start with 1), uuid varchar(255), player integer not null, season integer, number integer, shortcut varchar(255), primary key (playerinseason), unique (season, shortcut));
create table playlistEntries (playlistEntry integer generated by default as identity (start with 1), entryindex integer, targetStat integer not null, targetVideo integer not null, starttime bigint, time bigint, endtime bigint, playlist integer, primary key (playlistEntry));
create table playlistShares (playlistshare integer generated by default as identity (start with 1), playlist integer not null, statUser integer not null, admin bit, sharedWhen timestamp, primary key (playlistshare), unique (playlist, statUser));
create table playlists (playlist integer generated by default as identity (start with 1), uuid varchar(255), name varchar(255), status varchar(255), viewCount integer, primary key (playlist));
create table seasonFollowers (seasonFollower integer generated by default as identity (start with 1), statUser integer, userGroup integer, season integer not null, permissions varchar(255), followedOn timestamp, primary key (seasonFollower), unique (userGroup, season), unique (statUser, season));
create table seasons (season integer generated by default as identity (start with 1), uuid varchar(255), name varchar(255), headcoach varchar(255), assistantcoach varchar(255), shown bit, team integer not null, createdDate timestamp, nextEventIndex integer default 0, primary key (season));
create table sports (sport integer generated by default as identity (start with 1), name varchar(255), url varchar(255), version integer, primary key (sport));
create table statImports (statImport integer generated by default as identity (start with 1), filename varchar(255), importDate timestamp, eventGrouping integer, status varchar(255), primary key (statImport));
create table statcolumns (statcolumn integer generated by default as identity (start with 1), name varchar(255), definition longvarchar, columnindex integer, tableNumber integer, formattype varchar(255), formatpattern varchar(255), statview integer not null, primary key (statcolumn));
create table statdata (statdata integer generated by default as identity (start with 1), player integer, numericalData integer, time bigint, stat integer not null, dataindex integer, primary key (statdata));
create table stateffects (stateffect integer generated by default as identity (start with 1), uuid varchar(255), name varchar(255), friendlyName varchar(255), version double, provideInfo varchar(255), effect longvarchar, sharedCode bit default false, sport integer not null, primary key (stateffect), unique (name, sport));
create table stats (stat integer generated by default as identity (start with 1), uuid varchar(255), stattype integer not null, game integer not null, color varchar(255), timetaken timestamp, gameTime bigint, statindex integer, parentStat integer, beginninggamestate integer, endinggamestate integer, opponentstat bit, seektimeoffset double, endtimeoffset double, actionendingstat bit, primary key (stat));
create table stattypes (stattype integer generated by default as identity (start with 1), uuid varchar(255), name varchar(255), onlinehelp varchar(255), shortcut varchar(255), parseInformation longvarchar, statEffect integer, seektimeoffset double, endtimeoffset double, actionendingstat bit, locationaware bit, pointcount integer, color varchar(255), shape varchar(255), linestyle varchar(255), linewidth integer, sport integer not null, doubleTap bit, privateStat bit, primary key (stattype), unique (shortcut, sport));
create table statusers (userid integer not null, username varchar(255), password varchar(255), phoneNumber varchar(255), createdon timestamp, lastLoggedIn timestamp, verified bit, bouncing bit, admin bit, primary key (userid), unique (username));
create table statviews (statview integer generated by default as identity (start with 1), uuid varchar(255), view varchar(255), totalrow bit, flipColRow bit, mergeOpponentTables bit, defaultView bit, hidden bit, sport integer not null, primary key (statview));
create table summaryViewEntries (summaryViewEntry integer generated by default as identity (start with 1), summaryView integer not null, entryIndex integer, sourceView integer not null, sourceGrouping integer not null, totalrow bit, flipColRow bit, mergeOpponentTables bit, primary key (summaryViewEntry));
create table summaryViews (summaryView integer generated by default as identity (start with 1), uuid varchar(255), name varchar(255), defaultView bit, sideBySide bit, sport integer not null, primary key (summaryView));
create table teams (team integer generated by default as identity (start with 1), uuid varchar(255), teamname varchar(255), opponent bit, autogenerated bit, sport integer not null, createdDate timestamp, primary key (team));
create table tutorialLinks (tutorialLink integer generated by default as identity (start with 1), sport integer not null, name varchar(255), link varchar(255), thumbnail varchar(255), description varchar(255), primary key (tutorialLink));
create table userGroupMembers (userGroupMember integer generated by default as identity (start with 1), statUser integer not null, userGroup integer not null, admin bit, primary key (userGroupMember), unique (statUser, userGroup));
create table userGroups (userGroup integer generated by default as identity (start with 1), name varchar(255), description longvarchar, uuid varchar(255), primary key (userGroup), unique (name));
create table usermessages (id integer generated by default as identity (start with 1), objectUuid varchar(255), sender varchar(255), receiver varchar(255), info varchar(255), sport integer, primary key (id));
create table videoPartETags (videoPartETag integer generated by default as identity (start with 1), partNumber integer, eTag varchar(255), videoSegment integer, primary key (videoPartETag));
create table videoSources (videoSource integer generated by default as identity (start with 1), videoSourceType varchar(255), location varchar(255), filename varchar(255), videoSegment integer, primary key (videoSource));
create table videosegments (videosegment integer generated by default as identity (start with 1), uuid varchar(255), sourceFileName varchar(255), encodedFileName varchar(255), displayname varchar(255), duration double, size bigint, status varchar(255), serverShared bit, pieceHash longvarchar, creationDate timestamp, encodingStart timestamp, encodingEnd timestamp, firstUploadedDate timestamp, lastUploadedDate timestamp, currentPercentage integer, storageType varchar(255), location varchar(255), uploadId varchar(255), gameVideo integer, segmentIndex integer, primary key (videosegment));
create table videosyncpoints (videosyncpoint integer generated by default as identity (start with 1), gamevideo integer not null, stat integer not null, secondsinvideo double, primary key (videosyncpoint));
alter table columnGroups add constraint FKD08F40CAF31DDCDE foreign key (statview) references statviews;
alter table eventGroupingAttribute add constraint FKF53A355FD18C0C1C foreign key (eventGroupingAttribute) references eventGroupings;
alter table eventGroupingAttributeTypes add constraint FK56D3B65A16FD01AE foreign key (eventGroupingType) references eventGroupingTypes;
create index eventgroupingseriesuuidindex on eventGroupingSerieses (uuid);
alter table eventGroupingSerieses add constraint FKCCFBDA42F25B0BA8 foreign key (sport) references sports;
alter table eventGroupingTypes add constraint FK602FBCBC4627F9A8 foreign key (eventGroupingSeries) references eventGroupingSerieses;
create index eventgroupinguuidindex on eventGroupings (uuid);
alter table eventGroupings add constraint FKE09EFE5616FD01AE foreign key (eventGroupingType) references eventGroupingTypes;
alter table eventGroupings add constraint FKE09EFE567B7AFE92 foreign key (parentGroup) references eventGroupings;
alter table eventGroupings add constraint FKE09EFE56A9DFB752 foreign key (ourSeason) references seasons;
alter table eventGroupings add constraint FKE09EFE56B61C3AE0 foreign key (theirSeason) references seasons;
alter table eventGroupings add constraint FKE09EFE567E7E00AE foreign key (associatedEvent) references games;
alter table eventShares add constraint FK5B22FAE26556C45 foreign key (toUser) references statusers;
alter table eventShares add constraint FK5B22FAEE7160C1A foreign key (eventGrouping) references eventGroupings;
alter table eventShares add constraint FK5B22FAEFEF45F4 foreign key (fromUser) references statusers;
create index eventuuidindex on games (uuid);
create index takeStatsNowIndex on games (takeStatsNowEvent);
alter table games add constraint FK5D932C1F8C71737 foreign key (currentstate) references gamestates;
alter table games add constraint FK5D932C1A9DFB752 foreign key (ourSeason) references seasons;
alter table games add constraint FK5D932C1B61C3AE0 foreign key (theirSeason) references seasons;
alter table gamestate_gamestateproperties add constraint FK3CBDA9F221108E28 foreign key (gamestateproperty) references gamestateproperties;
alter table gamestate_gamestateproperties add constraint FK3CBDA9F2DCE5AC5E foreign key (gamestate) references gamestates;
create index gamestatepropertynaturalindex on gamestateproperties (propertyname, propertyvalue);
create index gamevideouuidindex on gamevideos (uuid);
alter table gamevideos add constraint FK608289CAF25B0BA8 foreign key (sport) references sports;
alter table gamevideos add constraint FK608289CAE7160C1A foreign key (eventGrouping) references eventGroupings;
create index groupinguuidindex on groupings (uuid);
alter table groupings add constraint FKA7A503D0F25B0BA8 foreign key (sport) references sports;
create index liveviewuuidindex on liveviews (uuid);
alter table liveviews add constraint FK3D631D02F25B0BA8 foreign key (sport) references sports;
create index locationdatauuidindex on locationdata (uuid);
alter table locationdata add constraint FKFC8DACDFA4B8B7E8 foreign key (stat) references stats;
alter table playerFollowers add constraint FKC8341634E14D0E7B foreign key (followUser) references statusers;
alter table playerFollowers add constraint FKC83416344E4C1102 foreign key (player) references players;
create index playeruuidindex on players (uuid);
alter table players add constraint FKE294C1B2F25B0BA8 foreign key (sport) references sports;
create index playerinseasonindex on playersinseasons (uuid);
alter table playersinseasons add constraint FKE56AC7B957C3B106 foreign key (season) references seasons;
alter table playersinseasons add constraint FKE56AC7B94E4C1102 foreign key (player) references players;
alter table playlistEntries add constraint FK4FE84A5EC191F8F9 foreign key (targetStat) references stats;
alter table playlistEntries add constraint FK4FE84A5EEB920EE4 foreign key (playlist) references playlists;
alter table playlistEntries add constraint FK4FE84A5E2543D1F3 foreign key (targetVideo) references gamevideos;
create index playlistsharenaturalindex on playlistShares (playlist, statUser);
alter table playlistShares add constraint FKCFC7F4E6A8A9CF9E foreign key (statUser) references statusers;
alter table playlistShares add constraint FKCFC7F4E6EB920EE4 foreign key (playlist) references playlists;
create index playlistuuidindex on playlists (uuid);
create index FollowSeasonLookupByUser on seasonFollowers (statUser);
create index FollowSeasonLookupByUserGroup on seasonFollowers (userGroup);
alter table seasonFollowers add constraint FK7A5528728CB2CFC8 foreign key (userGroup) references userGroups;
alter table seasonFollowers add constraint FK7A552872A8A9CF9E foreign key (statUser) references statusers;
alter table seasonFollowers add constraint FK7A55287257C3B106 foreign key (season) references seasons;
create index seasonuuidindex on seasons (uuid);
alter table seasons add constraint FK7552F1F0A4B92FFA foreign key (team) references teams;
alter table statImports add constraint FKA9FF8C7AE7160C1A foreign key (eventGrouping) references eventGroupings;
alter table statcolumns add constraint FKC958B09F31DDCDE foreign key (statview) references statviews;
create index numericalDataIndex on statdata (numericalData);
alter table statdata add constraint FK4E91ABFE4E4C1102 foreign key (player) references players;
alter table statdata add constraint FK4E91ABFEA4B8B7E8 foreign key (stat) references stats;
create index stateffectuuidindex on stateffects (uuid);
alter table stateffects add constraint FK66AA6C2EF25B0BA8 foreign key (sport) references sports;
create index statuuidindex on stats (uuid);
alter table stats add constraint FK68AC49FA8A9167C foreign key (stattype) references stattypes;
alter table stats add constraint FK68AC49FEB3F7B4C foreign key (game) references games;
alter table stats add constraint FK68AC49F81B94021 foreign key (beginninggamestate) references gamestates;
alter table stats add constraint FK68AC49FF49FEB17 foreign key (endinggamestate) references gamestates;
alter table stats add constraint FK68AC49F95FB5B92 foreign key (parentStat) references stats;
create index stattypeuuidindex on stattypes (uuid);
alter table stattypes add constraint FK849026A5F25B0BA8 foreign key (sport) references sports;
alter table stattypes add constraint FK849026A5ED6B892A foreign key (statEffect) references stateffects;
create index usernameIndex on statusers (username);
create index viewuuidindex on statviews (uuid);
alter table statviews add constraint FK84A4E89AF25B0BA8 foreign key (sport) references sports;
alter table summaryViewEntries add constraint FKEB066AA562540325 foreign key (sourceView) references statviews;
alter table summaryViewEntries add constraint FKEB066AA5154DF76 foreign key (summaryView) references summaryViews;
alter table summaryViewEntries add constraint FKEB066AA5F2C26261 foreign key (sourceGrouping) references groupings;
create index summaryviewuuidindex on summaryViews (uuid);
alter table summaryViews add constraint FK63FB5A68F25B0BA8 foreign key (sport) references sports;
create index teamuuidindex on teams (uuid);
alter table teams add constraint FK69209B6F25B0BA8 foreign key (sport) references sports;
alter table tutorialLinks add constraint FK64C59EFBF25B0BA8 foreign key (sport) references sports;
alter table userGroupMembers add constraint FKF59AD5058CB2CFC8 foreign key (userGroup) references userGroups;
alter table userGroupMembers add constraint FKF59AD505A8A9CF9E foreign key (statUser) references statusers;
create index userGroupNameIndex on userGroups (name);
create index usergroupuuidindex on userGroups (uuid);
alter table usermessages add constraint FKB2D4F217F25B0BA8 foreign key (sport) references sports;
alter table videoPartETags add constraint FKA590FFB0D61337D0 foreign key (videoSegment) references videosegments;
alter table videoSources add constraint FK7EB72EBDD61337D0 foreign key (videoSegment) references videosegments;
create index videosegmentuuidindex on videosegments (uuid);
alter table videosegments add constraint FK2B2CB11BDD304C32 foreign key (gameVideo) references gamevideos;
alter table videosyncpoints add constraint FK8115CDF9A4B8B7E8 foreign key (stat) references stats;
alter table videosyncpoints add constraint FK8115CDF9DD304C32 foreign key (gamevideo) references gamevideos;
