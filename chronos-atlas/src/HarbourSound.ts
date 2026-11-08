// Local sound synthesis. No microphone, external recording, or network requests.
export class HarbourSound {
  private context:AudioContext|null=null;
  async start(){
    if(this.context){await this.context.resume();return;}
    const ctx=new AudioContext();this.context=ctx;
    const buffer=ctx.createBuffer(1,ctx.sampleRate*6,ctx.sampleRate),samples=buffer.getChannelData(0);let previous=0;
    for(let i=0;i<samples.length;i++){previous=(previous+Math.random()*.04-.02)/1.02;samples[i]=previous*3.5;}
    const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
    const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=950;
    const gain=ctx.createGain();gain.gain.value=.065;
    const tide=ctx.createOscillator();tide.frequency.value=.13;
    const tideGain=ctx.createGain();tideGain.gain.value=.035;tide.connect(tideGain);tideGain.connect(gain.gain);
    source.connect(low);low.connect(gain);gain.connect(ctx.destination);source.start();tide.start();await ctx.resume();
  }
  async stop(){await this.context?.suspend();}
  async dispose(){await this.context?.close();this.context=null;}
}
