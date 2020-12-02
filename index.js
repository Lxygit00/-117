const express = require("express")
const cors = require("cors")
const path = require("path");
const jwt = require("express-jwt");
const app = express();

// 解析token  并验证token的合法性，如果解析失败就直接返回错误状态401
// 凡是以/api开头的路径不需要验证token的有效性
// 从token中 犯戒出用户id，然后以uesr的方式添加到req对象中



// 导入路由模块
const loginRouter = require(path.join(__dirname, "routers/login-router.js"))
const userRouter = require(path.join(__dirname, "routers/user-router.js"))
app.use(jwt({ secret: "bigevent" }).unless({ path: /^\/api/ }))
// 设置跨域问题
app.use(cors())

// 处理客户请求的post参数
// 解析 application/json 
app.use(express.json())
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))


app.listen(9615, () => {
    console.log("服务器启动了");
})



// 配置路由模块/api
app.use("/api", loginRouter)

app.use("/my", userRouter)



app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        res.status(401).json({
            status: 401,
            message: '没有权限获取数据',
        })
    }
})