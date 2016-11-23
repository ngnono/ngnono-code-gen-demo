
var sql = require('mssql');
var config = require('config');
var S = require('string');

var dbConfig = config.get("db");

const s = `SELECT * FROM [Wechat_BI].[dbo].[Dict] `;

var data = `
    /// <summary>
    /// 用户统计指标
    /// </summary>
    public enum UserQuotaType
    {

`;

var dt = `

        /// <summary>
        /// {{summary}}
        /// </summary>
        [Description("{{desc}}")]
        Quota{{key}} = {{val}},

`;


var r = function(recordset){

    console.log('-');
    recordset.forEach(function(re){

        var v = {
            summary:re["Name"],
            desc:re["Description"],
            key:re["Code"],
            val: Number(re["Code"])
        };

        data=data+ S(dt).template(v).s;

        console.log(1);
    });
console.log('-');
};

var q = function(){

    new sql.Request().query(s).then(r).then(function(){
        data = data+ '   }';
        console.log(data);
    });
};



var e = function(err){
    // ... error checks
    sql.close();
    console.error(err);
};

sql.connect(dbConfig).then(q).then(function(){
    console.log('close');
    sql.close();


}).catch(e);






