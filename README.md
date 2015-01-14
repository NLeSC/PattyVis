PattyVis
========

Getting started (windows, from scratch)
---------------------------------------

1. Install Git : 	http://git-scm.com/downloads
2. Install Node.js : 	http://nodejs.org/ (Make sure add node to PATH option is checked)
  1. Create '$HOME/npm' folder (Where $HOME is c:\Users\<username>\AppData\Roaming).
  2. Open node command prompt and run `npm install -g bower grunt-cli`
3. Install Ruby: http://rubyinstaller.org/ (Make sure add ruby to PATH option is checked)
  1. Open ruby command prompt and run `gem install compass`
4. Start Git bash
5. Type: "git clone https://github.com/NLeSC/PattyVis"
6. Type: "cd PattyVis"
7. Type: "npm install"
8. Type: "bower install"
9. Type: "grunt serve"
10. Open browser, go to "http://localhost:9000"

Getting started (Linux, Debian and Ubuntu based)
-------------------------------------------------

Prerequisites
------------

1. nodejs, http://nodejs.org/
2. bower, http://bower.io
3. compass, http://compass-style.org

Installation
------------

### Install nodejs

Follow instructions at joyents github website:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

### Install nodejs modules
Install bower and grunt-cli globally
```
sudo npm install -g bower grunt-cli
```

### Install compass

Compass is used to convert the sass 2 css.

1. Install Ruby using http://rubyinstaller.org/
2. Run

    gem install compass

### Fetch git repository
```
git clone https://github.com/NLeSC/PattyVis
```

### setup with bower
```
cd PattyVis
npm install
bower install
```

### start development server & open browser
```
grunt serve
```
Changes made to code will automatically reload web page.

### Run unit tests

```
grunt test
```
Generates test report and coverage inside `test/reports` folder.

### Run end-to-end tests

Before tests can be run the webdrivers must be updated/installed with
```
npm run webdriver-update
```

Tests in Firefox and Chrome can be run with
```
grunt e2e
```

The pointcloud and minimap use a canvas and can't be tested automatically so they must be verified manually using the screenshots in the report.
Open `e2e/reports/report.html` in a web-browser.

### Build a distro

```
grunt dist
```
The `dist` folder has production ready distribution.

Mockup
------

For mockup see https://wiki.esciencecenter.nl/index.php/Patty_Visualization

Oculus Rift
-----------
Get the host application and run it: https://github.com/Instrument/oculus-bridge

Creation of sites.json
----------------------

In db run:

    SELECT site_id, ST_ASGEOJSON(geom, 15,5) FROM sites_geoms WHERE site_id IN (162,13);

To get geometry, bbox and crs.

Height and properties need to be filled manually.
