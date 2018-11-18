//3.04 by SamoVaR 09.2007
function SpylogCounter(_sp_config)
{
	this.sp_config = _sp_config;

	var f = Math.floor(this.sp_config.counter / 100); 
	var s = this.sp_config.counter - f * 100; 
	this.dm = "u" + spylog_str_pad(f.toString(), 3, '0') + "." + spylog_str_pad(s.toString(), 2, '0') + ".spylog.com"; 
	
	this.c = 1;
	if( !document.cookie ) {
		document.cookie = "testCookie=1; path=/";
		this.c = document.cookie?1:0;
	}
	
	this.n = (navigator.appName.toLowerCase().substring(0, 2) == "mi") ? 0 : 1; 
	if( parent != window ) {
		this.r=parent.document.referrer;
		this.r1 = document.referrer;
	}
	else this.r= document.referrer;
	
	this.pg = this.sp_config.page;//window.location.href;
	this.fr = (self != top)?1:0;
	var spylog_js=1;
	var js_version= '<scr'+'ipt language="javascr'+'ipt">spylog_js=1;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt1.1">spylog_js=1.1;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt1.2">spylog_js=1.2;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt1.3">spylog_js=1.3;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt1.4">spylog_js=1.4;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt1.5">spylog_js=1.5;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt1.6">spylog_js=1.6;</scr'+'ipt>';
	js_version += '<scr'+'ipt language="javascr'+'ipt"></script>';
	document.write(js_version);
	this.sl=spylog_js;
	this.fl = '';
	
	this.fix = function()
	{
		if (navigator.plugins && navigator.plugins.length) {
			for (var ii=0;ii<navigator.plugins.length;ii++) {
				if (navigator.plugins[ii].name.indexOf('Shockwave Flash')!=-1) {
					this.fl=navigator.plugins[ii].description.split('Shockwave Flash ')[1];
					break;
				}
			}
		} 
		else if (window.ActiveXObject) {
			for (var ii=10;ii>=2;ii--) {
				try {
					var f=eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash."+ii+"');");
					if (f) { this.fl=ii + '.0'; break; }
				}
				catch(ee) {}
			}
			if((this.fl=="")&&!this.n&&(navigator.appVersion.indexOf("MSIE 5")>-1||navigator.appVersion.indexOf("MSIE 6")>-1)) {
				FV=clientInformation.appMinorVersion;
				if(FV.indexOf('SP2') != -1)
				this.fl = '>=7';

			}
		}
	}
	this.fix();

	this.p = this.sp_config.p;
	
	switch (this.sl) {
		default:
		case '1.2':
		var Ms = screen;
		this.px = (this.n == 0) ? Ms.colorDepth : Ms.pixelDepth;
		this.s = "&wh=" + Ms.width + 'x' + Ms.height + "&px=" + this.px;
		case '1.1':
		Mpl = "";
		this.j = (navigator.javaEnabled()? "Y" : "N");
		case '1':
		case '1.0':
	}
	
	this.printdebug=function(_title)
	{
		switch(this.p) {
			case 0:
			case 1:	str="page"; 	break;
			case 3:
			case 4:	str="click " +this.pg+". additional: "+_title;	break;
			case 5:	str="submit "+this.pg+". additional: "+_title;	break;
			default:str="p="+this.p;break;
		}
		this.sp_config.debugnode.innerHTML="- load: "+str+"<br>"+this.sp_config.debugnode.innerHTML;
	}
	
	
	this.load = function(_title)
	{
		if( this.sp_config.debugnode ) 	this.printdebug(_title);
		
		this.a_url = "http://" + this.dm + "/cnt?cid=" + this.sp_config.counter + "&f=3&p=" + this.p + "&rn=" + Math.random(); //url 
		this.counter_url = "http" + (document.location.protocol == 'https:'?'s://sec01-hits.spylog.com/cnt.cgi':('://'+ this.dm + '/cnt'))
			+ "?cid=" + this.sp_config.counter
			+ "&p=" + this.p
			+ "&rn=" + this.sp_config.rnd
			+ "&c=" + this.c
			+ "&t=" + (new Date()).getTimezoneOffset()
			+ '&title=' + escape(sp_substr(_title))
			+ "&sl=" + this.sl
			+ ((this.sp_config.part!='')?'&partname=' + spylog_escape(this.sp_config.part.replace(/^\s+/, '').replace(/\s+$/, '')):'')
			+ '&fl=' + escape(this.fl) 
			+ this.s
			+ '&j=' + this.j
			+ (this.r1?("&r1=" + escape(sp_substr(this.r1))):'')
			+ "&r=" +escape(sp_substr(this.r))
			+ "&fr=" + this.fr
			+ "&pg=" + escape(sp_substr(this.pg));
		switch(this.p){
			case 5:
			case 4:
			case 3:
				this.sp_img = new Image();
				this.sp_img.src = this.counter_url;
				if( this.sp_config.isAuxPage ) {
					var pageTo=this.pg;
					this.sp_img.onload=function(_T)	
					{	 
						//IE referer set
						if(navigator.appName.toLowerCase().substring(0, 2) == "mi"){
							var tmp_link = document.createElement('a');
							tmp_link.href = pageTo;
							document.body.appendChild(tmp_link);
							tmp_link.click();
						}
						else {
							window.location.href=pageTo;	
						}	
					}
				}
				break;
			case 0:
			default:
				My  = "<a href='" + this.a_url + "' target='_blank'><img src='"+this.counter_url+"' border=0 alt='SpyLOG'></a>";
				document.write(My);
				break;
		}
	}
	this.load( this.sp_config.title );
	
	
	//===
	
	this._setAuxPage=function(_aNode)
	{
		if( !_aNode.href.match(/^javascript:/) ) {
			var sp_eventNeed = _aNode.getAttribute('sp_eventNeed');
			var title= sp_substr( (sp_eventNeed != ''&& sp_eventNeed != null)?('ADVID='+sp_eventNeed+';'):'');
			_aNode.href=this.sp_config.auxPage+"_sp_rnd="+this.sp_config.rnd+"&_sp_title="+title+"&_sp_page="+_aNode.href;
		}	
	}
	
	this._addEventListener=function(_aNode)
	{
		_aNode.addEventListener('click',function(T)		{	_SpylogCounterObject.func_pro(T,3);	},false);
		_aNode.addEventListener('mousedown',function(T)	{	_SpylogCounterObject.func1(T);		},false);
	}
	
	this._attachEvent=function(_aNode)
	{
		_aNode.attachEvent('onclick',function(T)  		{	return _SpylogCounterObject.func_pro(T,3); 	});	
		_aNode.attachEvent('onmousedown',function(T)	{	_SpylogCounterObject.func1(T); return false;	});	
	}
	
	this.func_pro = function ()
	{
		this.p = arguments[1];
		if(!this.n) {
			e= window.event;
			this.t = e.srcElement;
			if(this.p!=5) {
				while(this.t.tagName.toString().toLowerCase()!='a')	
					this.t = this.t.parentElement;
			}	
		}
		else 
			this.t = arguments[0].currentTarget;
		var sp_eventNeed = this.t.getAttribute('sp_eventNeed');
		var title=(sp_eventNeed != ''&& sp_eventNeed != null)?('ADVID='+sp_eventNeed+';'):'';
	
		this.r = document.location.href;
		if(this.p==4 || this.p==3)
			this.pg = this.t.href;
		else if(this.p==5)
			this.pg = this.t.action;
		this.load(title);
	}
	
	this.func1 = function(e)
	{
		if( undefined==e )		btn=window.event.button;	
		else btn=e.which;
		if( undefined==btn )	btn=e.button;
		if( 1==btn )  return true;
		this.func_pro(e,4); 
	}
	
	this.spylog_onunload = function (_look)
	{
		var sp_links = document.links;
		var sp_size = sp_links.length;
		var sp_hostname = window.location.hostname;
		var sp_action = '';
		for(var i=0;i<sp_size; i++){
			if( sp_links[i].getAttribute('sp_eventWasSet') ) continue; 
			plus=sp_links[i].getAttribute('sp_eventNeed')?1:0;
			if( sp_links[i].href.match(/^javascript:/) && !plus ) continue;			
			
			if( (sp_links[i].hostname!=sp_hostname && _look=='ext') 
				|| _look=='all' 
				|| plus==1 ) {

				sp_links[i].setAttribute('sp_eventWasSet','on'); 

				this.ancorHandler(sp_links[i]);
			}
		}
	}
	
	this.spylog_onsubmit_form = function ()
	{
		var sp_forms = document.forms;
		var sp_size = sp_forms.length;
		for(var i=0;i<sp_size; i++){
			if( sp_forms[i].getAttribute('sp_eventWasSet') ) continue; 
			if( sp_forms[i].getAttribute('sp_eventNeed') ){
				
				sp_forms[i].setAttribute('sp_eventWasSet','on');  
				if(document.addEventListener) 
					sp_forms[i].addEventListener('submit',function(T)  {	_SpylogCounterObject.func_pro(T,5);	},	false);
				else 
					sp_forms[i].attachEvent('onsubmit',function(T)  {	_SpylogCounterObject.func_pro(T,5);	} );	
			}
		}
	}

	this.spylog_onload = function ()
	{
		this.spylog_onunload(this.sp_config.fix_link); 
		this.spylog_onsubmit_form();
		if(!window.flag)	setTimeout("_SpylogCounterObject.spylog_onload()",200);
	}
	
	this.runTrackLinks = function () 
	{
		if('none'==this.sp_config.fix_link) return;

		if( !this.sp_config.auxPage ) {
			if(document.addEventListener) 
				this.ancorHandler=this._addEventListener;
			else	
				this.ancorHandler=this._attachEvent;
		}
		else {		
			//opera is not work correct this
			if( navigator.userAgent.match(/opera/i) ) return;		
			this.ancorHandler=this._setAuxPage;
		}	
			
		window.flag = 0; 
		if(window.addEventListener)  
			window.addEventListener("load", function()	{	window.flag=1;_SpylogCounterObject.spylog_onload();	}, false);
		else if (window.attachEvent) 
			window.attachEvent("onload",function()		{	window.flag=1;_SpylogCounterObject.spylog_onload();	} );
		this.spylog_onload();
	}

	

	this.selectAreaByID = function (_id)
	{
		var al = document.getElementById(_id);  
		if(al) this.scanTags(al,'sp_eventNeed',_id);
	}

	this.scanTags = function (_n,_attr_name, _attr_val)
	{
		if(_n.nodeType==1){
			var tag = _n.tagName.toString().toLowerCase();
			if( ('a'==tag || 'form'==tag) && !_n.getAttribute(_attr_name) ) 
				_n.setAttribute(_attr_name,_attr_val);
		}
		var children = _n.childNodes;
		for(var i=0;i < children.length; i++)  this.scanTags(children[i],_attr_name, _attr_val);
		return;
	}
	
}
//---

function Spylog_Config()
{

	this.jsnode=false;
	
	this._paramFromAttr=function(_name)			{	return this.jsnode.getAttribute(_name);	}
	this._paramFromVar=function(_name)			
	{	
		try {
			return eval("spylog_"+_name);			
		}
		catch( ee) {
			return undefined;
		}	
	}
	
	if( "undefined"!=typeof(spylog_counter) ) {
		this.getParam=this._paramFromVar;
	}	
	else {	
		this.jsnode=document.getElementById('spylog_code');
		this.getParam=this._paramFromAttr;
	}	
	
	this.counter = this.getParam('counter');
	dnId = this.getParam('debug');
	if(dnId) 
		this.debugnode=document.getElementById(dnId);
	else	
		this.debugnode=0;
		
	this.isAuxPage=false;	

	var auxPage=this.getParam('auxPage');	
	if( "="==auxPage ) {
		this.isAuxPage=true;
		this.p=3;
		this.part="";
		this.fix_link='none';
		this.auxPage="";
		var str=new String(window.location.href);
		var res=str.match(/^(.*[\&|\?]{1}_sp_rnd=)(.*)(\&_sp_title=)(.*)(\&_sp_page=)(.*)$/);
		this.rnd=res[2];
		this.title=( res[4] )?res[4]:"";
		this.page=( res[6] )?res[6]:"";
	
		var cookieLabel=escape(this.page)+this.rnd;
		res=document.cookie.match(/_sp_label=([^;]+)/);
		if( res && res[1]==cookieLabel ) {	
			document.cookie = "_sp_label=0; path=/";
			this.page=document.referrer;
			history.back();
		}	
		else 
			document.cookie = "_sp_label="+cookieLabel+"; path=/";
		
		//reinsurance
		this.redirect=function()	{	window.location.href=this.page;	}
		setTimeout("_SpylogConfigObj.redirect()",2000);		
		
	}
	else {
		this.page = window.location.href;
		this.title=document.title;
		this.rnd=Math.random();

		if( !auxPage) this.auxPage=false;
		else {
			var res=auxPage.match(/^\+(.*)$/);
			if( res ) {	//if auxPage like "+[something]" - add [something] to this page
				
				var pagePart=this.page.match(/^([^\?\#]*)(\?[^\#]*)?(\#.*)?$/);
				if( pagePart[2] && pagePart[2]!="?")
					this.auxPage=pagePart[1]+pagePart[2]+"&"+res[1];
				else	
					this.auxPage=pagePart[1]+"?"+res[1];
			}
			else		
			    this.auxPage=auxPage;
			
			this.auxPage+=this.auxPage.match(/^.*\?.+/)?"&":"?";
		}
		this.part = this.getParam('part');
		if( !this.part ) this.part='';
		this.p = parseInt( this.getParam('page_level') );
		if( isNaN(this.p) || this.p<0 || (this.p>1 && this.p!=254) ) this.p = 0;
		this.fix_link = this.getParam('track_links');
		if( !this.fix_link ) this.fix_link ='ext';
		
	}
}

function spylog_escape(str)
{	
    var unicod = '';
    var len = str.length;
    for (var i = 0; i < len; i++) {
		var cod = str.charCodeAt(i);
		if (cod < 255) {
			unicod += str.charAt(i);
			continue;
		}
		cod = cod.toString(16);
		unicod += '%u' + spylog_str_pad(cod.toLowerCase(), 4, '0');	
    }
    return unicod;
}

function spylog_str_pad(str, len, pad)
{
	var length = str.length;
	if (length >= len)	return str;
	var count = len - length;
	for (var i = 0; i < count; i++)	str = pad + str;
	return str;
}

function sp_substr(_href)
{
	if(_href.length>250){
		var end_str = _href.indexOf('?')
		if(end_str!=-1)			
			_href = _href.slice(0,end_str);
	}
	
	if(_href.length>250)	_href = _href.substring(0,250);
	return _href; 		
}

var undefined;
if( undefined==_SpylogConfigObj ) {
	var _SpylogConfigObj = new Spylog_Config();
	//str=""; for(var k in _SpylogConfigObj )	str+=k+"="+_SpylogConfigObj[k]+"\n";alert(str);	
	var _SpylogCounterObject = new SpylogCounter( _SpylogConfigObj );
	_SpylogCounterObject.runTrackLinks();
}	
