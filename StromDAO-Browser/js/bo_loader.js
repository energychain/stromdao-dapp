document.StromDAOBO = require("stromdao-businessobject");   
var StromDAOBO =document.StromDAOBO;
var node = new StromDAOBO.Node({external_id:'1337',testMode:true,rpc:"http://localhost:8540"});
document.node = node;
