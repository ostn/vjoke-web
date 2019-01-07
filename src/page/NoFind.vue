<template>
    <div>
        404页面没找到！
    </div>
</template>

<script>
    module.exports = {
        name: 'not',
        mounted() {
			this.$message({
				message: "正在跳转到登陆界面",
				duration: 2000
			})
			setTimeout(() => {
				this.$router.push('/login');
			}, 2000)
         }
    }
</script>

<style lang="less" scoped>
    div{
        font-size:20px;
        line-height: 50px;
        color:#555;
        max-width:900px;
        margin:auto;
        height:100%;
        background: url('../assets/404.jpg') no-repeat center;
    }
</style>
