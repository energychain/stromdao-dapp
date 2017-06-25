#
# StromDAO Business Object - Decentralized Apps
# Deployment via Makefile to automate general Quick Forward 
#

PROJECT = "My Fancy Node.js project"


all: browserify commit lc4 production origin

browserify: ;cd StromDAO-Browser && \
   browserify js/bo_loader.js > js/loader.js ;
   
commit: ;git commit -a -m "Updated BO Loader";
   
lc4: ;git push lc4;
 
origin: ;git push origin;

production: ;git push production;
