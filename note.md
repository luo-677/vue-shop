1. 当前后端不存在跨域的情况时，使用cookie或者session的方式进行状态验证，但需要进行跨域时，使用token的方式进行状态验证。
2. 在项目开发中，要使用分支来开发新功能，确保代码不会出现毁灭性错误。
   1. git checkout -b xxxx 创建新的分支
   2. git branch 查看所有分支
   3. git checkout xxxx 切换到对应的分支
3. vue中使用async+await出现的问题及解决方案
   1. npm i babel-plugin-transform-runtime --save-dev
   2. npm i babel-runtime --save
   3. "plugins":["@babel/plugin-transform-runtime"]
4. 配置格式化工具
   1. .prettierrc文件，新增引号和分号规则
   2. .eslintrc.js文件，修改空格规则
   3. 使用 yarn lint --fix 进行自动修复错误
5. 修改标签自带属性，可以在组件中写两个style标签，一个全局，一个局部，element全局属性大于局部属性
6. 修改样式还可以直接写在标签内部