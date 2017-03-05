var num=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
var colorarray=[['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','','']];
var ws;
var prevColor='';
var color='';
var win=0;
var player=[['','red'],['','green']];
var pid=1;
var cid=0;
var id='',name='',img='',email='';
			function onSignIn(googleUser) {

					var profile = googleUser.getBasicProfile();

					id=profile.getId();

					name=profile.getName();

					img=profile.getImageUrl();

					email=profile.getEmail();

					console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.

					console.log('Name: ' + profile.getName());

					console.log('Image URL: ' + profile.getImageUrl());
					console.log('Email: ' + profile.getEmail());
					//sendName();
					document.getElementById('ownimage').innerHTML="<img src="+img+" class='imgclass'>";
			}
			//var name=prompt("enter your name");
			function checkgame(x,y)
			{	var inputs=document.getElementsByTagName('tr');

				var arr=['onclicked',x,y,name];
				jarr=JSON.stringify(arr);

				//block multiple moves and send data to server.
				if(colorarray[x][y]=='' || colorarray[x][y]==color){
					for(var i=0; i<inputs.length; ++i)
						inputs[i].style.pointerEvents ='none';
					ws.send(jarr);
				}
				else {
					console.log('cant click here');
					popups(['pop','cant click here']);
				}
			}
			function initiate(jdec)
			{	var x=jdec[1];
				var y=jdec[2];
				num[x][y]++;
				var pt=""+x+y;
				document.getElementById(pt).innerHTML=num[x][y];
				check(x,y,num[x][y],color);
				//checkWin();
			}

			function check(x,y,value,color)
			{
				if(value==2)
				{
					if((x==0&&y==0) || (x==8&&y==0) || (x==0&&y==5) || (x==8&&y==5))
						brkblk(x,y,color);
				}
				if(value==3)
				{
					if((x==0) || (x==8 || (y==0) || (y==5)))
						brkblk(x,y,color);
				}
				if(value==4)
				{
						brkblk(x,y,color);
				}
				draw(x,y,color);
				checkWin();
			}
			function brkblk(x,y,color)
			{	colorarray[x][y]='';
				num[x][y]=0;
				var pt=""+x+y;
				if(x!=0)
				{	colorarray[x-1][y]=color;
					num[x-1][y]++;
					check(x-1,y,num[x-1][y],color);
				}
				if(x!=8)
				{ colorarray[x+1][y]=color;
					num[x+1][y]++;
					check(x+1,y,num[x+1][y],color);
				}
				if(y!=5)
				{ colorarray[x][y+1]=color;
					num[x][y+1]++;
					check(x,y+1,num[x][y+1],color);
				}
				if(y!=0)
				{ colorarray[x][y-1]=color;
					num[x][y-1]++;
					check(x,y-1,num[x][y-1],color);
				}
			}
			function draw(x,y,color)
			{
				var pt=""+x+y;
				var imgdiv=document.getElementById(pt);
				if(num[x][y]==0){
					document.getElementById(pt).innerHTML="";
					colorarray[x][y]='';
				}
				if(num[x][y]==1){
					if((x==0 && y==0) || (x==8 && y==0) || (x==0 && y==5) || (x==8 && y==5)){
						document.getElementById(pt).innerHTML="<img src=/images/"+color+'Single.png' + " width=45px height=45px class='ballrotate'/>";
					}
					else{
					document.getElementById(pt).innerHTML="<img src=/images/"+color+'Single.png' + " width=45px height=45px/>";
					}
					colorarray[x][y]=color;
				}
				if(num[x][y]==2){
					if(x==0 || y==0 || x==8 || y==5){
						document.getElementById(pt).innerHTML="<img src=/images/"+color+'Double.png' + " width=45px height=45px class='ballrotate'/>";
					}
					else {
						document.getElementById(pt).innerHTML="<img src=/images/"+color+'Double.png' + " width=45px height=45px class='ballslowrotate'/>";
					}
					colorarray[x][y]=color;
				}
				if(num[x][y]==3){
					document.getElementById(pt).innerHTML="<img src=/images/"+color+'Triple.png' + " width=45px height=45px class='ballrotate'/>";
					colorarray[x][y]=color;

				}
			}



function setupChat(){
	var HOST=location.origin.replace(/^http/,'ws');
	ws=new WebSocket(HOST);
	setInput(ws);
	write("           CHAIN REACTION           ")
	write("       developed by Blesson thomas        ");
	ws.addEventListener("open",function(){
		write(">>>opened connection");
		preloadimages(['/images/redSingle.png', '/images/greenSingle.png', '/images/redDouble.png','/images/greenDouble.png','/images/redTriple.png','/images/greenTriple.png']);
	},false);
	ws.addEventListener("message",function(e){
		var recvdata=JSON.parse(e.data);
		if(recvdata[0]=='updateui'){
			updateui(recvdata);
		}
		else if (recvdata[0]=='initiate') {
			initiate(recvdata);
		}
		else if (recvdata[0]=='initializePlayer') {
			initializePlayer(recvdata[1]);
		}
		else if (recvdata[0]=='logsContent'){
			logsContent(recvdata);
		}
		else if (recvdata[0]=='popups'){
			popups(recvdata);
		}
		else if (recvdata[0]=='global_post'){
			global_post(recvdata);
		}
		else if (recvdata[0]=='typing'){
			typing(recvdata);
		}
		else if (recvdata[0]=='nottyping'){
			nottyping(recvdata);
		}
		else if (recvdata[0]=='playersleft'){
			playersleft();
		}
	},false);
	ws.addEventListener("close",function(){
		write(">>>connection closed");
		popups(['pop',"connection closed try reloading."]);
	},false);

}

//onload call
window.addEventListener("load",setupChat,false);

function sendName(){
	var arr=['initializePlayer',name];
	var data=JSON.stringify(arr);
	ws.send(data);
}
function write(str){
	console.log(str);
	str=["logsContent",str,'black'];
	logsContent(str);
}
function updateui(udata){
	prevColor=color;
	color=udata[3];
	console.log(player);
	console.log(udata[1],udata[2],udata[3]);
	var inputs=document.getElementsByTagName('tr');
	document.getElementById('dispname').innerHTML=udata[2]+"'s turn";
	document.getElementById('dispname').style.color=color;
	document.getElementById('chcol').style.border="2px solid "+color;
  for(var i=0; i<inputs.length; ++i)
	inputs[i].style.pointerEvents =udata[1];
}
function initializePlayer(pdata) {
	player=pdata;
}
function checkWin()
{
 var a=0,b=0,c=0;
 for(i=0;i<9;i++)
  for(j=0;j<6;j++)
  {
    if(num[i][j]!=0)
     a++;
    if(colorarray[i][j]==player[0][1])
     b++;
    else if(colorarray[i][j]==player[1][1])
     c++;
  }
 if(a==b && a>=2)
 {
	 document.getElementById('backcover').style.display='block';
   document.getElementById('wonname').innerHTML=player[0][0]+" won";
	 num=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];

	 //location.reload();
	 //player=[['','red'],['','green']];
	 ws.send(JSON.stringify(['reinit']));
	 //location.reload();
 }
 if(a==c && a>=2)
 {
	 document.getElementById('backcover').style.display='block';
	 document.getElementById('wonname').innerHTML=player[1][0]+" won";
	 num=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];

	 //location.reload();
	 //player=[['','red'],['','green']];
	 ws.send(JSON.stringify(['reinit']));
	 //location.reload();
 }
}

function preloadimages(arr){
    var newimages=[];
    var arr=(typeof arr!="object")? [arr] : arr ;//force arr parameter to always be an array
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image();
        newimages[i].src=arr[i];
    }
}

function displayLogs(){
	document.getElementById('logs').style.display='block';
}
function closeLogs() {
	document.getElementById('logs').style.display='none';

}
function logsContent(data) {
	var outdiv=document.getElementById('logsbody');
	var idiv=document.createElement('div');
	idiv.id=pid+'';
	idiv.style.color=data[2];
	outdiv.appendChild(idiv);
	document.getElementById(pid+'').innerHTML=data[1];
	pid+=1;
}
function popups(data){
	 document.getElementById('popup').innerHTML=data[1];
	 var x = document.getElementById("popup");
	 x.className = "show";
	 setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function reloadpage(){
	location.reload();
}

function open_box(){
	document.getElementById('chat').style.display='block';
	//document.getElementById('slideopen').style.display='none';
	document.getElementById('malert').src='/images/close.png';
	document.getElementById('malert').onclick=chatclose;
}

function global_post(msg){
	//var data=JSON.parse(msg);
	//var chat_body=document.getElementById('');
	//data=capitalizeFirstLetter(data);
	var global_chat=document.getElementById('chatBody');
	var wrp=document.createElement('div');
	var msgdiv=document.createElement('div');
	var textdiv=document.createElement('div');
	var imgdiv=document.createElement('img');
	imgdiv.src=msg[2];
	imgdiv.className='imgclass';
	textdiv.id=cid+""+"c";
	wrp.className='wrp';
	textdiv.className="ctext";
	msgdiv.className="global_msg";
	msgdiv.appendChild(textdiv);
	wrp.appendChild(imgdiv);
	wrp.appendChild(msgdiv);
	global_chat.appendChild(wrp);
	document.getElementById(cid+""+"c").innerHTML=msg[1];
	cid+=1;
	global_chat.scrollTop=global_chat.scrollHeight;
	alertmsg();
}

function sendmsg(){
	var data=document.getElementById('global_input').value;
	if(data.charAt(0)=="" || data.charAt(0)==" "){
		alert("invalid spaces");
		return false;
	}
	if(/[<>]/.test(data)){
		alert("invalid <>");
		return false;
	}
	data="<div style='font-size:15px;font-weight:bold;color:black;'>"+name+":</div>"+data;
	var jstr=JSON.stringify(['global_post',data,name,img]);
	ws.send(jstr);
	var global_chat=document.getElementById('chatBody');
	var wrp=document.createElement('div');
	var msgdiv=document.createElement('div');
	var textdiv=document.createElement('div');
	textdiv.id=cid+""+"c";
	textdiv.className="metext";
	msgdiv.className="selftext";
	wrp.className='wrp';
	msgdiv.appendChild(textdiv);
	wrp.appendChild(msgdiv);
	global_chat.appendChild(wrp);
	document.getElementById(cid+""+"c").innerHTML=data;
	cid+=1;
	global_chat.scrollTop=global_chat.scrollHeight;
	document.getElementById('global_input').value="";
}

function setInput(ws){
		var input = document.getElementById("global_input");
		input.addEventListener("keydown",function(e){
				ws.send(JSON.stringify(['typing',name]));
			if(e.keyCode==13){
				sendmsg();
				this.value="";
				}
			});
}

function alertmsg() {
	if(document.getElementById('chat').style.display=='block')
	document.getElementById('malert').src='/images/close.png';
	else {
		document.getElementById('malert').src='/images/malert.png';
	}
	//document.getElementById('slideopen').style.left='330px';
}
function chatclose() {
	document.getElementById('chat').style.display='none';
	document.getElementById('malert').src='/images/mail.png';
	document.getElementById('malert').onclick=open_box;
	//document.getElementById('typing').className='stoppedtyping';

}
function typing() {
	document.getElementById('typing').className='typing';
	window.setTimeout(nottyping,3500);
}

function nottyping() {
	document.getElementById('typing').className='stoppedtyping';
}

function play() {
	if(name!='')
	{	sendName();
		document.getElementById('gsignin').style.display='none';
	}
	else {
		alert('sign in first');
	}
}

function playersleft() {
	document.getElementById('backcover').style.display='block';
	document.getElementById('wonname').innerHTML="All players left";
	//ws.send(JSON.stringify(['reinit']));
}
