library(shiny)
library(shinydashboard)

############################################################################################
# DEFINE DASHBOARD HEADER
############################################################################################
dbHeader <- dashboardHeader(
  title=tags$a(href='http://fcasdathletics.org/fall/volleyball-girls/',
               tags$img(src='fclogo.png')) 
)

############################################################################################
# DEFINE DASHBOARD SIDEBAR
############################################################################################

dbSidebar <- dashboardSidebar(
  # DEFINE SIDEBAR ITEMS
  menuItem("Team Stats", tabName = "team"),
  menuItem("Player Stats", tabName = "player"),
  menuItem("Analysis",tabName = "analysis")
  
 
)


############################################################################################
# POPULATE DASHBOARD
############################################################################################
userInterface <- dashboardPage(
  skin = "red",
  # DASHBOARD HEADER
  dbHeader,
  # DASHBOARD SIDEBAR
  dbSidebar,
  # DASHBOARD BODY
  dashboardBody(
    #tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "rdfTool.css"))

  )
)