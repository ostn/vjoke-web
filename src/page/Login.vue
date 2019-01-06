<template>
    <div class="scs-screen login">
        <el-row class="content">
            <div class="logo">
				<h1>Welcome Vjoke</h1>
			</div>
            <el-row>
                <el-form label-width="0px" :model="data" :rules="rule_data" ref="loginForm">
                    <el-form-item prop='user_name'>
                        <el-input type="text" placeholder="账号/邮箱/手机号" v-model="data.user_name"
                                  :disabled="loading" autofocus @keyup.native.enter="login()"></el-input>
                    </el-form-item>
                    <el-form-item prop='pass_word'>
                        <el-input type="password" placeholder="密码" v-model="data.pass_word"
                                  :disabled="loading" @keyup.native.enter="login()"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="login" :disabled="loading">登录</el-button>
                <el-button @click="openReg('register')" :disabled="loading">注册</el-button>
                <el-button type="text" @click="openReg('retrieve')">忘记密码</el-button>
            </el-row>
        </el-row>

        <el-dialog :title="title[type]" :visible.sync="register.visible" size="tiny">
            <el-form :model="form" :rules="register.rules" label-width="80px" ref="regForm">
                <el-form-item label="昵称" prop="nick_name" v-if="type=='register'">
                    <el-input v-model="form.nick_name" :placeholder="placeholder.nick"></el-input>
                </el-form-item>
				<el-form-item label="帐号" prop="user_name" v-if="type=='register'">
				    <el-input v-model="form.user_name" :placeholder="placeholder.name"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="user_tel" v-if="type=='register'">
				    <el-input v-model="form.user_tel" :placeholder="placeholder.tel"></el-input>
				</el-form-item>
                <el-form-item label="邮箱" prop="user_email">
                    <el-input v-model="form.user_email" :placeholder="placeholder.email"></el-input>
                </el-form-item>
                <el-form-item :label="type=='register'?'密码':'新密码'" prop="pass_word">
                    <el-input type="password" v-model="form.pass_word" :placeholder="placeholder.pass"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="pass_words">
                    <el-input type="password" v-model="form.pass_words" @keyup.native.enter="registers" :placeholder="placeholder.pass"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="register.visible = false">取 消</el-button>
                <el-button type="primary" :disabled="register.loading" @click="registers">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import common from 'common';
    import {ajax, storage} from 'utils';
    export default {
        data () {
            const _this = this;
            return {
                data: {
                    user_name: '',
                    pass_word: ''
                },
                placeholder:{
					nick: common.nick_txt,
                    name:common.name_txt,
                    pass:common.pass_txt,
                    email:common.email_txt,
                    tel:common.tel_txt
                },
                title:{
                    register:'用户注册',
                    retrieve:'找回密码'
                },
                type:'register',//register|retrieve
                loading: false,
                rule_data: {
                    user_name: [{
                        required: true,
                        message: '帐号不能为空！',
                        trigger: 'change'
                    }, {
                        pattern: common.name_reg,
                        message: common.name_txt,
                        trigger: 'change'
                    }],
                    pass_word: [{
                        required: true,
                        message: '密码不能为空！',
                        trigger: 'change'
                    }, {
                        pattern: common.pass_reg,
                        message: common.pass_txt,
                        trigger: 'change'
                    }],
                },
                err:'',
                register:{
                    visible:false,
                    loading:false,
                    rules: {
						nick_name: [{
						    required: true,
						    message: '用户昵称不能为空！',
						    trigger: 'change'
						}, {
						    validator: (rule, value, callback) => {
						        if (!common.nick_reg.test(value)) {
						            callback(new Error(common.nick_txt));
						        } else if (_this.err.includes('昵称')) {
						            callback(new Error(_this.err));
						        } else {
						            callback();
						        }
						    },
						    trigger: 'change'
						}],
                        user_name: [{
                            required: true,
                            message: '用户帐号不能为空！',
                            trigger: 'change'
                        }, {
                            validator: (rule, value, callback) => {
                                if (!common.name_reg.test(value)) {
                                    callback(new Error(common.name_txt));
                                } else if (_this.err.includes('帐号')) {
                                    callback(new Error(_this.err));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'change'
                        }],
                        pass_word: [{
                            required: true,
                            message: '密码不能为空！',
                            trigger: 'change'
                        }, {
                            validator: (rule, value, callback) => {
                                if(!common.pass_reg.test(value)){
                                    callback(new Error(common.pass_txt));
                                } else {
                                    _this.form.pass_words && _this.$refs.regForm.validateField('pass_words');
                                    callback();
                                }
                            },
                            trigger: 'change'
                        }],
                        pass_words: [{
                            required: true,
                            message: '确认密码不能为空！',
                            trigger: 'change'
                        }, {
                            validator: (rule, value, callback) => {
                                if (!common.pass_reg.test(value)) {
                                    callback(new Error(common.pass_txt));
                                } else if (_this.form.pass_word !== _this.form.pass_words) {
                                    callback(new Error('密码与确认密码不相同！'));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'change'
                        }],
						user_tel: [{
						    required: true,
						    message: '手机号不能为空！',
						    trigger: 'change'
						}, {
						    validator: (rule, value, callback) => {
						        if (!common.tel_reg.test(value)) {
						            callback(new Error(common.tel_txt));
						        } else if (_this.err.includes('手机')) {
						            callback(new Error(_this.err));
						        } else {
						            callback();
						        }
						    },
						    trigger: 'change'
						}],
                        user_email: [{
                            required: true,
                            message: '邮箱不能为空！',
                            trigger: 'change'
                        }, {
                            validator: (rule, value, callback) => {
                                if (!common.email_reg.test(value)) {
                                    callback(new Error(common.email_txt));
                                } else if (_this.err.includes('邮箱')) {
                                    callback(new Error(_this.err));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'change'
                        }]
                    }
                },
                form:{
                    nick_name:'',
                    user_name:'',
					user_tel:'',
                    pass_word:'',
                    pass_words:'',
                    user_email:''
                }
            };
        },
        mounted(){
            storage.remove('token');
            let key = this.$route.query.active || this.$route.query.find;
            if (key && common.deal_results.hasOwnProperty(key)) {
                let msg = this.$route.query.active ? '激活用户' : '密码找回';
                this.$notify({
                    title: '系统通知',
                    duration: 10000,
                    message: common.deal_results[key].replace('#', msg),
                    type: key === 'success' ? 'success' : 'error'
                });
            }
        },
        methods: {
            registers(){
                this.$refs.regForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确定要' + this.title[this.type] + '？注意：操作后需要邮箱激活帐号！', '系统提醒', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
							this.register.loading = true;
                            ajax.call(this, '/' + this.type, this.form, (data, err) => {
                                this.register.loading = false;
                                if (!err) {
                                    this.register.visible = false;
                                    let msg = this.type === 'register' ? '注册用户' : '找回密码';
                                    this.$message({
                                        message: (data.emailErr ? '#成功。但激活邮件发送失败，请联系管理员！' : '恭喜您#成功,请登录邮箱激活帐号！').replace('#', msg),
                                        type: data.emailErr ? 'warning' : 'success'
                                    });
                                } else {
                                    this.err = err;
                                    if (err.includes('昵称')) {
                                        this.$refs.regForm.validateField('nick_name');
                                    }
									if (err.includes('帐号')) {
									    this.$refs.regForm.validateField('user_name');
									}
									if (err.includes('手机')) {
									    this.$refs.regForm.validateField('user_tel');
									}
									if (err.includes('邮箱')) {
									    this.$refs.regForm.validateField('user_email');
									}
                                }
                            })
                        }).catch(() => {
                        });
                    }
                });
            },
            openReg(type){
                this.$refs.regForm && this.$refs.regForm.resetFields();
                this.type = type;
                this.register.visible = true;
            },
            login() {
                this.$refs.loginForm.validate(valid => {
                    if (valid && !this.loading) {
                        this.loading = true;
                        ajax.call(this, '/login', this.data, (data, err) => {
                            this.loading = false;
                            if (!err) {
                                storage.set('userInfo', data, () => {
                                    this.$router.replace(this.$route.query.url||'/article/list');
                                })
                            }
                        })
                    }
                })
            }
        },
        watch: {
            'form.nick_name'(){
                if(this.err.includes('昵称'))this.err = '';
            },
            'form.user_name'(){
                if(this.err.includes('帐号'))this.err = '';
            },
			'form.user_tel'(){
			    if(this.err.includes('手机'))this.err = '';
			},
			'form.user_email'(){
			    if(this.err.includes('邮箱'))this.err = '';
			}
        }
    };
</script>

<style lang="less">
    .login {
		background-image: linear-gradient(to right , #7A88FF, #7AFFAF);
        background-size: cover;
        .el-dialog__body{
            padding-bottom:0
        }
        .content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -70%);
            background: #fff;
            background-clip: padding-box;
            box-shadow: 0 6px 40px rgba(0,0,0,.4);
            padding: 16px;
            width: 30%;
            min-width: 300px;
            max-width: 400px;
            border-radius: 10px;
            .logo {
				h1 {
					text-align: center;
					font-size: 40px;
					font-family: cursive;
					
					display: block;
					width: 100%;
					height: 100px;
					/*渐变背景*/
					background-image: -webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%,
						#ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
					color: transparent;
					/*文字填充色为透明*/
					-webkit-text-fill-color: transparent;
					-webkit-background-clip: text;
					/*背景剪裁为文字，只将文字显示为背景*/
					background-size: 200% 100%;
					/*背景图片向水平方向扩大一倍，这样background-position才有移动与变化的空间*/
					/* 动画 */
					animation: masked-animation 3s infinite linear;
				}
                height: 64px;
                margin-bottom: 15px;
            }
            .el-button {
                margin-left:20px;
                float:right
            }
        }
    }
	
	@keyframes masked-animation {
		0% {
			background-position: 0 0;
			/*background-position 属性设置背景图像的起始位置。*/
		}
	
		100% {
			background-position: -100% 0;
		}
	}
	
	
</style>
