library(shiny)
library(dplyr)

source("C:\\volleyball\\load_Data.R")
source("C:\\volleyball\\vb_functions.R")

# Define UI for random distribution app ----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Tabsets"),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      #Select season
      uiOutput("selectSeason"),
      # select player
      uiOutput("selectPlayer"),
     
      
      
      # Input: Select the level of analysis ----
      radioButtons("analysisType", "Analysis type:",
                   c("Season" = "season",
                     "Match" = "match",
                     "Game" = "game",
                     "Player" = "player")),
      
      # br() element to introduce extra vertical spacing ----
      br(),
      
      # Input: Slider for the number of observations to generate ----
      sliderInput("n",
                  "Number of observations:",
                  value = 500,
                  min = 1,
                  max = 1000)
      
    ),
    
    # Main panel for displaying outputs ----
    mainPanel(
      
      # Output: Tabset w/ plot, summary, and table ----
      tabsetPanel(type = "tabs",
                  tabPanel("Plot", plotOutput("plot")),
                  tabPanel("Summary", verbatimTextOutput("summary")),
                  tabPanel("Table", tableOutput("games_played")),
                  tabPanel("Box Score", tableOutput("box_score"))
      )
      
    )
  )
)

# Define server logic for random distribution app ----
server <- function(input, output) {
  
  # Reactive expression to generate the requested distribution ----
  # This is called whenever the inputs change. The output functions
  # defined below then use the value computed from this expression
  d <- reactive({
    data <- if (input$season =="ALL") {stats} else {stats[stats$TEAMNAME==input$season,]}  
    data <- if (input$player =="ALL") {data} else {stats[stats$FULLNAME==input$player,]}  
    data 
  })
  
  output$selectPlayer <- renderUI({
    selectInput('player', 'Player', choices = sort(get_players(input$season,NULL)))
  })
  
  output$selectSeason <- renderUI({
    selectInput('season', 'Season', choices = sort(get_seasons(NULL,NULL)))
  })
  
  # Generate a plot of the data ----
  # Also uses the inputs to build the plot label. Note that the
  # dependencies on the inputs and the data reactive expression are
  # both tracked, and all expressions are called in the sequence
  # implied by the dependency graph.
  output$plot <- renderPlot({
    dist <- input$dist
    n <- input$n
    
    hist(d(),
         main = paste("r", dist, "(", n, ")", sep = ""),
         col = "#75AADB", border = "white")
  })
  
  # Generate a summary of the data ----
  output$summary <- renderPrint({
    summary(d())
  })
  
  # Generate an HTML table view of the data ----
  output$games_played <- renderTable({
    d() %>%
      group_by(FULLNAME) %>% 
      summarise(count = n_distinct(GAME)) %>%
      arrange(desc(count))
  })
  
  # Generate an HTML table view of the data ----
  output$box_score <- renderTable({
    l_stats <- d() 
    options(digits=0)
    group_col <- if (input$analysisType == "player") {"FULLNAME"} 
                     else if (input$analysisType == "game") {"GAME"}
                     else if (input$analysisType == "match") {"????"}
                     else {"???"}
    
   print(group_col)
    l_stats <- get_stat(l_stats)
    print(names(l_stats))
   # print(names(l_stats))
    l_stats <- l_stats[,c(group_col, "Kill","Error","Attempt","Assist","Service Ace","Service Error","Missed Dig",
                          "Dig","Solo Block ","Double Block","Blocking Error","Ball Handling Error")]
    
    l_stats$attack_pct <- (l_stats$Kill-l_stats$Error)/l_stats$Attempt
    #print(names(l_stats))
    l_stats <- l_stats[,c(group_col,"Kill","Error","Attempt","attack_pct","Assist","Service Ace","Service Error","Missed Dig","Dig","Solo Block ",
                      "Double Block","Blocking Error","Ball Handling Error")]
     #print(names(l_stats))
     
    colnames(l_stats) <- c("Name","K","E","TA","PCT","SET","SA","SE","RE","DIG","BS","BA","BE","BHE")
    l_stats$PCT <- format(l_stats$PCT, nsmall = 3,justify="right")
    l_stats <- format(l_stats, nsmall = 0)
    
    l_stats
    
  })
  
}

# Create Shiny app ----
shinyApp(ui, server)