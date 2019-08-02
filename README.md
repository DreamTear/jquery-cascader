# 级联选择
这是一个基于jquery的级联选择插件，插件中使用的bootstrap的样式
![演示图](/img/截图20190725143553.png)

# 使用方法
```html
<input id="domId" value="2-1"/>
```
```javascript
var data = [
	{
		id: '1',
		name: 'text1',
		children: [
			{name: 'text1-1', id: '1-1'},
			{name: 'text1-2', id: '1-2'},
			{name: 'text1-3', id: '1-3'}
		]
	},
	{
		id: '2',
		name: 'text2',
		children: [
			{name: 'text2-1', id: '2-1'},
			{name: 'text2-2', id: '2-2'},
			{name: 'text2-3', id: '2-3'}
		]
	},
	{
		id: '3',
		name: 'text3',
		children: [
			{name: 'text3-1', id: '3-1'},
			{name: 'text3-2', id: '3-2'},
			{name: 'text3-3', id: '3-3'}
		]
	},
];
$('#domId').cascader({
	displayField: 'name',
	valueField: 'id',
	separator: '/',
	data: data
});
```
级联选择在初始化的时候回去读取input的value进行初始化

# 配置项

## displayField 

配置显示的字段名称，默认值为'name'

## valueField 

配置提交的字段名称，默认值为'id'

## separator 

配置显示字段的连接符，默认值为'/'

## data

级联菜单的数据，含有子项的需要有chidlren字段, 默认值为[]

## value

配置初始化时的默认值，还可以通过设置inpt的value的方式设置默认值

# API

## clearValue

清空当前选择的内容

```javascript
// 清空设置的值
$('#domId').cascader('clearValue');
```

## val

获取或设置vlaue，不传递参数时为获取value，传递参数时为设置value

```javascript
// 获取设置的值
$('#domId').cascader('val');
// 设置提交值
$('#domId').cascader('val', '3-3');
```

# EVENT

## change.cascader
参数：
	value 提交的值
	checkeditems 选中的节点到一级节点的数组

当选中内容发生改变时触发，如果某一项有子级，点击不会触发。
