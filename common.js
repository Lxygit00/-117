function get(sql, params) {
    // 返回Promise 模块
    return new Promise(function (resolve, reject) {
        // 1. 加载mysql  模块
        let mysql = require("mysql");
        // 2.创建mysql链接对象
        var cn = mysql.createConnection({
            // 数据库坐在计算机的ip或域名
            host: "localhost",
            // 数据库的端口
            port: 3306,
            // 数据库的名称
            database: "my117",
            // 数据库的账号密码
            user: "root",
            password: "root123"
        })
        // 链接mysql  服务器
        cn.connect();
        //   执行sql语句
        cn.query(sql, params, function (err, result) {
            if (err) {
                return reject("数据库操作失败1212")
            }
            resolve(result)

        })

        // 关闭链接
        cn.end()

    })
}

module.exports = {
    get: get
}