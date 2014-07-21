if (typeof jQuery === 'undefined') { throw new Error('JSTimer requires jQuery') }

(function ($, window) {
	"use strict";

	window.Timer = function (functionToBeCalled, milliseconds, options) {

		if( !(this instanceof Timer) )
			return new Timer(functionToBeCalled, milliseconds, options);

		var options = options || {};
		var millisecondsStart = options["milliseconds"] || 0;
		var secondsStart = options["seconds"] || 0;
		var minutesStart = options["minutes"] || 0;
		var hoursStart = options["hours"] || 0;
		var step = options["step"] || 1000;
		var $milliseconds = $(options["millisecondsSelector"] || "");
		var $pureMilliseconds = $(options["pureMillisecondsSelector"] || "");
		var $seconds = $(options["secondsSelector"] || "");
		var $pureSeconds = $(options["pureSecondsSelector"] || "");
		var $minutes = $(options["minutesSelector"] || "");
		var $pureMinutes = $(options["pureMinutesSelector"] || "");
		var $hours = $(options["hoursSelector"] || "");
		var onInverseStop = options["onInverseStop"] || function(){};
		var leadingZero = options["leadingZero"] || true;
		this.milliseconds = millisecondsStart + secondsStart * 1000 + minutesStart * 60000 + hoursStart * 3600000;

		function pad(n, r) {
			var number = parseInt(1 + Array(r).join("0"), 10);
			return n < number ? Array(r - (n + "").length + 1).join("0") + n : n;
		}

		var increment = function () {
			this.milliseconds += step;
			setTimeToElements.call(this);
			if( (this.milliseconds + millisecondsStart) % milliseconds == 0){
				functionToBeCalled.call(this);
			}
		}

		var decrement = function () {
			this.milliseconds -= step;
			setTimeToElements.call(this);
			if ( (millisecondsStart - this.milliseconds) % milliseconds == 0){
				functionToBeCalled.call(this);
			}
			if(this.milliseconds == 0){
				clearInterval(this.timer);
				onInverseStop.call(this);
			}
		}

		var setTimeToElements = function(){
			var milliseconds = this.milliseconds;
			var hours = Math.floor(milliseconds / 3600000);
			milliseconds = milliseconds % 3600000
			var minutes = Math.floor(milliseconds / 60000);
			milliseconds = milliseconds % 60000;
			var seconds = Math.floor(milliseconds / 1000);
			milliseconds = milliseconds % 1000;
			$milliseconds.text(leadingZero ? pad(milliseconds, 3) : milliseconds);
			$seconds.text(leadingZero ? pad(seconds, 2) : seconds);
			$minutes.text(leadingZero ? pad(minutes, 2) : minutes);
			$hours.text(leadingZero ? pad(hours, 2) : hours );
			var pureMinutes = Math.floor(this.milliseconds / 60000);
			$pureMinutes.text(leadingZero ? pad(pureMinutes, 2) : pureMinutes);
			var pureSeconds = Math.floor(this.milliseconds / 1000);
			$pureSeconds.text(leadingZero ? pad(pureSeconds, 2) : pureSeconds);
			$pureMilliseconds.text(leadingZero ? pad(this.milliseconds, 3) : this.milliseconds);
		}

		this.inverseStart = function () {
			var contextThis = this;
			this.timer = setInterval(function(){
				decrement.call(contextThis);
			}, step);
		}

		this.start = function () {
			var contextThis = this;
			this.timer = setInterval(function(){
				increment.call(contextThis);
			}, step);
		}
	}
})(jQuery, window);