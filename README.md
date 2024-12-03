---------Mongo--------

sudo docker build -t my_mongo_image .

sudo docker run -d --name mongo -p 6000:27017 my_mongo_image:latest

sudo docker start mongo

-------Server---------

nvm use 16

npm install

npm run build

npm run start

-------Client---------

nvm use 16

npm install

npm install -g @angular/cli@14

ng serve
