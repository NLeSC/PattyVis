PattyVis
========

Getting started (windows, from scratch)
---------------------------------------
1. Install Git : 	http://git-scm.com/downloads
2. Install Node.js : 	http://nodejs.org/
3. Start Git bash
4. Type: "npm install bower connect serve-static"
5. Close Git bash
6. Add C:\Users\{YOUR USERNAME HERE}\node_modules\bower\bin to your PATH
7. Start Git bash
8. Type: "git clone https://github.com/NLeSC/PattyVis"
9. Type: "cd PattyVis"
10. Type: "bower install"
11. Type: "node server.js"
12. Open browser, go to "http://localhost:8080/index.html"

Getting started (Linux, Debian and Ubuntu based)
-------------------------------------------------
### Install git
```
sudo apt-get install git
```
### Install nodejs
Follow instructions at joyents github website:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

### Install nodejs modules
Install bower globally
```
sudo npm install -g bower
```

### Fetch git repository
```
git clone https://github.com/NLeSC/PattyVis
```

### setup with bower
```
cd PattyVis
bower install
```
### Install locally connect and serve-static
```
npm install connect serve-static
```

### start server
```
node server.js
```

Access with web browser
-----------------------
Running app should be available at url:
http://localhost:8080/

Mockup
------

For mockup see https://wiki.esciencecenter.nl/index.php/Patty_Visualization

Oculus Rift
-----------
Get the host application and run it: https://github.com/Instrument/oculus-bridge
