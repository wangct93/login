

const express = require('express');
const wt = require('wt-sutil');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('../config/server.json');

require('./init');

let {port} = config;

setAppOption();

app.listen(port,'0.0.0.0',() => {
    console.log(`the server is started on port ${port}!`);
});



app.use('/login',require(resolve('../router/login')));
app.use('/test',(req,res) => {
    res.send('test');
});


function setAppOption(){
    let {static:staticNames = [],html} = config;
    if(!wt.isArray(staticNames)){
        staticNames = [staticNames];
    }
    staticNames.forEach(item => {
        app.use('/static',express.static(resolve('..',item)));
    });
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(session({
        secret:'wangct',
        name:'ssid',
        cookie:{},
        resave:false,
        saveUninitialized:true
    }));
    app.get('/favicon.ico',(req,res) => {
        res.send(null);
    });
    app.use((req,res,next) => {
        console.log('请求地址：' + req.url);
        allowOrigin(req,res);
        if(req.url === '/'){
            res.redirect(`http://${req.headers.host}/${html}`);
        }else{
            next();
        }
    });
    app.use((req,res,next) => {
        if(isValid(req)){
            next();
        }else{
            res.status(600).send('You have to login in first!');
        }
    });
    app.set('views',resolve('../templates/ejs'));
    app.set('view engine','ejs');
}




function allowOrigin(req,res){
    let {allowIps} = config;
    let clientIp = wt.getClientIp(req);
    if(!wt.isArray(allowIps)){
        allowIps = [allowIps];
    }
    if(allowIps[0] === '*' || allowIps.indexOf(clientIp) !== -1){
        res.set('Access-Control-Allow-Origin','*');
    }
}


function resolve(...ary){
    return path.resolve(__dirname,...ary);
}

/**
 * 是否为有效的请求
 * @param req
 * @returns {boolean}
 */
function isValid(req){
    let {include,exclude} = config.authentication || {};
    let url = req.path;
    if(include){
        if(!wt.isArray(include)){
            include = [include];
        }
        if(include[0] === '*' || checkPath(include,url)){
            if(exclude && checkPath(exclude,url)){
                return true;
            }
            return !!req.session.userInfo;
        }
    }
    return true;
}


function checkPath(list,target){
    if(!list){
        return false;
    }
    if(!wt.isArray(list)){
        list = [list];
    }
    return list.some(item => {
        return new RegExp(`^${item}`).test(target);
    });
}