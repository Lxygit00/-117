//   用户模块
const express = require("express")
const path = require("path")
const utility = require("utility")

const router = express.Router()
const p = require(path.join(__dirname, "../common.js"))



// 获取用户信息
router.get("/userinfo", async (req, res) => {
    // res.send("12456")
    // 1.获取用户id信息
    // 需要从token中解析出用户id
    //  解析出的id  会存到req.user 对象中
    let id = req.user.id;
    console.log(id);
    // 2. 查询数据库
    let sql = "select id,username,nickname,email,user_pic from myuser where id = ?"
    let ret = await p.get(sql, id)
    console.log(ret);
    if (ret && ret.length > 0) {

        res.json({
            status: 0,
            message: "查询用户信息成功",
            data: ret[0]
        })
    } else {
        res.json({
            status: 1,
            message: "查询用户信息失败",

        })
    }
})



// 更新密码
router.post("/updatepwd", async (req, res) => {
    let id = req.user.id

    let params = req.body
    params.oldPwd = utility.md5(params.oldPwd)
    params.newPwd = utility.md5(params.newPwd)
    let sql = "update myuser set password = ? where id = ? and password = ?"
    let ret = await p.get(sql, [params.newPwd, id, params.oldPwd])
    console.log(ret);
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "更改密码成功",
        })
    } else {
        res.json({
            status: 1,
            message: '更改密码失败'
        })
    }
})



// 更新头像
router.post("/update/avatar", async (req, res) => {
    let id = req.user.id
    let params = req.body
    let sql = "update myuser set user_pic = ? where id = ?"
    let ret = await p.get(sql, [params.user_pic, id])
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: " 更爱头像成功",
        })
    } else {
        res.json({
            status: 1,
            message: '更换头像失败'
        })
    }
})
// 跟新用户信息
router.post("/userinfo", async (req, res) => {
    let id = req.user.id
    let params = req.body
    let sql = "update myuser set nickname= ?,email = ? where id = ?"
    let ret = await p.get(sql, [params.nickname, params.email, id])
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: " 更新用户信息成功",
        })
    } else {
        res.json({
            status: 1,
            message: '更新用户信息失败'
        })
    }
})

module.exports = router