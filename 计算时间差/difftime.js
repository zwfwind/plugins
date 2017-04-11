function diffTime(){
	var startDate = new Date();  //设置开始时间（现在）
	var endDate = "2017-05-23 00:00:00.000";//设置结束时间，注意时间格式是：2012-03-05 11:41:30.910
	endDate = new Date(Date.parse(endDate.replace(/\-/g, "/")));

	var date3=endDate.getTime()-startDate.getTime()  //时间差的毫秒数

	//计算出相差天数
	var days=Math.floor(date3/(24*3600*1000))
	 
	//计算出小时数
	var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000))
	
	//计算相差分钟数
	var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000))
	
	//计算相差秒数
	var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000)
	
	//输出结果
	document.getElementById("difftime").innerHTML = days+"天 "+hours+"小时 " + minutes+"分钟 " + seconds+"秒";
	t=setTimeout('diffTime()',500);		//每0.5秒自动刷新显示
}