//---------------//Init values//-----------------

const arr_minutes = [6, 6, 1];
// const arr_minutes = [1, 1];

//------------//End - Init values//--------------

//-----------//CountDown functions//-------------

function createSoundTag (p_period_type) {
	const PERIOD_TYPE = {
		RELAX: 0,
		WORK: 1
	}

	var audio_tags = document.getElementsByTagName("audio");

	var tags_len = audio_tags.length;

	for (var i = 0; i < tags_len; i++) {
		audio_tags[i].parentNode.removeChild(audio_tags[i]);
	}

	var audio_tag = document.createElement('audio');
	audio_tag.autoplay = 'autoplay';
	audio_tag.volume = getVolRange()/100;

	switch (p_period_type) {
		case PERIOD_TYPE.WORK:
			audio_tag.src = 'work.mp3';
		break;
		case PERIOD_TYPE.RELAX:
			audio_tag.src = 'relax.mp3';
		break;
		default:
			//
		break;
	}

	var tag_body = document.getElementsByTagName("body");
	tag_body = tag_body[0];

	tag_body.appendChild(audio_tag);

	setTimeout(()  => {
		try {
			audio_tag.parentNode.removeChild(audio_tag);
		}
		catch(e) {
			//
		}
	}, 10000);
}

var CountdownTimer = function () {
	this.cur_period = 0;
	this.timeout_obj = {};
	this.stepInterval = {};
	//in minutes
	this.a_mn_period = [];
	//in milliseconds
	this.a_period = [];

	//STAT val
	this.status = this.STAT.STOP;

	this.remain_s = 0;
}

CountdownTimer.prototype.STAT = {
	STOP: 0,
	PLAY: 1
}

CountdownTimer.prototype.setPeriods = function(p_arr) {
	this.a_mn_period = [];
	this.a_period = [];

	var len = p_arr.length;
	for (var i = 0; i < len; i++) {
		this.a_mn_period.push (p_arr[i]);
		this.a_period.push (p_arr[i]*60*1000); 
	}
}

CountdownTimer.prototype.start = function() {
	allPeriodsShow(this.a_mn_period);
	currentPeriodShow(this.cur_period, this.a_mn_period[this.cur_period]);
	this.status = this.STAT.PLAY;
	this.stepper();
	this.timeout_obj = setTimeout(() => {
		this.timeoutFunc();
	}, this.a_period[this.cur_period]);
}

CountdownTimer.prototype.stop = function() {
	this.status = this.STAT.STOP;
	clearTimeout(this.timeout_obj);
	clearInterval(this.stepInterval);
}

CountdownTimer.prototype.switch = function() {
	if (this.status === this.STAT.STOP){
		this.start();
	}
	else {
		this.stop();
	}
}

CountdownTimer.prototype.stepper = function() {
	clearTimeout(this.stepInterval);

	this.remain_s = this.a_period[this.cur_period]/1000;

	remainShow (this.remain_s);
	this.stepInterval = setInterval(() => {
		remainShow (this.remain_s);
		this.remain_s--;
		if (this.remain_s < 0) {
			clearTimeout(this.stepInterval);
		}
	}, 1000);
}

CountdownTimer.prototype.timeoutFunc = function () {
	this.cur_period++;
	if (this.cur_period >= this.a_period.length) {
		this.cur_period = 0;
	}

	if ( this.cur_period === (this.a_period.length - 1) ) {
		createSoundTag (0);
	}
	else {
		createSoundTag (1);
	}
	window.blur();
	window.focus();

	console.log("Current period " + this.cur_period + ": " + this.a_period[this.cur_period]);
	currentPeriodShow(this.cur_period, this.a_mn_period[this.cur_period]);
	this.stepper();
	this.timeout_obj = setTimeout(() => {
		this.timeoutFunc();
	}, this.a_period[this.cur_period]);
}

function countDownTimerWrapper (p_a_minutes) {
	var CountdownTimer_obj = new CountdownTimer();

	initPLAYClick(CountdownTimer_obj);

	CountdownTimer_obj.setPeriods(p_a_minutes);
	CountdownTimer_obj.start();
}

//--------//End - CountDown functions//----------

//-----------------//Interface//-----------------

function initPLAYClick(countdownT) {
	var button = document.querySelector("div.stopButtondiv");
	button.onclick = function (e) {
		countdownT.switch();
	}
}

function currentPeriodShow(periodNum, p_period) {
	var text_tag = document.getElementById('curPeriodId');
	text_tag.innerHTML = "Current period " + periodNum + ": " + p_period + " minute(s)";
}

function allPeriodsShow (p_arr) {
	var text_tag = document.getElementById('AllPeriodsId');

	text_tag.innerHTML = "All periods: " + p_arr.join(", ");
}

function remainShow (p_period) {
	var text_tag = document.getElementById('remainId');

	// text_tag.innerHTML = "Remain " + p_period + "s";
	text_tag.innerHTML = "Remain " + Math.floor(p_period/60) + ":" + ( (p_period%60 < 10)?"0":"" ) + (p_period%60);
}
	
/**
0..100
*/
function getVolRange () {
	var result = 0;
	var rangeIn = document.getElementById("volumeRangeId");

	result = rangeIn.value;

	return(result);
}

//-------------//End - Interface//---------------

//------------------//Main//---------------------

document.addEventListener("DOMContentLoaded", function(event) {
	initPLAYClick();
  countDownTimerWrapper (arr_minutes);
});

//---------------//End - Main//------------------