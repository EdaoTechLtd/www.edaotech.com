# 说明

本项目为翼道iKey官网站点项目，主要用于最新官网终结版本的源码管理

# 编译说明

## 工具链

* Ruby
* Jekyll

## 依赖

请先执行

```bash
$ gem install
```

安装相关的依赖组件

## 编译

执行以下命令可以生成静态站点，静态的站点目录为 `_site`

```bash
$ jekyll generate
```

## 本地测试

```bash
$ jekyll serve
```

然后默认访问 `http://127.0.0.1:4000` 即可访问

# 发布

TODO: 发布 —`_site` 目录到公网的服务器即可
