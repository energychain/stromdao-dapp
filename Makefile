#
# My Fancy Node.js project
#

PROJECT = "My Fancy Node.js project"


all: browserify lc4 production origin

browserify:
   cd StromDAO-Browser \
   browserify js/bo_loader.js > js/loader.js ;
   
lc4:
   git push lc4;
 
origin:
   git push origin;

production:
   git push production;
