SC.MODULE_INFO['steedos/auth_ui'].source = "AuthUI=SC.Object.create({firstRunView:null,MAXIMUM_UPLOAD_FILE_SIZE:1024*10000,_preInfoPrefix:function(){var b=\"Auth.PreInfo.\";if(CK.isBeta){b+=\"Beta.\"}else{if(CK.isDeveloper){b+=\"Developer.\"}}return b}()});AuthUI.importController=CW.Uploader.create({maximumFileSize:AuthUI.MAXIMUM_UPLOAD_FILE_SIZE,isImporting:NO,onFileDropped:function(d,c){SteedOS.statechart.sendAction(\"activeXFileDropped\",c)},onDragEnter:function(d,c){SteedOS.statechart.sendAction(\"activeXFileDragStarted\")},onDragLeave:function(d,c){SteedOS.statechart.sendAction(\"activeXFileDragEnded\")},onDragOver:function(d,c){if(this._param&&this._param.x===c.x&&this._param.y===c.y){return}this._param=c;SteedOS.statechart.sendAction(\"activeXFileDragged\",{x:c.x,y:c.y})},onInvalidFileDropped:function(d,c){SteedOS.statechart.sendAction(\"activeXFileDropped\",c)}});AuthUI.ActiveXView=CK.ActiveXView.extend({classNames:[\"activeX\"],layout:{top:0,left:0,right:0,bottom:0},maxImageSize:1000,maxFileSizeBytes:AuthUI.MAXIMUM_UPLOAD_FILE_SIZE,delegate:AuthUI.importController});AuthUI.AuthUIView=SC.View.extend(CW.Animatability,{classNames:\"auth-ui-view\".w(),layout:{centerX:0,centerY:0,},childViews:\"sash preInfo fields\".w(),sash:SC.ImageView.design({value:function(){if(CK.isBeta){return window.devicePixelRatio>1?\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/beta_sash_badge@2x.png\":\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/beta_sash_badge.png\"}else{if(CK.isDeveloper){return window.devicePixelRatio>1?\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/developer_sash_badge@2x.png\":\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/developer_sash_badge.png\"}}}(),layout:{left:0,top:0,width:90,height:90},isVisible:function(){if(CK.isBeta||CK.isDeveloper){return YES}else{return NO}}()}),preInfo:SC.View.extend(SteedOS.Paneness).extend(CW.Animatability,CW.PaneAnimationSupport,{classNames:\"pre-info\",childViews:\"label learnMore signIn\".w(),init:function(){this.isPaneAttached=!!SteedOS.get(\"shouldShowPreInfo\");arguments.callee.base.apply(this,arguments)},appendRemove:function(){this[SteedOS.get(\"shouldShowPreInfo\")?\"append\":\"remove\"]()}.observes(\"SteedOS.shouldShowPreInfo\"),showDuration:0,hideDuration:300,label:SC.View.extend({classNames:\"pre-info-label overflow-always-visible\",layout:{centerX:0,centerY:55},didCreateLayer:function(){this.update()},render:function(b){},update:function(){var b=this.get(\"layer\");if(!b){return}b.innerHTML=(AuthUI._preInfoPrefix+\"Description\").loc();this.invokeLast(\"sizeToText\");this.invokeLater(\"sizeToText\",3000)},sizeToText:function(){var d=this.get(\"layer\");if(!d){return}var c=SC.bestStringMetricsForMaxWidth(d.innerHTML,306,d,undefined,true);this.adjust({width:c.width,height:c.height})}}),learnMore:SteedOS.ButtonView.extend({layout:{height:47,bottom:12,left:14,right:167},themeName:\"preInfoButton\",title:(AuthUI._preInfoPrefix+\"LearnMore\").loc(),ariaRole:\"link\",action:function(d){var c=window.open((AuthUI._preInfoPrefix+\"LearnMore.URL\").loc(),\"appleIDWindow\");if(!c){window.location=(AuthUI._preInfoPrefix+\"LearnMore.URL\").loc()}}}),signIn:SteedOS.ButtonView.extend({layout:{height:47,bottom:12,left:167,right:14},themeName:\"preInfoButton\",title:(AuthUI._preInfoPrefix+\"SignIn\").loc(),action:function(b){this.parentView.animate(\"opacity\",{from:1,to:0,duration:300});CK.setValueInLocalStorage(\"hasDismissedPreBetaInfo\",1,YES);SteedOS.set(\"shouldShowPreInfo\",NO)}})}),fields:SC.View.extend(SteedOS.Paneness).extend(CW.Animatability,CW.PaneAnimationSupport,SteedOS.NotificationSupport,{classNames:\"auth-fields\",childViews:\"username password register submitButton spinner googleSSO\".w(),subscribesTo:\"SteedOS.authController SteedOS.workspaceController\".w(),init:function(){this.isPaneAttached=!SteedOS.get(\"shouldShowPreInfo\");arguments.callee.base.apply(this,arguments)},appendRemove:function(){this[SteedOS.get(\"shouldShowPreInfo\")?\"remove\":\"append\"]()}.observes(\"SteedOS.shouldShowPreInfo\"),showDuration:300,hideDuration:0,isSpinning:NO,isSpinningBinding:\"*parentView.parentView.isSpinning\",isEditableBinding:\"*parentView.parentView.isEditable\",_ifDialogAbortCount:0,showIForgotDialog:function(){this._ifDialogAbortCount=0;if(this._ifDialogShowing){return}this._ifDialogShowing=true;var b=this._ifDialog||(this._ifDialog=AuthUI.AuthStingerView.create());b.appendTo(this)},hideIForgotDialog:function(){if(!this._ifDialogShowing){return}this._ifDialogShowing=false;var b=this._ifDialog;if(b){b.remove();this._ifDialog=null}}.observes(\"topValue\",\"bottomValue\"),_focusUsername:function(){var d;if(d=this._usernameElement){try{d.focus()}catch(c){}}},_focusPassword:function(){var d;if(d=this._passwordElement){try{d.focus()}catch(c){}}},_blurUsername:function(){var d;if(d=this._usernameElement){try{d.blur()}catch(c){}}},_blurPassword:function(){var d;if((d=this._passwordElement)){try{d.blur()}catch(c){}}},_selectUsername:function(){var d;if(d=this._usernameElement){try{d.select()}catch(c){}}},_selectPassword:function(){var d;if(d=this._passwordElement){try{d.select()}catch(c){}}},focusCorrectField:function(){if(!this.get(\"isVisibleInWindow\")||!this.get(\"isEditable\")){return}var d=!!this.getPath(\"username.value\"),c=!!this.getPath(\"password.value\");if(d){return this._focusPassword()}if(!d){return this._focusUsername()}},windowDidFocus:function(){if(!this._blurred){return}this._blurred=NO;if(!this.get(\"isTopFocused\")&&!this.get(\"isBottomFocused\")){this.focusPreviouslyFocusedField()}},windowDidBlur:function(){this._blurred=YES},focusPreviouslyFocusedField:function(){if(!this.get(\"isVisibleInWindow\")||!this.get(\"isEditable\")){return}if(this._lastFocused===\"password\"){this._focusPassword()}else{this._focusUsername()}},_watchTopFocus:function(){if(this.get(\"isTopFocused\")){this._lastFocused=\"username\"}}.observes(\"isTopFocused\"),_watchBottomFocus:function(){if(this.get(\"isBottomFocused\")){this._lastFocused=\"password\"}}.observes(\"isBottomFocused\"),autofocusOnVisible:function(){if(!this.get(\"isVisibleInWindow\")){return}this.invokeLater(\"focusCorrectField\",300)}.observes(\"isVisibleInWindow\"),autoblurOnInvisible:function(){if(this.get(\"isVisibleInWindow\")){return}this._blurUsername();this._blurPassword()}.observes(\"isVisibleInWindow\"),attemptSubmit:function(){this.username.appendDefaultDomainIfNeeded();var d=this.getPath(\"username.value\"),h=this.getPath(\"password.value\"),f,g;if(this.get(\"isUsernameAlmostEmail\")){if(this.get(\"isVisibleInWindow\")&&this.get(\"isEditable\")){this._focusUsername();this._selectUsername()}return}if(!d||!h){this.focusCorrectField();return}this.performSubmit()},performSubmit:function(){this.username.trim();SteedOS.statechart.sendAction(\"userDidSubmit\")},render:function(b){b.push('<div class=\"top-placeholder\" aria-hidden=\"true\">'+\"Auth.Hint.Username\".loc()+'</div><div class=\"bottom-placeholder\" aria-hidden=\"true\">'+\"Auth.Hint.Password\".loc()+'</div><div class=\"top-ring\" aria-hidden=\"true\"></div><div class=\"bottom-ring\" aria-hidden=\"true\"></div><div class=\"top-field\" aria-hidden=\"true\"></div><div class=\"bottom-field\" aria-hidden=\"true\"></div>')},didCreateLayer:function(){CW.Anim.setOpacity(this._topPlaceholder=this.$(\".top-placeholder\")[0],0.5);CW.Anim.setOpacity(this._bottomPlaceholder=this.$(\".bottom-placeholder\")[0],0.5);CW.Anim.setOpacity(this._topRing=this.$(\".top-ring\")[0],0);CW.Anim.setOpacity(this._bottomRing=this.$(\".bottom-ring\")[0],0);this.update();this._usernameElement=this.username.$input()[0];this._passwordElement=this.password.$input()[0];var b=this.get(\"frame\");this.set(\"layout\",{left:b.x,top:b.y,width:b.width,height:b.height})},update:function(){var j=false;if(this.didChangeFor(\"update\",\"isTopFocused\")){var f=this.get(\"isTopFocused\");this._topFade=CW.Anim.Fader.create({element:this._topRing,to:f?1:0,duration:f?200:500}).start()}if(this.didChangeFor(\"update\",\"isBottomFocused\")){var g=this.get(\"isBottomFocused\");this._bottomFade=CW.Anim.Fader.create({element:this._bottomRing,to:g?1:0,duration:g?200:500}).start()}if(!SC.browser.isIE8OrLower&&this.didChangeFor(\"update\",\"hasBottomPlaceholder\")){var h=this.get(\"hasBottomPlaceholder\");this._bottomFade=CW.Anim.Fader.create({element:this._bottomPlaceholder,to:h?0.31:0,duration:h?700:100*!SC.browser.isSafari}).start();j=true}if(!SC.browser.isIE8OrLower&&this.didChangeFor(\"update\",\"hasTopPlaceholder\")){var k=this.get(\"hasTopPlaceholder\");this._topFade=CW.Anim.Fader.create({element:this._topPlaceholder,to:k?0.31:0,duration:k?700:100*!SC.browser.isSafari}).start();j=true}if(this._lastIUE!==(this._lastIUE=this.get(\"isUsernameEmail\"))){j=true}if(j){this.set(\"enableSubmit\",!!(this.get(\"topValue\")&&this.get(\"bottomValue\")))}},finishAnimation:function(){if(this._bottomFade){this._bottomFade.finish()}if(this._topFade){this._topFade.finish()}return CW.Animatability.finishAnimation.apply(this,arguments)},isTopFocusedBinding:\".username.focused\",isBottomFocusedBinding:\".password.focused\",topValueBinding:\".username.value\",bottomValueBinding:\".password.value\",hasTopPlaceholder:function(){return !this.get(\"topValue\")}.property(\"topValue\").cacheable(),hasBottomPlaceholder:function(){return !this.get(\"bottomValue\")}.property(\"bottomValue\").cacheable(),isUsernameEmail:function(){var c=this.get(\"topValue\"),d;if(!c){return NO}return !!c.match(/.+@.+\\..+/)&&(d=c.match(new RegExp(\"@\",\"g\")))&&d.length===1}.property(\"topValue\").cacheable(),isUsernameAlmostEmail:function(){var b=this.get(\"topValue\");return !this.get(\"isUsernameEmail\")&&b.indexOf(\"@\")!==-1}.property(\"topValue\").cacheable(),displayProperties:\"isTopFocused isBottomFocused hasTopPlaceholder hasBottomPlaceholder isUsernameEmail\".w(),username:SC.TextFieldView.extend({applyImmediately:YES,layout:{top:189+5-2*!!SC.browser.mozilla+1*(parseInt(SC.browser.msie,0)===9)+!!SC.browser.isIE8OrLower,left:22,right:14,height:49-10,zIndex:200},classNames:\"username signin-field\".w(),themeName:null,spellCheckEnabled:NO,autoCapitalize:NO,hint:(SC.browser.msie||SC.browser.opera)?\"\":\"Auth.Hint.Username\".loc(),isEditableBinding:\"*parentView.parentView.isEditable\",valueBinding:\"SteedOS.authController.loginUsername\",addListeners:SC.browser.isIE8OrLower?function(){if(!this.get(\"layer\")){return}var d=this.$(\"input\")[0],c=this;if(!d){return}d.onkeydown=d.onkeyup=function(){if(c.parentView){c.parentView[c._ie8ForcePlaceholderKey].style.display=d.value?\"none\":\"\"}}}.observes(\"layer\"):undefined,_ie8ForcePlaceholderKey:\"_topPlaceholder\",areFieldsEditableBinding:\"SteedOS.authController.areFieldsEditable\",areFieldsEditableDidChange:function(){var b=this.get(\"valueBinding\");if(this.get(\"areFieldsEditable\")){b.connect()}else{b.disconnect()}}.observes(\"areFieldsEditable\"),keyUp:function(){this.trim()},trimOnBlur:function(){if(this.get(\"focused\")){return}this.trim();this.appendDefaultDomainIfNeeded()}.observes(\"focused\"),appendDefaultDomainIfNeeded:function(){var d=this.get(\"value\");if(!this.getPath(\"parentView.isUsernameEmail\")&&d&&d.indexOf(\"@\")===-1&&!this._appendedDefaultDomain){this.set(\"value\",d);SC.Binding.flushPendingChanges();this._appendedDefaultDomain=YES;var e=SC.metricsForString(d,this.$(\"input\")[0],null,NO).width;var f=SC.View.create(CW.Animatability,{classNames:[\"defaultdomain-overlay signin-field\"],layout:{left:5+e,right:5,height:35,top:3},didCreateLayer:function(){this.animate(\"opacity\",0,{duration:300,onstop:function(){this.view.destroy()}})}});this.appendChild(f)}},valueDidChange:function(){if(!this.get(\"value\")){this._appendedDefaultDomain=NO}}.observes(\"value\"),trim:function(){var c=this.get(\"value\")||\"\";var d=c.replace(/\\s+/g,\"\");if(d!==c){SteedOS.authController.set(\"loginUsername\",d);this.set(\"value\",d)}},setLabel:function(){this.$(\"input\").attr(\"aria-label\",\"Auth.Hint.Username\".loc())}.observes(\"layer\")}),password:SC.TextFieldView.extend({applyImmediately:YES,layout:{top:190+53+5-2*!!SC.browser.mozilla-!!SC.browser.isIE8OrLower,left:22,right:14+35,height:49-10,zIndex:200},isPassword:YES,hint:(SC.browser.msie||SC.browser.opera)?\"\":\"Auth.Hint.Password\".loc(),classNames:\"password signin-field\".w(),themeName:null,spellCheckEnabled:NO,isEditableBinding:\"*parentView.parentView.isEditable\",valueBinding:\"SteedOS.authController.loginPassword\",setLabel:function(){this.$(\"input\").attr(\"aria-label\",\"Auth.Hint.Password\".loc())}.observes(\"layer\"),addListeners:SC.browser.isIE8OrLower?function(){if(!this.get(\"layer\")){return}var d=this.$(\"input\")[0],c=this;if(!d){return}d.onkeydown=d.onkeyup=function(){if(c.parentView){c.parentView[c._ie8ForcePlaceholderKey].style.display=d.value?\"none\":\"\"}}}.observes(\"layer\"):undefined,_ie8ForcePlaceholderKey:\"_bottomPlaceholder\"}),enableSubmit:NO,submitButton:SC.ImageButtonView.extend({isVisibleBinding:SC.Binding.not(\"*parentView.isSpinning\"),layout:{top:255,left:277,height:26,width:25,zIndex:30},classNames:\"auth-submit\".w(),toolTip:\"Auth.Button.SignIn\".loc(),action:function(){this.get(\"parentView\").attemptSubmit()},isEnabledBinding:\"*parentView.parentView.enableSubmit\",isDefault:YES}),spinner:CW.SpinnerView.extend({isVisibleBinding:\"*parentView.isSpinning\",layout:{top:250,left:273,zIndex:31},asset:window.devicePixelRatio===2?\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/spinner_signin@2x.png\":\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/spinner_signin.png\"}),register:SC.LabelView.extend(SC.AutoResize,{isVisible:!CW.isiOSApp(),value:\"AuthFooter.Register.Text\".loc(),classNames:\"auth-forgot-password\".w(),layout:{top:306,left:8,height:28},click:function(){SteedOS.showRegister()},touchStart:function(){this.click()},}),googleSSO:SC.LabelView.extend(SC.AutoResize,{value:\"AuthFooter.GoogleSSO.Text\".loc(),classNames:\"auth-forgot-password\".w(),layout:{top:306,right:14,height:28},click:function(){SteedOS.showGoogleSSO()},touchStart:function(){this.click()},}),})});function s(){fb.set(\"isShowingSecurityQuestion\",YES)}AuthUI.SecurityQuestionView=SC.View.extend(SteedOS.Paneness).extend(CW.Animatability,CW.PaneAnimationSupport,SteedOS.NotificationSupport,{classNames:\"security-question-view\".w(),showDuration:0,hideDuration:300,inset:5,backgroundColor:\"#E0E3E7\",shouldAppendBinding:\".owner.isShowingSecurityQuestion\",childViews:\"answerField continueButton\".w(),subscribesTo:\"SteedOS.authController SteedOS.workspaceController\".w(),securityQuestionTextBinding:\"SteedOS.authController.securityQuestionText\",render:function(b){b.push('<div class=\"explanation\"><table><tr><td>'+\"Account.SecurityQuestion.Explanation\".loc()+'</td></tr></table></div><div class=\"question-text\"><table><tr><td><strong>'+\"Account.SecurityQuestion.Command\".loc()+'</strong><br><span class=\"question\"></span></td></tr></table></div>');b.push('<div class=\"placeholder\" aria-hidden=\"true\">'+\"Account.SecurityQuestion.AnswerPlaceholder\".loc()+'</div><div class=\"ring\" aria-hidden=\"true\"></div><div class=\"field\" aria-hidden=\"true\"></div>')},didCreateLayer:function(){this._questionSpan=this.$(\".question\")[0];this._inputElement=this.answerField.$input()[0];CW.Anim.setOpacity(this._placeholder=this.$(\".placeholder\")[0],0.5);CW.Anim.setOpacity(this._ring=this.$(\".ring\")[0],0);this.update()},displayProperties:\"isFocused hasPlaceholder securityQuestionText\".w(),update:function(){if(this.didChangeFor(\"update\",\"isFocused\")){var c=this.get(\"isFocused\");this._ringFade=CW.Anim.Fader.create({element:this._ring,to:c?1:0,duration:c?200:500}).start()}if(this.didChangeFor(\"update\",\"hasPlaceholder\")){var d=this.get(\"hasPlaceholder\");this._placeholderFade=CW.Anim.Fader.create({element:this._placeholder,to:d?0.31:0,duration:d?700:100*!SC.browser.isSafari}).start()}if(this.didChangeFor(\"update\",\"securityQuestionText\")){this._questionSpan.innerHTML=SC.RenderContext.escapeHTML(this.get(\"securityQuestionText\"))}},finishAnimation:function(){if(this._ringFade){this._ringFade.finish()}if(this._placeholderFade){this._placeholderFade.finish()}return CW.Animatability.finishAnimation.apply(this,arguments)},isFocusedBinding:\".answerField.focused\",currentAnswerValueBinding:\".answerField.value\",hasPlaceholder:function(){return !this.get(\"currentAnswerValue\")}.property(\"currentAnswerValue\").cacheable(),answerField:SC.TextFieldView.extend({layout:{top:190+53+5-35-2*!!SC.browser.mozilla-!!SC.browser.isIE8OrLower,left:17,right:9,height:49-10,zIndex:200},isPassword:YES,hint:(SC.browser.msie||SC.browser.opera)?\"\":\"Account.SecurityQuestion.AnswerPlaceholder\".loc(),classNames:\"password signin-field\".w(),themeName:null,valueBinding:\"SteedOS.authController.securityQuestionAnswer\",setLabel:function(){this.$(\"input\").attr(\"aria-label\",\"Account.SecurityQuestion.AnswerPlaceholder\".loc())}.observes(\"layer\"),keyDown:function(b){if(b.which===13){SteedOS.statechart.sendAction(\"userDidSubmit\");return YES}else{return arguments.callee.base.apply(this,arguments)}}}),continueButton:SteedOS.ButtonView.design({layout:{height:47,bottom:7,left:7,right:7},themeName:\"firstRunDoneButton\",title:\"Account.SecurityQuestion.Continue\".loc(),action:function(b){SteedOS.statechart.sendAction(\"userDidSubmit\")}}),focusCorrectField:function(){if(!this.get(\"isVisibleInWindow\")){return}this._inputElement&&this._inputElement.focus()},autofocusOnVisible:function(){if(!this.get(\"isVisibleInWindow\")){return}this.invokeLater(\"focusCorrectField\",300)}.observes(\"isVisibleInWindow\"),windowDidFocus:function(){return this.focusCorrectField()},init:function(){var f=this.owner.contentLayout,e=this.layout={},d=this.inset;e.top=f.top+d;e.left=f.left+d;e.width=f.width-2*d;e.height=f.height-2*d;e.zIndex=6;return arguments.callee.base.apply(this,arguments)},appendRemove:function(){if(this.get(\"shouldAppend\")){this.append()}else{this.remove()}}.observes(\"shouldAppend\")});AuthUI.BadgeFlippingPane=SC.Pane.extend(CW.Animatability,SteedOS.IsShowingSupport,CW.DropTarget,{isDropTarget:YES,acceptsFileDrags:NO,show:function(){this.append();this.becomeKeyPane();this.invokeLast(\"chooseDefaultBadge\");this._animateKidLists(\"immediateFadingChildren\",\"delayedFadingChildren\",{opacity:{from:0,to:1},duration:500});if(this._hideKidTimer){this._hideKidTimer.invalidate();this._hideKidTimer=undefined}if(this.didShow){this.didShow()}},hide:function(){this.set(\"currentBadge\",\"none\");var d={opacity:0,duration:500};this._animateKidLists(\"immediateFadingChildren\",d);this._hideKidTimer=this.invokeLater(this._animateKidLists,SteedOS.workspaceController.nextShowDelayTime,\"delayedFadingChildren\",d);if(this.didHide){this.didHide()}var c=SteedOS.appController.get(\"pendingApp\");if(c){this._sleptApp=c;c.sleep()}},_animateKidLists:function(){var r=0,j=[];for(var p=arguments.length-1-r;typeof arguments[p]!==\"string\";p--){j.unshift(arguments[p]);r++}for(var o=0,q=arguments.length;o<q-r;o++){for(var k=0,u=this.get(arguments[o]),n,t=u&&u.length;k<t;k++){if((n=this.get(u[k]))&&n.hasAnimatability){n.animate.apply(n,j)}}}},chooseDefaultBadge:function(){this.set(\"currentBadge\",this.get(\"defaultBadge\"))},didRemoveFromParent:function(){this._noAnimate=YES;this.set(\"currentBadge\",\"none\");this.currentBadgeObserver();this._noAnimate=NO},defaultResponder:SteedOS.statechart,currentBadge:\"none\",activeX:null,currentBadgeObserver:function(){if(!this.didChangeFor(\"currentBadgeObserver\",\"currentBadge\")){return}var g=this.get(\"currentBadge\"),h=this.get(g),e=this.get(this._lastCurrentBadge),f=this;if(h){h.append()}if(e){e.remove()}this._lastCurrentBadge=g}.observes(\"currentBadge\"),entranceAnimationDidFinish:function(){},exitAnimationDidFinish:function(){if(this.get(\"currentBadge\")!==\"none\"){return}this.remove();this.invokeLater(function(){if(this._sleptApp){this._sleptApp.wake();this._sleptApp=null}},300)},render:function(b){},update:function(){}});sc_require(\"views/auth_ui_view\");sc_require(\"views/security_question_view\");sc_require(\"views/badge_flipping_pane\");AuthUI.authPane=AuthUI.BadgeFlippingPane.create(SteedOS.NotificationSupport,{layout:{left:0,top:SteedOS.TOPBAR_HEIGHT,right:0,bottom:0,},init:function(){if(CW.isiOSApp()){this.layout={left:0,right:0,top:0,height:window.innerHeight,zIndex:2}}arguments.callee.base.apply(this,arguments)},orientationBinding:\"SC.device.orientation\",adjustHeight:function(){if(CW.isiOSApp()){this.adjust(\"height\",window.innerHeight)}}.observes(\"orientation\"),acceptsKeyPane:YES,displayKey:SteedOS.AUTH,nowShowingBinding:\"SteedOS.workspaceController.nowShowing\",subscribesTo:[\"SteedOS.authController\"],defaultBadge:\"authBadge\",childViews:\"authBadge firstRunBadge footer\".w(),classNames:[\"auth-pane\"],immediateFadingChildren:[\"\"],delayedFadingChildren:[\"footer\"],authBadge:SteedOS.BadgeContainerView.design(SteedOS.NotificationSupport,{classNames:[\"front\",\"overflow-always-visible\"],_doesNotRotate:YES,isSpinningBinding:\"SteedOS.authController.isSpinning\",isEditableBinding:\"SteedOS.authController.areFieldsEditable\",contentView:AuthUI.AuthUIView.design(),centerYBinding:\"SteedOS.workspaceController.springboardVisualCenterY\",wantsFlip:NO,subscribesTo:[\"SteedOS.workspaceController\",\"SteedOS.authController\"],firstShowDelay:50,INITIAL_ROTATION:-45,MOUSE_STRENGTH:13,_xOffset:0,_yOffset:0,init:function(){arguments.callee.base.apply(this,arguments);ab=this;if(!this._doesNotRotate){this._rotationTracker=CW.Animation.create({to:0,from:0,inertia:3,speed:13,view:this,ticked:2,update:function(){this.view.paintBackgroundAtRotation()}})}},render:function(b){var c=\"steedos-logo \"+SteedOS.displayApps[0].name;b.push('<div class=\"'+c+'\"></div>');if(!this._doesNotRotate){if(SC.browser.webkit){b.push('<div class=\"rotating-background\" style=\"background:-webkit-canvas(authcanvasbg);\" aria-hidden=\"true\"></div>')}else{b.push('<canvas class=\"rotating-background\" aria-hidden=\"true\"></canvas>')}}arguments.callee.base.apply(this,arguments)},paneDidShow:function(){arguments.callee.base.apply(this,arguments);this.owner.entranceAnimationDidFinish()},paneDidHide:function(){arguments.callee.base.apply(this,arguments);this.owner.exitAnimationDidFinish()},shake:function(){if(SC.browser.isIE8OrLower){return}if(this._shaker){this._shaker.finish()}var b=15;this._shaker=this.animate(\"centerX\",{to:this.get(\"layout\").centerX+b,importants:[1,2,3,4,5,6].map(function(a){return a*b/7}),tween:CW.Anim.tweens.make(\"linearInterpolation\",[0,1,-1,1,-1,0.7,-0.7,0]),duration:400})},extraRequiredSrcs:function(){if(this._doesNotRotate){return null}return{rotater:window.devicePixelRatio>1?\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/rotating_gradient@2x.jpg\":\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/rotating_gradient.jpg\",rotaterMask:window.devicePixelRatio>1?\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/canvas_mask@2x.png\":\"../../../../system/steedos/3C30/steedos/auth_ui/3C30/en-us/source/resources/images/canvas_mask.png\"}}.property(),didCreateLayer:function(){arguments.callee.base.apply(this,arguments);if(this._doesNotRotate){this.classNames.push(\"no-rotater\");this.$().addClass(\"no-rotater\")}},didFinishWaitingForImages:function(){SteedOS.workspaceController.invokeLater(\"notifySubscribers\",500,\"springboardMayProceed\");SteedOS.workspaceController.removeRHTMLSpinner();if(this._doesNotRotate){return}this._can=this.$(\".rotating-background\")[0];this._can.width=326*window.devicePixelRatio;this._can.height=340*window.devicePixelRatio;if(SC.browser.webkit){this._con=document.getCSSCanvasContext(\"2d\",\"authcanvasbg\",this._can.width,this._can.height)}else{this._con=this._can.getContext(\"2d\")}if(!this.extraRequiredImages.rotater||!this.extraRequiredImages.rotaterMask){this._doesNotRotate=YES;this.classNames.push(\"no-rotater\");this.$().addClass(\"no-rotater\");if(this._can){this._can.parentNode.removeChild(this._can)}return}var b=this.$(\".background\")[0];if(b){b.parentNode.removeChild(b)}},paintBackgroundAtRotation:function(g){if(typeof g===\"number\"){this._lastRotation=g}else{g=this._lastRotation||0}var m=this._can,h=this._con,j=this.extraRequiredImages.rotater,n=this.get(\"layout\"),k=window.devicePixelRatio;if(!m||!h||!j||!n){return}g+=this._rotationTracker.current;h.save();h.translate(m.width/2,m.height/2-(95*k));h.rotate(g*Math.PI/180);h.drawImage(j,-j.width/2,-j.height/2);h.restore();h.globalCompositeOperation=\"destination-in\";h.drawImage(this.extraRequiredImages.rotaterMask,0,0);h.globalCompositeOperation=\"source-over\";this._hasPainted=YES},animateShow:function(){if(this._doesNotRotate){return arguments.callee.base.apply(this,arguments)}arguments.callee.base.apply(this,arguments);this._rotateAnim=CW.Animation.create({view:this,duration:1500,from:this.INITIAL_ROTATION,to:0,update:function(){this.view.paintBackgroundAtRotation(this.current)}}).start()},notifyMouseMove:function(){if(this._doesNotRotate||!this._rotationTracker){return}var f=SC.RootResponder.responder._lastMoveX||0,g=SC.RootResponder.responder._lastMoveY||0,e=this.getPath(\"pane.currentWindowSize\"),h;if(!e||!e.width||!e.height){return}if(this._lastX===undefined||this._lastY===undefined){this._xOffset=f;this._yOffset=g}this._lastX=f;this._lastY=g;this._rotationTracker.redirectTo((f-this._xOffset)/e.width*this.MOUSE_STRENGTH+(g-this._yOffset)/e.height*this.MOUSE_STRENGTH);this._rotationTracker.start()},append:function(){this._removeRequested=false;return arguments.callee.base.apply(this,arguments)},remove:function(){this._removeRequested=this.get(\"isWaitingToRemove\");if(!this._removeRequested){return arguments.callee.base.apply(this,arguments)}},removeAfterWait:function(){if(this._lIWTR===(this._lIWTR=this.get(\"isWaitingToRemove\"))){return}if(this._lIWTR||!this._removeRequested){return}SC.debug(\"The authBadge was waiting (either for firstRunBadge's permission after preloading, or for authPane's permission for dismissal) to remove itself. It is now removing itself.\");this.remove()}.observes(\"isWaitingToRemove\"),isWaitingToRemove:YES}),firstRunBadge:SteedOS.BadgeContainerView.design({isPaneAttached:NO,classNames:[\"back\"],nowShowingBinding:\"AuthUI.firstRunView\",isShowingSecurityQuestionBinding:\".owner.isFirstRunBadgeShowingSecurityQuestion\",centerYBinding:\"SteedOS.workspaceController.springboardVisualCenterY\",wantsFlip:YES,init:function(){arguments.callee.base.apply(this,arguments);window.fb=this},paneWillShow:function(){arguments.callee.base.apply(this,arguments);SteedOS.workspaceController.removeRHTMLSpinner()},paneDidShow:function(){arguments.callee.base.apply(this,arguments);this.owner.entranceAnimationDidFinish();SteedOS.workspaceController.notifySubscribers(\"springboardMayProceed\")},paneDidHide:function(){arguments.callee.base.apply(this,arguments);this.owner.exitAnimationDidFinish()},paneWillHide:function(){arguments.callee.base.apply(this,arguments);if(this.getPath(\"parentView.currentBadge\")){return}this.flipFlipSwitchTo(NO)},didFinishWaitingForImages:function(){var b=this.getPath(\"owner.authBadge\");if(b){b.set(\"isWaitingToRemove\",NO)}},createSecurityQuestion:function(){if(this.securityQuestionView.isClass){this.securityQuestionView=this.securityQuestionView.create({owner:this,usualParent:this})}}.observes(\"isShowingSecurityQuestion\"),securityQuestionView:AuthUI.SecurityQuestionView.design()}),footer:SC.View.design(CW.Animatability,{layout:{left:0,right:0,height:41,bottom:0},isVisible:!CW.isiOSApp(),classNames:[\"auth-footer\"],displayProperties:[\"frame\"],init:function(){if(CW.isMobile()){this.set(\"isVisible\",NO)}arguments.callee.base.apply(this,arguments)},render:function(o){var p=[{name:\"Workflow\".loc(),url:\"AuthFooter.Workflow.URL\".loc(),target:\"_blank\"},{name:\"Chat\".loc(),url:\"AuthFooter.Chat.URL\".loc(),target:\"_blank\"},{name:\"Downloads\".loc(),url:\"AuthFooter.Downloads.URL\".loc(),target:\"_blank\"},{name:\"Pricing\".loc(),url:\"AuthFooter.Pricing.URL\".loc(),target:\"_blank\"},{name:\"Help\".loc(),url:\"AuthFooter.Help.URL\".loc(),target:\"_blank\"},{name:\"Forgot\",url:\"javascript:SteedOS.showForgotPassword();\".loc(),target:\"blank\"}],n=\"\",k=SC.Locale.currentLanguage,j=k===\"fr-fr\"||k===\"es-es\"?\"&nbsp;&nbsp;\":\"&nbsp;&nbsp;&nbsp;&nbsp;\",m=j+'<span class=\"footer-link-separator\"></span>'+j,h;for(i=0,l=p.length;(link=p[i]);i++){h=link.name;n+='<a href=\"'+link.url+'\" target=\"'+link.target+'\">'+(\"AuthFooter.\"+h+\".Text\").loc().split(\" \").join(\"&nbsp;\")+\"</a>\"+(i+1===l?\"\":m)}n+='<span class=\"footer-link-separator\" style=\"visibility:hidden;\"></span>';o.push('<div class=\"left footer-text\" style=\"font-weight:bold; font-size:11px;\"><span>'+n+'</span></div><div class=\"right footer-text\">'+\"AuthFooter.CopyrightText\".loc(SteedOS.getCurrentYear())+\"</div>\")},update:function(){},didCreateLayer:function(){this._left=this.$(\".left\")[0];this._logo=this.$(\".logo\")[0];this._right=this.$(\".right\")[0]}}),windowResized:SC.browser.isIE8OrLower?function(){var d=this.get(\"currentWindowSize\");if(!d||!d.width||!d.height){return}var f=this.get(\"layout\"),e;if(d.width<SteedOS.MIN_WIDTH){if(d.height<SteedOS.MIN_HEIGHT){if(f!==(e=this._whSmaller||(this._whSmaller={left:0,top:0,width:SteedOS.MIN_WIDTH,height:SteedOS.MIN_HEIGHT}))){this.set(\"layout\",e)}}else{if(f!==(e=this._wSmaller||(this._wSmaller={left:0,top:0,width:SteedOS.MIN_WIDTH,bottom:0}))){this.set(\"layout\",e)}}}else{if(d.height<SteedOS.MIN_HEIGHT){if(f!==(e=this._hSmaller||(this._hSmaller={left:0,top:0,right:0,height:SteedOS.MIN_HEIGHT}))){this.set(\"layout\",e)}}else{if(f!==(e=this._noSmaller||(this._noSmaller={left:0,top:0,right:0,bottom:0}))){this.set(\"layout\",e)}}}}.observes(\"currentWindowSize\"):undefined,mouseMoved:function(){if(this.get(\"currentBadge\")!==\"authBadge\"){return}this.authBadge.notifyMouseMove()},showSecurityQuestion:function(){this.set(\"isFirstRunBadgeShowingSecurityQuestion\",YES);this.authBadge.flipFlipSwitchTo(YES);this.set(\"currentBadge\",\"firstRunBadge\")},hideSecurityQuestion:function(){this.set(\"isFirstRunBadgeShowingSecurityQuestion\",NO)},cancelSecurityQuestion:function(){this.firstRunBadge.flipFlipSwitchTo(YES);this.set(\"currentBadge\",\"authBadge\")},currentBadgeObserver:function(){if(this.get(\"currentBadge\")===\"none\"&&this._lastCurrentBadge===\"authBadge\"){this.authBadge.set(\"isWaitingToRemove\",NO)}return arguments.callee.base.apply(this,arguments)}.observes(\"currentBadge\")});AuthUI.AuthStingerView=SC.View.extend(SteedOS.Paneness).extend(CW.Animatability,CW.PaneAnimationSupport,CW.SpritePreloadEnforcement,{MIN_HEIGHT:48,MIN_WIDTH:103,MAX_WIDTH:550,layout:{centerX:0,top:301,height:48,zIndex:500},classNames:\"auth-picker overflow-always-visible\".w(),childViews:\"iForgotButton\".w(),iForgotButton:SC.ButtonView.extend(SC.AutoResize,{layout:{height:31,right:9,centerY:1,zIndex:2},supportsAutoResize:YES,autoResizeLayer:function(){return this.$(\".title\")[0]}.property(),autoResizeText:function(){return this.get(\"displayTitle\")}.property(),autoResizePadding:{width:20,height:0},classNames:\"iforgot-button\".w(),title:\"Error.AuthDidNotValidate.iForgot\".loc(),action:function(){SteedOS.showForgotPassword()},frameObserver:function(){this.owner.invokeLast(\"recalculateLayout\")}.observes(\"calculatedWidth\"),renderDelegate:{render:function(j,h){var k='<div class=\"button-bg\">';for(var c=0,d;d=SC.THREE_SLICE[c];c++){k+='<div class=\"'+d+'\"></div>'}k+='</div><div class=\"title\">'+j.get(\"displayTitle\")+\"</div>\";h.push(k)},update:function(){}}}),render:function(h){window.apv=this;var k=\"tl tlc tc trc tr cl c cr bl b br\".w(),c='<div class=\"background\" aria-hidden=\"true\">';for(var g=0,j;j=k[g];g++){c+='<div class=\"'+j+'\"></div>'}c+=\"</div>\";c+='<div class=\"message\">'+\"Error.AuthDidNotValidate.Title\".loc()+'</div><div class=\"description\">'+\"Error.AuthDidNotValidate.Description\".loc()+\"</div>\";h.push(c)},update:function(){},didCreateLayer:function(){this._layer=this.get(\"layer\");this._tc=this.$(\".tc\")[0];this._tlc=this.$(\".tlc\")[0];this._trc=this.$(\".trc\")[0];this._message=this.$(\".message\")[0];this._description=this.$(\".description\")[0];this.fixBackground()},recalculateLayout:function(){var k=this.getPath(\"iForgotButton.layout\");var j=11*2+k.width+k.right;var f=this.MAX_WIDTH-j;var g=SC.cachedVersionOf(SC.metricsForString)(this._message.innerHTML,this._message,null,true);var h=SC.cachedVersionOf(SC.bestStringMetricsForMaxWidth)(this._description.innerHTML,f,this._description,null,true);this.adjust(\"width\",Math.max(this.MIN_WIDTH,Math.max(g.width+1,h.width)+j));j=26+7;this.adjust(\"height\",Math.max(this.MIN_HEIGHT,h.height+j))},fixBackground:function(){var j=this.get(\"frame\");if(!j||!this._layer){return}if(this._lastW===(this._lastW=j.width)&&this._lastH===(this._lastH=j.height)){return}var f=j.width+17*2,k=j.height+17+32,h=Math.floor(f/2-65/2),g=h-36;trcW=f-36-g-36-65;if(h<0||g<0||trcW<0){return}this._tc.style.left=h+\"px\";this._tlc.style.width=g+\"px\";this._trc.style.width=trcW+\"px\"}.observes(\"frame\")});";
