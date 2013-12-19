SC.stringsFor("en-us",{"Alarms.Today.Message":"%{eventTitle} at %{date:h}:%{date:mm} %{date:a}","Alarms.Tomorrow.Message":"%{eventTitle} tomorrow at %{date:h}:%{date:mm} %{date:a}","Alarms.Future.Message":"%{eventTitle} on %{date:MM}/%{date:dd}/%{date:yyyy} at %{date:h}:%{date:mm} %{date:a}"});SteedOS.Alarms=SC.Object.create({ALARMS_FETCH_AFTER_INTERVAL:86100000,DISPLAY_PAST_ALARMS_THRESHOULD:-31000,BUTTONS_MINIMUM_MARGIN:30,BUTTON_LONG_TEXT_MARGIN:20,SMALL_BUTTON_MIN_WIDTH:57,dateRangeForAlarmsRequest:function(){var d=new Date(),f="%@1-%@2-%@3".fmt(d.getFullYear(),d.getMonth()+1,d.getDate()),e;d.setHours(d.getHours()+24);e="%@1-%@2-%@3".fmt(d.getFullYear(),d.getMonth()+1,d.getDate());return{startDate:f,endDate:e}},getCompleteMessageString:function(p,B){var o=SC.RenderContext.escapeHTML(p.title);if(!B||SC.typeOf(B)!==SC.T_ARRAY){return o}var A=new Date(),x=A.getDate(),r=A.getMonth()+1,q=A.getFullYear(),z=new Date(q,r-1,x,0,0,0,0),s=z.getTime();z.setHours(z.getHours()+24);var y=z.getTime();z.setHours(z.getHours()+24);var u=z.getTime(),w=new Date(B[1],B[2]-1,B[3],0,B[6],0,0),t=w.getTime(),v;if(t>=s&&t<y){v="Alarms.Today.Message".loc({eventTitle:o,date:w,dateFormatter:SC.DateFormatter})}else{if(t>=y&&t<u){v="Alarms.Tomorrow.Message".loc({eventTitle:o,date:w,dateFormatter:SC.DateFormatter})}else{if(t>=u){v="Alarms.Future.Message".loc({eventTitle:o,date:w,dateFormatter:SC.DateFormatter})}else{SC.error("This event alarm with guid [%@1] is for a past alarms and it should not have been returned in the fetch call.",p.guid)}}}return v},initializeAlarmControllers:function(){var f=SteedOS.pushController,d=f.shouldDisplayNotification("calendar"),e=f.shouldDisplayNotification("reminders");CW.notificationCenter.subscribeToNotification("notificationsPreferenceDidChange",this,this.initializeAlarmControllers);if(d){SteedOS.Alarms.calendarAlarmsController.fetchUpcomingAlarmsAndScheduleNextFetch()}if(e){SteedOS.Alarms.remindersAlarmsController.fetchUpcomingAlarmsAndScheduleNextFetch()}}});SteedOS.Alarms.iOSNotification=CW.iOSNotification.extend({contentView:SC.View.extend({classNames:"action-buttons",useStaticLayout:YES,layout:{width:"auto",right:10,height:22,centerY:0},childViews:["dismissAlarm","snoozeAlarm"],dismissAlarm:SC.ButtonView.design({useStaticLayout:YES,controlSize:SC.SMALL_CONTROL_SIZE,classNames:"dismiss-button",title:"Button.Close".loc(),action:"dismissAlarm"}),snoozeAlarm:SC.ButtonView.design({useStaticLayout:YES,controlSize:SC.SMALL_CONTROL_SIZE,classNames:"snooze-button",title:"Button.Snooze".loc(),action:"snoozeAlarm"}),isVisibleInWindowObserver:function(){if(this.get("layer")){var l=this.get("parentView"),t=l.$(".message"),s=l.$(".description"),r=this.get("dismissAlarm"),o=this.get("snoozeAlarm"),n=r.get("layer").className,p=SteedOS.Alarms.BUTTONS_MINIMUM_MARGIN,q,k,m;SC.prepareStringMeasurement("",n);q=SC.measureString(r.get("title")).width;k=SC.measureString(o.get("title")).width;SC.teardownStringMeasurement();if(q>57){p+=SteedOS.Alarms.BUTTON_LONG_TEXT_MARGIN}if(k>57){p+=SteedOS.Alarms.BUTTON_LONG_TEXT_MARGIN}m="right: "+(q+k+p)+"px";t.attr("style",m);s.attr("style",m);SC.debug("Computed style-right for message and description is: %@",m)}}.observes("isVisibleInWindow")})});sc_require("views/ios_notification");SteedOS.Alarms.BaseController=SC.Object.extend({_implicitPeriodicScheduler:null,_upcomingAlarms:[],_scheduledAlarmTimers:null,appManager:function(){var b=this.get("appName");return SteedOS.appManagerFor(b)}.property().cacheable(),alarmIcon:function(){return this.getPath("appManager.notificationIcon")}.property().cacheable(),fetchUpcomingAlarmsAndScheduleNextFetch:function(){var d=this.get("dataSource"),f=CW.notificationCenter,e=this._implicitPeriodicScheduler;d.fetchAlarms(this.get("appName"),this.fetchAlarmsSuccessCallback,this.fetchAlarmsFailureCallback);if(e){e.invalidate()}this._implicitPeriodicScheduler=SC.Timer.schedule({target:this,action:"fetchUpcomingAlarmsAndScheduleNextFetch",interval:SteedOS.Alarms.ALARMS_FETCH_AFTER_INTERVAL});f.subscribeToNotification("didReceivePushNotification",this,this.pushNotificationReceived);f.subscribeToNotification("notificationsPreferenceDidChange",this,this.invalidateAllScheduledAlarms)},refreshUpcomingAlarms:function(){this.invalidateAllScheduledAlarms();this.scheduleAllAlarms()}.observes("_upcomingAlarms"),invalidateAllScheduledAlarms:function(){SC.debug("* invalidateAllScheduledAlarms for : %@",this.get("appName"));var i=this._schedulediOSNotificationsHash,k=this._upcomingAlarms,o,p=[],m,l,n=this._scheduledAlarmTimers,j;if(k.length>0){k.forEach(function(a){o=a.guid;j=i[o];if(j){if(j.get("content")!==a){l=CW.hashDifferencesBreakdown(j.get("content"),a).different}if(l&&l.length>0){SC.info("Since something in the currently enqueued alarm [%@1] changed, we will remove it from the queue and schedule it again.",a.guid);i[o].remove();delete i[o]}else{p.push(o)}}})}for(o in i){if(p.indexOf(o)<0){m=i[o];if(m){SC.info("The alarm with guid [%@] was missing in the last fetch call. So, we will remove it from the notification queue.",o);m.remove();delete i[o]}}}if(n){n.forEach(function(a){a.invalidate()});this._scheduledAlarmTimers=null}},scheduleAllAlarms:function(){SC.debug("* scheduleAllAlarms for : %@",this.get("appName"));var k=this._upcomingAlarms;if(!k){return}var l=this,i=this._schedulediOSNotificationsHash,m=[],n=this.get("alarmIcon"),h=new Date().getTime(),j;k.forEach(function(d){if(!i[d.guid]){j=d.triggerDate;var b=new Date(j[1],j[2]-1,j[3],0,j[6],0,0),a=b.getTime();var e=(d.localStartDate||d.startDate),c=SteedOS.Alarms.getCompleteMessageString(d,e);m.push(SC.Timer.schedule({startTime:a,target:this,action:function(){var f=SteedOS.Alarms.iOSNotification.create({message:c,description:d.location,icon:n,automaticallyDismiss:NO,isDismissable:YES,dismissAlarm:function(){this.remove();l.acknowledgeAlarm(this.get("content"))},snoozeAlarm:function(){this.remove();l.snoozeAlarm(this.get("content"))},action:function(g){l.showItemInParentApp(g)},didCreateLayer:function(){var q=arguments.callee.base.apply(this,arguments),r=l.get("appName"),g=l.get("appManager");if(r==="reminders"&&!g.get("isReady")){SC.debug("* Reminders app is not running yet, so launching it in background to update badge count");g.getReadyInBackground()}return q}});f.set("content",d);l._schedulediOSNotificationsHash[d.guid]=f;CW.iOSNotification.enqueue(f);SC.info("Enqueued iOSNotification for alarm trigger at %@1",b)}}));l.set("_scheduledAlarmTimers",m);SC.info("An upcoming %@1 alarm is scheduled on %@2",l.get("appName"),b)}})},acknowledgeAlarm:function(c){var d=this.get("dataSource");d.acknowledgeAlarm(c,this.get("appName"))},snoozeAlarm:function(c){var d=this.get("dataSource");d.snoozeAlarm(c,this.get("appName"))},pushNotificationReceived:function(c){var d=this.get("appName");if(c.indexOf(d)===-1){return}SC.debug("%@ alarm controller: pushNotificationReceived, invalidating old alarms and fetching updates",d);if(this._implicitPeriodicScheduler){this._implicitPeriodicScheduler.invalidate()}this.fetchUpcomingAlarmsAndScheduleNextFetch()}});SteedOS.Alarms.calendarAlarmsController=SteedOS.Alarms.BaseController.create({dataSourceBinding:"SteedOS.Alarms.calendarDataSource",appName:"calendar",_schedulediOSNotificationsHash:{},fetchAlarmsSuccessCallback:function(d){var c=d.get("body");if(c&&SC.typeOf(c.AlarmTrigger)===SC.T_ARRAY){SteedOS.Alarms.calendarAlarmsController.set("_upcomingAlarms",c.AlarmTrigger)}return YES},fetchAlarmsFailureCallback:function(b){SC.info("Fetch Calendar alarms failed with a status code %@1.",b.get("status"));return YES},showItemInParentApp:function(i){SC.debug("Loading calendar application and highlight the event to which the alarm belongs.");var j=SteedOS.appController,h=i.get("content"),g=h.guid,f={steedos:{type:"Event",collectionGuid:h.pGuid,pGuid:g.substr(0,g.indexOf(":"))}};j.switchToApplicationWithNotification(this.get("appName"),f,i)}});SteedOS.Alarms.remindersAlarmsController=SteedOS.Alarms.BaseController.create({dataSourceBinding:"SteedOS.Alarms.remindersDataSource",appName:"reminders",_schedulediOSNotificationsHash:{},fetchAlarmsSuccessCallback:function(d){var c=d.get("body");if(c&&SC.typeOf(c.AlarmTrigger)===SC.T_ARRAY){SteedOS.Alarms.remindersAlarmsController.set("_upcomingAlarms",c.AlarmTrigger)}return YES},fetchAlarmsFailureCallback:function(b){SC.info("Fetch Reminders alarms failed with a status code %@1.",b.get("status"));return YES},showItemInParentApp:function(h){SC.debug("Loading reminders application and highlight the reminder to which the alarm belongs.");var i=SteedOS.appController,f=h.get("content"),g=f.guid,j={};j={steedos:{type:"Reminder",collectionGuid:f.pGuid,reminderGuid:g.substr(0,g.indexOf(":"))}};i.switchToApplicationWithNotification(this.get("appName"),j,h)}});SteedOS.Alarms.DataSource=SC.Object.extend({prepareRequest:function(e,g,f){var h=SteedOS.authController;e.queryParameter("dsid",h.getPath("user.dsid"));e.queryParameter("usertz",h.getPath("accountPreferences.timeZone"));e.queryParameter("lang",SC.Locale.currentLocale.language);e.notify(200,this,g);e.notify(0,this,f)},fetchAlarms:function(h,j,l){var g=CK.servicesController.getServiceUrlFor(h)+this.fetchAlarmsUrl,i=SteedOS.Alarms.dateRangeForAlarmsRequest(),k=COS.Request.getUrl(g);k.set("isJSON",YES);k.queryParameter("startDate",i.startDate);k.queryParameter("endDate",i.endDate);this.prepareRequest(k,j,l);k.send()},acknowledgeAlarm:function(h,g){var j={pGuid:h.pGuid,guid:h.guid},f=CK.servicesController.getServiceUrlFor(g)+this.acknowledgeAlarmUrl,i=COS.Request.postUrl(f,SC.json.encode(j));i.set("serviceName",g);this.prepareRequest(i,this.acknowledgeAlarmSucceeded,this.acknowledgeAlarmFailed);i.send()},acknowledgeAlarmSucceeded:function(b){SC.debug("Successfully acknowledged the alarm.");return YES},acknowledgeAlarmFailed:function(b){SC.info("Acknowledging alarm failed with a status code %@1.",b.get("status"));return YES},snoozeAlarm:function(h,g){var j={pGuid:h.pGuid,guid:h.guid},f=CK.servicesController.getServiceUrlFor(g)+this.snoozeAlarmUrl,i=COS.Request.postUrl(f,SC.json.encode(j));i.set("serviceName",g);this.prepareRequest(i,this.snoozeAlarmSucceeded,this.snoozeAlarmFailed);i.send()},snoozeAlarmSucceeded:function(b){SC.info("Alarm snooze was successful");return YES},snoozeAlarmFailed:function(b){SC.info("Alarm snooze failed with a status code %@1.",b.get("status"));return YES}});sc_require("data_sources/data_source");SteedOS.Alarms.calendarDataSource=SteedOS.Alarms.DataSource.create({fetchAlarmsUrl:"/ca/alarmtriggers/",acknowledgeAlarmUrl:"/ca/acknowledgeAlarm/",snoozeAlarmUrl:"/ca/snoozealarm/"});sc_require("data_sources/data_source");SteedOS.Alarms.remindersDataSource=SteedOS.Alarms.DataSource.create({fetchAlarmsUrl:"/rd/alarmtriggers/",acknowledgeAlarmUrl:"/rd/acknowledgeAlarm/",snoozeAlarmUrl:"/rd/snoozealarm/",acknowledgeAlarmSucceeded:function(){arguments.callee.base.apply(this,arguments);SteedOS.Alarms.remindersAlarmsController.fetchUpcomingAlarmsAndScheduleNextFetch()}});
