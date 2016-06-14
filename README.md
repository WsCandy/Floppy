# Floppy

Responsive Email builder.

Installation Instructions
-------------------------

You will need to install both `nodejs` and `git` in order to set up and get this website running locally. Follow the instructions below to get started.

1) Clone this repository down onto your machine using git.
2) Once the repository is cloned to your local machine, `cd` into it and run the following commands in your terminal.

    npm install nodemon -g
    npm install
    
3) You will need to update all the submodules in order to run the website locally to do this run the following.

    git submodule update --init
    
4) If the above command fails to run (This will be because your SSH keys aren't set up) you can do one of the following: Edit `.gitmodules` and replace the url's with the SSH urls, or you can set up SSH keys.

5) Once you have the submodules install you will need to `cd` into the `floe-gulp` folder and run:

    npm install

6) In order to run the site you need to be in the repositories root directory and run the following command

    nodemon --harmony floe/core/bin/www.js
    
This will run the website on `http://localhost:4205`

7) You will also need to run `gulp` in the repositories root directory, this will run browser sync on `http://localhost:3000` and compile your JS/CSS

