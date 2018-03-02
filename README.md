# Locus_Analytics
Relationship of Companies in Seattle's Aerospace Industry
### Thought Process
I started with scanning the data and applied a different combination of columns to make the best sense of the data at first. Then I looked at each combination and figured which way a report given to a customer would make him happy. 
I felt that representing this data in a graph would make sense and would give the customer a better idea of how data is related to each other. At first, creating a graph made it more complex. So I created a view for single company using a simple drop-down and then represented all the companies associated with it.   
#### Output of one of the selected company ["Commercial Airlines"]
![Alt text](/output.JPG?raw=true "Output")
This graph gives us a perfect view of companies associated with the select company with a well-defined direction and it also gives the Activities & Object associated with each company. Currently, the node colors are based on the type of Object.

If given time - I would want to work on displaying the graph by Activities and Objects separately, in order to give a better sense to the user.

### Prerequisites for Building
- Install npm

Run following command in terminal & navigate to repo
- npm install http-server
- http-server

- http://localhost:8080/ in your browser.

