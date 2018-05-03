//字符串首字母大写
String.prototype.capitalize = () =>{
	console.log(this)
   var [first, ...rest] = this;
   var result = first.toUpperCase() + rest.join('').toLowerCase();
   return result;
}
