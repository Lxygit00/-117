const express = require("express");
const path = require("path")
//    进行加密的包
const utility = require("utility");
// 解析token
const jwt = require("jsonwebtoken");

//  导入数据库通用模块
const p = require(path.join(__dirname, "../common.js"))
// 差分路由模块 ，可以将路由添加到router 对象上
// 在入口文件中同过app.use的方法吧router的方法 配置到全局
const router = express.Router();


// 注册接口
router.post("/reguser", async (req, res) => {
    //  1.获取表单数据
    let params = req.body
    //  对密码进行加密
    params.password = utility.md5(params.password)
    // 插入数据库之前，进行用户名重复行判断
    let csql = "select id from myuser where username = ?"
    let flag = await p.get(csql, params.username)
    if (flag && flag.length > 0) {
        //  用户名已经存在
        res.json({
            status: 1,
            message: "用户名已经存在"
        })
        return
    }

    // 2.把数据插入数据库
    let sql = "insert into myuser set ?"
    let ret = await p.get(sql, params)
    if (ret && ret.affectedRows > 0) {
        //  用户注册成功
        res.json({
            status: 0,
            message: " 用户注册成功"
        })
    } else {
        res.json({
            status: 1,
            message: "注册失败",
        })
    }
})

// 登录接口
router.post("/login", async (req, res) => {
    // 获取表单数据
    let params = req.body;
    // 对密码再次进行加密
    params.password = utility.md5(params.password)
    // 查询数据库 验证该用户是否存在
    let sql = "select id from myuser where username = ? and password = ?"
    let ret = await p.get(sql, [params.username, params.password])
    // 根据判断的结果进行返回
    if (ret && ret.length > 0) {
        // 参数一 表示添加进token中的数据，一般储存用户的唯一编号
        // 参数二  表示加密字符串
        // 参数三  表示token的配置信息（配置有效期）
        let token = jwt.sign({ id: ret[0].id }, "bigevent", { expiresIn: "2 days" })
        res.json({
            status: 0,
            message: "登录成功",
            token: "Bearer " + token
        })
    } else {
        res.json({
            status: 1,
            message: "用户名或密码错误"
        })
    }
})



// 测试数据库接口 
router.get('/test', async (req, res) => {
    let sql = 'select * from myuser'
    let ret = await p.get(sql, null)
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: '查询数据成功',
            data: ret
        })
    } else {
        res.json({
            status: 1,
            message: '查询数据失败'
        })
    }
})






module.exports = router