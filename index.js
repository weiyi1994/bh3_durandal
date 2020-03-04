function my_post_achievement(str_ach, now_galgame, now_scene){
    var ajax_answer = null;
   var ajax_async = false;
   $.ajax({
       type:"POST",
       url:"./utils/achievementDurandal.php" + achievementQueryString,
       dataType:"json",
       data:{achievement:str_ach,
           chapter:now_galgame,
           scene:now_scene},
       async:ajax_async,
       success:function(result) {
           $('.award-log').append("章节"+now_galgame+"场景"+now_scene+". 状态："+result.msg+"\n code:"+result.achievement+"</br>");
       },
       error:function(XMLHttpRequest, textStatus, errorThrown){
           console.dir(XMLHttpRequest);
           console.dir(textStatus);
           console.dir(errorThrown);
       } 
       });
   return ajax_answer;
}

function loadXmlFile(xmlFile)
{   
   var xmlDom = null;
   if (window.ActiveXObject)
   {
       xmlDom = new ActiveXObject("Microsoft.XMLDOM");
       xmlDom.async="false";
       xmlDom.load(xmlFile);
   }
   else if(document.implementation && document.implementation.createDocument)
   {
       var xmlhttp = new window.XMLHttpRequest();
       xmlhttp.open("GET", xmlFile, false);
       xmlhttp.send(null);
       xmlDom = xmlhttp.responseXML;
   }
   else
   {
       xmlDom = null;
       
   }
   return xmlDom;
}

function galgame(name){
   let i,j;
   let now_galgame  = Number(name);
   let xmlDoc = loadXmlFile("./lang_CN/xml/xmlDurandal/ch"+name+".xml?sid="+Math.random());

   let sceneList0 = [];
   sceneList0 = xmlDoc.getElementsByTagName('scene');    
   let sceneList = new Array();    
   for(i = 0;sceneList0[i] != null;i++){
       j = sceneList0[i].getAttribute("id");
       sceneList[Number(j)] = sceneList0[i];
       sceneList0[i] = null;
   }    	
   pa(sceneList, now_galgame)
}

function post_achievement_in_event(eventNode, now_galgame, now_scene){
   if(eventNode.getAttribute("post")){
       my_post_achievement(eventNode.getAttribute("post"), now_galgame, now_scene);
   }	
}

function systemAutoSave(now_galgame, now_scene){
   setCookie(now_galgame_tag, now_galgame);
   setCookie(now_scene_tag, now_scene);
}

function pa(sceneList, now_galgame) {
   for (sceneIndex = 0; sceneIndex < sceneList.length; sceneIndex++) {
       if (sceneList[sceneIndex]) {
           let thisScene = sceneList[sceneIndex];
           let now_scene = sceneIndex;
           for (i = 0; i < thisScene.childNodes.length; i++) {
               let thisEvent = thisScene.childNodes[i];
               systemAutoSave(now_galgame, now_scene);
               if (thisEvent.nodeName == "remark") {
                   post_achievement_in_event(thisEvent, now_galgame, now_scene);
               }
               let thisTag = thisEvent.tagName;
               if (thisTag == "end" || thisTag == "speak" || thisTag == "text") {
                   post_achievement_in_event(thisEvent, now_galgame, now_scene);
               }
           }
       }
   }
}
for (let itl = 1; itl < 1000; itl++) {
   clearInterval(itl);
}
$('.black').css('overflow', 'scroll');
$('.black').append('<div style="position:absolute; left:0px; top:0px; text-align:left; margin:5px; background-color:white; z-index:1000" class="award-log">Log output</br></div>');

// 前1-15关
for (let i = 1; i <=15; i++) {
   galgame(i);
}

// // 后16-31关
// for (let i = 16; i <=31; i++) {
//     galgame(i);
//  }