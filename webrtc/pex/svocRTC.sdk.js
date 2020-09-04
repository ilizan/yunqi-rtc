
/** 
 * 
 * 
*/
// (function(){
// var App = function (params) {
//   var myapp = function () {
//     var self = this;
//     self.name = '123';
//   }
//   myapp.prototype.init = function () {
//     var self = this;
//     alert(self.name)
//   };
//    return new myapp()
// }
// })()

(function (window) {
  // declare
  var svocRTC = function () {
    var that = this;
    that.onLog = function() { console.log.apply(console, arguments); };
    // pexrtc相关
    that.rtc = new PexRTC();
    that.platformSettings = {
      hasWebRTC: true
    };
    // 呼叫相关
    that.call = {};
    return;
  };

  // 导入PexRTC();
  svocRTC.prototype.initPexRtc = function (rtc) {
      var that = this;
      that.rtc = rtc;
      return that.rtc ;
  };

  svocRTC.prototype.CallInit = function(host, alias, displayName, token, registration_token) {
    var that = this;
    that.call.host = host;
    that.call.alias = alias;
    that.call.displayName = displayName;
    that.call.token = token;
    that.call.registration_token = registration_token;
    that.call.remoteMediaStream = null;
    that.call.localMediaStream = null;

    that.rtc.makeCall(host, alias, displayName, null, 'none');

    that.rtc.onSetup = function (stream, pinStatus, conferenceExtension) {
      setTimeout(() => {
        that.onLog('PexRTC.onSetup');
        if(stream) {
          that.call.localMediaStream = stream;
          // $rootScope.$broadcast('call::localMediaStream', stream, rtc.call_type);
        }
        if(!stream && conferenceExtension) {
          // $rootScope.$broadcast('call::extensionRequested', conferenceExtension);
        }else if(that.platformSettings.hasWebRTC && that.call.remoteMediaStream) {
          that.rtc.connect();
        }else if (pinStatus !== 'none') {
          // $rootScope.$broadcast('call::pinRequested', pinStatus === 'required');
        }else{
          that.CallConnect()
        }
      })
    }

    that.rtc.onConnect = function (stream) {
      setTimeout(() => {
        that.onLog("PexRTC.onConnect", stream);
        if(that.rtc.uuid) {
          var disabledProtocols = [];
          if(that.rtc.rtmp_enabled === false) {
            disabledProtocols.push('rtmp');
          }
          if(that.rtc.rtsp_enabled === false) {
            disabledProtocols.push('rtsp');
          }
        }
        
        if (typeof(MediaStream) !== "undefined" && stream instanceof MediaStream) {
           that.call.remoteMediaStream = stream;
        } else {
          that.call.remoteMediaStream = stream;
        }
        console.log('========remoteMediaStream', that.call.remoteMediaStream)
      });
    }

    that.rtc.onError = function (reason) {
      setTimeout(() => {
        that.onLog("PexRTC.onError", reason);
      });
    }

    that.rtc.onDisconnect = function (reason) {
      setTimeout(() => {
        that.onLog("PexRTC.onDisconnect", reason);
      });
    }

    return that.call;
  }

  svocRTC.prototype.CallConnect = function (pin, extension) {
    var that = this;
    that.onLog("Call.connect", pin, extension);
    that.rtc.connect(pin, extension);
  }

  svocRTC.prototype.CallStartCall = function (callType, videoSource, audioSource, flashElement) {
    var that = this;
    that.onLog("Call.startCall", callType, videoSource, audioSource, flashElement);
    that.rtc.call_type = callType;
    that.rtc.flash = flashElement;
    that.rtc.video_source = videoSource;
    that.rtc.audio_source = audioSource;
    that.rtc.addCall(callType);
  }

  svocRTC.prototype.CallDisconnect = function (reason) {
    var that = this;
    that.onLog('Call.disconnect');
    delete that.call.presentationVideoSrc;
    try {
      that.rtc.present(null);
      that.rtc.stopPresentation();
      that.rtc.disconnectCall();
      that.rtc.disconnect(reason);
    } catch (error) {
      that.onLog('Failed to disconnect pexrtc', error)
    }
    
  }









  // define your namespace svocRTC
  window.svocRTC = new svocRTC();
})(window, undefined);