var Synth = function(audiolet, frequency) {
	AudioletGroup.call(this, audiolet, 0, 1);
	// Basic wave
	this.sine = new Sine(audiolet, frequency);

	// Gain envelope
	this.gain = new Gain(audiolet);
	this.env = new PercussiveEnvelope(audiolet, 1, 0.1, 0.1,
		function() {
			this.audiolet.scheduler.addRelative(0,
				this.remove.bind(this));
		}.bind(this)
	);

	// Main signal path
	this.sine.connect(this.gain);
	this.gain.connect(this.outputs[0]);

	// Envelope
	this.env.connect(this.gain, 0, 1);
}
extend(Synth, AudioletGroup);


		
var SchedulerPlayAudio = function(audio) {
	this.audiolet = new Audiolet();

	var freqArray = new Array();
	var durationArray = new Array();
	
	// loop through score array for each note object
	for (var i = 0; i < audio.length; i++) {
		freqArray.push(audio[i].name.frequency());
		durationArray.push(audio[i].duration);
	}
	
	var melody = new PSequence(freqArray);
	var frequencyPattern = new PChoose([melody]);
	
	var durationPattern = new PChoose([new PSequence(durationArray)]);
	
	this.audiolet.scheduler.play([frequencyPattern], durationPattern,
		function(frequency) {
			var synth = new Synth(this.audiolet, frequency);
			synth.connect(this.audiolet.output);
		}.bind(this)
	);
	
}