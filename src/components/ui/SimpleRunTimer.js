// a partially complete rewrite, in the case the original one proves unstable

import React from 'react';
import Stopwatch from 'timer-stopwatch';
import * as timeFuncs from '../../timeHelpers'
import * as colors from '../../css/colors'

class RunTimer extends React.Component {
	constructor(props) {
		super(props);
		const { intervalTime, restIncrement, restTime, totalTime } = props;

		// everything in state is in milliseconds
		this.state = {
			completedIntervals: 0,
			totalTimer: new Stopwatch(totalTime - restTime),
			intervalId: 0,
			intervalMs: intervalTime,
			restMs: restTime,
			active: "interval",
			timeRemaining: props.totalTime - props.restTime,
			running: false,
			can: "",
			go: new Audio(`${this.props.audio.go}`),
			rest: new Audio(`${this.props.audio.rest}`),
			complete: new Audio(`${this.props.audio.timerComplete}`)
		}
	}

	componentDidMount() {
		this.resetTimer()
	}

	componentWillUnmount() {
		this.props.clearTimerForm();
		clearInterval(this.state.totalId)
	}

	resetState = () => {
		const { totalTime, intervalTime, restTime } = this.props;

		this.setState({
			completedIntervals: 0,
			totalTimer: new Stopwatch(totalTime - restTime),
			totalId: 0,
			id: 0,
			intervalMs: intervalTime,
			restMs: restTime,
			newBreak: totalTime - intervalTime,
			active: "interval",
			timeRemaining: totalTime - restTime,
			running: false
		})
	}

	/***** CANVAS METHODS *****/

	getCanInfo = () => {
		const can = document.getElementById('timer-circle');
		const canHeight = can.height;				
		const canWidth = can.width;
		const ctx = can.getContext('2d');

		return({
			can,
			canHeight,
			canWidth,
			ctx
		})
	}

	fillCanvasText = (obj) => {
		const { ctx, canHeight, canWidth } = this.getCanInfo();
		ctx.font=`${obj.fontSize} ${obj.font}`;

		ctx.fillStyle = colors.white;
		if (obj.align) {
			ctx.textAlign=obj.align;
		}
		
		ctx.fillText(obj.text, obj.canWidth/2, obj.canHeight/2);
	}

		fillCanvasColor = (color, x=0, y=0, height) => {
		const { ctx, canWidth } = this.getCanInfo();

		ctx.fillStyle = color;
		ctx.fillRect(x, y, canWidth, height)
	}

	clearCanvas = () => {
		const { ctx, canHeight, canWidth } = this.getCanInfo();

		ctx.clearRect(0,0, canWidth, canHeight)
	}

	fillCanvasOnInterval = () => {
		const { canWidth, can, ctx, canHeight } = this.getCanInfo();
		const { completedIntervals, intervalMs } = this.state;
		const { numIntervals } = this.props;
		const fillHeight = (1 - (this.state.intervalMs / this.props.intervalTime)) * canHeight;
		
		// fill can from the top with % of timer complete
		this.fillCanvasColor(colors.green, 0, 0, canHeight)

		// fill can from % of time complete to bottom with black
		ctx.font="50px Times"
		this.fillCanvasColor(colors.black1, 0, fillHeight, canHeight)	
		this.fillCanvasText({
			text: 'WORK',
			align: 'center',
			fontSize: "30px",
			font: "Calibri",
			canWidth: canWidth,
			canHeight: canHeight/1.5
		});

		this.fillCanvasText({
			text: `${completedIntervals}  / ${numIntervals} `,
			fontSize: "25px",
			font: "Calibri",
			align: "center",
			canWidth: canWidth,
			canHeight: canHeight*1.1
		});

		this.fillCanvasText({
			text: `${timeFuncs.msToText(intervalMs)}`,
			fontSize: "25px",
			font: "Calibri",
			align: "center",
			canWidth: canWidth,
			canHeight: canHeight*1.5
		});
	}

	/***** TIMER METHODS ******/

	startTime = () => this.state.totalTimer.start();
	stopTime = () => this.state.totalTimer.stop();

	endTimer = () => {
		console.log('Timer is done!');

		this.stopTimer();
		this.state.timerComplete.play();

		const { canWidth, canHeight } = this.getCanInfo();

		// this.setState({
		// 	numIntervals: this.state.numIntervals+1,
		// 	timeElapsed: this.props.totalTime - this.props.restTime,
		// 	timeRemaining: 0
		// })

		this.clearCanvas();
		this.fillCanvasText({
			text: 'COMPLETE!',
			fontSize: "30px",
			font: "Calibri",
			align: "center",
			canWidth: canWidth,
			canHeight: canHeight+(canHeight/10)
		})

		const { timerName } = this.props;
		const date = new Date();
		const hour = date.getHours();
		const minute = date.getMinutes();		
		const dateString = date.toDateString();
		const timeString = timeFuncs.timeToStr(hour, minute)
		const totalString = dateString + ' ' + timeString;
		const ms = date.getTime();

		console.groupCollapsed('Before Dispatching addCompletedTimer ');
		console.log(`ms`, ms);
		console.log(`timerName`, timerName);
		console.log(`dateString`, dateString);
		console.groupEnd('Before Dispatching addCompletedTimer ');
		
		this.props.addCompletedTimer({ dateString, ms, timerName });
	}

	resetTimer = () => {
		const { intervalTime, restIncrement, restTime, totalTime } = this.props;
		const { canWidth, canHeight } = this.getCanInfo();

		this.stopTimer();
		this.resetState();
		this.clearCanvas();
		this.fillCanvasText({
			text: 'Touch to Start',
			align: 'center',
			fontSize: "30px",
			font: "Calibri",
			canWidth: canWidth,
			canHeight: canHeight+(canHeight/10)
		});

		console.log('timer has been reset');
	}

	toggleIntervalRest = () => {
		let { timeElapsed, timeRemaining, intervalMs, restMs } = {...this.state};

		if (timeRemaining <= 10) {
			this.endTimer();
		}

		timeElapsed = this.state.totalTimer._elapsedMS
		timeRemaining -= 10;

		this.setState({ timeElapsed, timeRemaining });

		if (this.state.active === 'interval') {
			intervalMs -= 10;
			this.fillCanvasOnInterval();
			if (intervalMs === 10){
				this.setState({ 
					intervalMs: this.props.intervalTime,
					active: 'rest'
				})
				this.state.rest.play()
			} else {
				this.setState({ intervalMs })
			}
			// if it's a rest interval...
		} else {
			restMs -= 10;
			if (restMs === 10){
				this.setState({ 
					restMs: this.props.restTime,
					active: 'interval',
					completedIntervals: this.state.completedIntervals + 1
				})
				this.state.go.play()
			} else {
				this.setState({ restMs })
			}
		}
	}

	runTimer = () => {
		if (!this.state.running) {
			console.log(`running timer`);
			
			const running = true;
			const { totalTimer } = this.state;
			const intervalId = setInterval(this.toggleIntervalRest, 10);

			this.setState({ running, intervalId })

			// if it's the first time runTimer has been called
			if (this.state.completedIntervals === 0){
				this.clearCanvas();
				const completedIntervals = 1;
				this.setState({ completedIntervals })
			}

			this.startTime();
		}
	}

	stopTimer = () => {
		console.log(`stopping timer`);
		this.stopTime();

		const { intervalId } = this.state;
		const running = false;

		clearInterval(intervalId);
		this.setState({ running })
	}

	pixelRatio = () => {
		const ctx = document.createElement("canvas").getContext("2d"),
			dpr = window.devicePixelRatio || 1,
			bsr = ctx.webkitBackingStorePixelRatio ||
					ctx.mozBackingStorePixelRatio ||
					ctx.msBackingStorePixelRatio ||
					ctx.oBackingStorePixelRatio ||
					ctx.backingStorePixelRatio || 1;

		return (dpr / bsr);
	}

	render() {
		const { timerName,
		restIncrement,
		restTime,
		intervalTime,
		totalTime,
		numIntervals,
		incrementIntervals } = this.props;

		const { completedIntervals,
						intervalMs,
						restMs,
						timeElapsed,
						totalTimer,
						active,
						timeRemaining } = this.state;

		const { msToText } = timeFuncs;

		// const can = this.createHiDPIcan(200, 200);

		return (
			<div className="app-run-timer">
				<div className="run-timer__timer-totals">
					<h1>{timerName}</h1>
					<ul className="run-timer__timer-totals-ul">
						<li><span className="timer-totals__label">Total Intervals:</span> <span className="timer-totals__value">{numIntervals} intervals</span></li>
						<li><span className="timer-totals__label">Interval Time:</span> <span className="timer-totals__value">{msToText(intervalTime)}</span></li>						
						<li><span className="timer-totals__label">Rest Time:</span> <span className="timer-totals__value">{msToText(restTime)}</span></li>
						{restIncrement !== 0 && <li>Rest Increment: {msToText(restIncrement)}</li>}
					</ul>
				</div>
				<canvas
					className="run-timer__timer-circle"
					id="timer-circle"
					onClick={() => !this.state.running && this.state.totalTimer.ms > 0 ? this.runTimer() : this.stopTimer()}
				></canvas>
				<div className="run-timer__timer-data">
					<p className="run-timer__timer-data-label">Time Elapsed: {msToText(totalTime-timeRemaining-restTime-1000)}</p>
					<p className="run-timer__timer-data-label">Time Remaining: {msToText(timeRemaining)}</p>
					<button className="run-timer__button run-timer__reset" onClick={() => this.resetTimer()}>Reset</button>
				</div>
			</div>
		)
	}
}

export default RunTimer;
