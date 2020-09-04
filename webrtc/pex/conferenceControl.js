var ucHost = 'https://pre.svocloud.com';
var ucWebrtcDomain = '';


// 获取access_token
function getAccessToken(){
	var token = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTA4Mjg0MzQsInVzZXJfbmFtZSI6InpodXBwQHN2b2Nsb3VkLmNvbSIsImF1dGhvcml0aWVzIjpbInVzZXJNYW5hZ2VyIl0sImp0aSI6ImFmYzI3M2ZiLTkyOTMtNDUxZS1iYmQyLWQ2YTEwMGQzZmRiZCIsImNsaWVudF9pZCI6IjI1MTM2MDg3NTUyMDMiLCJzY29wZSI6WyJ3ZWIiXX0.yXog09jBY0qLoIYR04hek92OD2F5xVw8Zerdm0_PRow';
	return token;
}

function VideoConference() {
    var self = this;
    self.onLog = function() { console.log.apply(console, arguments); };
    self.token = null;
	self.authorization = getAccessToken();
    // self.host=null;
   	self.host = "/appapi";
    self.entId = null;
    self.roomNumber =null;
    self.collects = [];
    self.initeLeave = false; //是否被踢断开xmpp
	self.initiativeLeave = false;  //是否主动断开xmpp
	self.puuid = null;
	self.isExistWhiteBoard = 0;
	self.uchost = ucHost;
	self.ucWebrtcDomain = ucWebrtcDomain;
	// self.logoUrl = null;
}