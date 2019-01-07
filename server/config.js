//后台配置文件
export default {
    //数据库配置
    mysqlDB : {
		host:'localhost',
        user: 'root',
        password:'123456',
        database: 'vjoke'
    },
    upPath:'dist/upFile/',//上传路径
    //token 配置
    JWTs : {
        secret : 'scscms', // 指定密钥
        expiresIn:'2h'  //超时设置 m分钟 h小时 d天数
    },
	// 163邮箱服务配置 TODO 后续使用该配置
	emailServer:{
	    host: 'smtp.163.com',
	    port: 465,
	    secure: true,
	    auth: {
			user: 'vjoker@163.com', // DT:SPM 163 smtp5 消息内容被网易拦截识别为垃圾邮件，需要修改内容
	        pass: 'shenyang5220333'	// 账号授权码
	    }
	},
    //公用：获取客户端IP
    getClientIP:function(ctx) {
        let req = ctx.request;
        let ip = ctx.ip ||
            req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
        let arr = ip.match(/(\d{1,3}\.){3}\d{1,3}/);
        return arr ? arr[0] : '';
    }
}
