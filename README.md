# MERN Stack JAP(Job Application Portal)

## Installations

### Node

* For Linux:
```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* For Mac:
```
brew install node
```

### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).


### React

```
npm install -g create-react-app
```

## Running the code

* Run Mongo daemon:
```
sudo mongod
```
Mongo will be running on port 27017.


* Run Express Backend:
```
cd backend/
npm install
node server.js
```
This will start running backend server at port 5000


* Run React Frontend:
```
cd frontend
npm install/
npm start
```
This will start running frontend at port 3000

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.

