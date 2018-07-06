/**
 * Created by Administrator on 2018/7/2.
 */

const wt = require('wt-sutil');
const mysqlConfig = require('../config/mysql.json');
const cloudConfig = require('../config/cloud.json');


const {mysql,cloud} = wt;

mysql.setConfig(mysqlConfig);
cloud.setUserInfo(cloudConfig);