This is a basic application that allows for people to talk on a website.

to setup the database:
Install Docker and run the following commands (you can change run parameters if you really want, just make sure to change the application.properties above)

docker pull mysql:latest
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=location-passw -e MYSQL_DATABASE=location_search_db -p 3306:3306 -d mysql:latest
This pulls the latest image of MySQL from DockerHub and creates a MySQL Database on port 3306 on your local machine.


next you will need to open two terminals
with one terminal go to the frontend directory and run 
```npm i
npm start
```
with the other terminal go to the backend directory and run
npm i
node server.js

it should now be usable at localhost:3000
