
var sql = require('mssql');
var config = require('config');
var S = require('string');
var fs = require('fs');

var dbConfig = config.get("db");

const s = `SELECT * FROM [Wechat_BI].[dbo].[Dict] `;

var data = `
    /// <summary>
    /// 用户统计指标
    /// </summary>
    public enum UserQuotaType : long
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

    recordset.forEach(function(re){

        var v = {
            summary:re["Name"],
            desc:re["Description"],
            key:re["Code"],
            val: Number(re["Code"])
        };

        data=data+ S(dt).template(v).s;

    });

};

var q = function(){

    new sql.Request().query(s).then(r).then(function(){
        data = data+ '   }';
        console.log(data);
      writeFile('C:\\Workspace\\userq.cs',data);
    });
};

function writeFile(file,data){

  // 把中文转换成字节数组
  //var arr = iconv.encode(str, 'gbk');


  // appendFile，如果文件不存在，会自动创建新文件
  // 如果用writeFile，那么会删除旧文件，直接写新文件
  fs.appendFile(file, data, function(err){
    if(err)
      console.error(err);
    else
      console.log("写入文件ok");
  });
}


var e = function(err){
    // ... error checks
    sql.close();
    console.error(err);
};

sql.connect(dbConfig).then(q).then(function(){
    console.log('close');
    sql.close();


}).catch(e);






