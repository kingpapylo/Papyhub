/* tslint:disable */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {FunctionDeclaration, GoogleGenAI, LiveServerMessage, Modality, Session, Type} from '@google/genai';
import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {createBlob, decode, decodeAudioData} from './utils';
import './visual-3d';

@customElement('gdm-live-audio')
export class GdmLiveAudio extends LitElement {
  @state() isRecording = false;
  @state() isWakeWordListening = false;
  @state() isMusicPlaying = false;
  @state() ambientVolume = 0.5;
  @state() ambientTrack = 0;
  @state() showMusicControls = false;
  @state() status = '';
  @state() error = '';
  @state() serverStatus = 'offline';
  @state() currentUser: string | null = 'Guest';
  @state() isProcessing = false;
  @state() showSettings = false;
  @state() memories: any[] = [];
  @state() networkError = '';

  private currentTurnTranscript = '';
  private currentModelTranscript = '';

  private client: GoogleGenAI;
  private session: Session;
  private inputAudioContext = new ((window as any).AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 16000});
  private outputAudioContext = new ((window as any).AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 24000});
  @state() inputNode = this.inputAudioContext.createGain();
  @state() outputNode = this.outputAudioContext.createGain();
  private nextStartTime = 0;
  private mediaStream: MediaStream;
  private sourceNode: AudioBufferSourceNode;
  private scriptProcessorNode: ScriptProcessorNode;
  private sources = new Set<AudioBufferSourceNode>();
  private isModelSpeaking = false;
  private ambientNodes: AudioNode[] = [];
  private ambientMasterGain: GainNode;
  private recognition: any;

  static styles = css`
    .auth-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 15, 15, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 24px;
      z-index: 100;
      width: 300px;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }

    .auth-modal h2 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }

    .auth-modal input {
      width: 100%;
      padding: 12px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      box-sizing: border-box;
    }

    .auth-modal button {
      width: 100%;
      padding: 12px;
      background: white;
      color: black;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }

    .auth-modal .switch-mode {
      text-align: center;
      margin-top: 15px;
      font-size: 12px;
      opacity: 0.6;
      cursor: pointer;
    }

    .user-badge {
      position: fixed;
      top: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 14px;
    }

    .user-badge button {
      background: none;
      border: none;
      color: #f87171;
      cursor: pointer;
      font-size: 12px;
      padding: 0;
    }

    .settings-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .settings-btn:hover {
      opacity: 1;
    }

    .logo-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      pointer-events: none;
    }

    .logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
    }

    .app-title {
      font-family: 'Georgia', serif;
      font-style: italic;
      font-size: 14px;
      color: rgba(255, 215, 0, 0.8);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .settings-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 15, 15, 0.98);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 24px;
      z-index: 200;
      width: 320px;
      backdrop-filter: blur(30px);
      box-shadow: 0 30px 60px rgba(0,0,0,0.8);
    }

    .settings-modal h2 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .error-toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(248, 113, 113, 0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      z-index: 1000;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translate(-50%, 100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    #status {
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      z-index: 10;
      text-align: center;
    }

    .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 260px;
      height: 260px;
      border: 2px solid transparent;
      border-top-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: spin 2s linear infinite;
      pointer-events: none;
      z-index: 5;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .loader.visible {
      opacity: 1;
    }

    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .controls {
      z-index: 10;
      position: absolute;
      bottom: 10vh;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;

      button {
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        width: 64px;
        height: 64px;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        margin: 0;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      button[disabled] {
        display: none;
      }

      .music-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 100;

        &.active {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        svg {
          width: 24px;
          height: 24px;
        }
      }

      .music-controls-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 200px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 16px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 16px;
        color: white;
        font-family: sans-serif;
        font-size: 14px;
        transform: translateY(-10px);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;

        &.visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;

          label {
            font-size: 12px;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        }

        input[type='range'] {
          width: 100%;
          cursor: pointer;
        }

        select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px;
          border-radius: 8px;
          outline: none;
          cursor: pointer;

          option {
            background: #1a1a1a;
          }
        }
      }
    }
  `;

  constructor() {
    super();
    this.initClient();
  }

  private initAudio() {
    this.nextStartTime = this.outputAudioContext.currentTime;
  }

  private async initClient() {
    this.initAudio();
    this.initWakeWord();

    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.ambientMasterGain = this.outputAudioContext.createGain();
    this.ambientMasterGain.gain.setValueAtTime(
      this.ambientVolume * 0.05,
      this.outputAudioContext.currentTime,
    );
    this.ambientMasterGain.connect(this.outputAudioContext.destination);

    this.outputNode.connect(this.outputAudioContext.destination);

    this.initSession();
  }

  private initWakeWord() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('')
        .toLowerCase();

      if (transcript.includes('hey orb') || transcript.includes('wake up') || transcript.includes('hello orb') || transcript.includes('hey google')) {
        if (!this.isRecording) {
          this.startRecording();
          this.playWakeUpSound();
        }
      }
    };

    this.recognition.onend = () => {
      if (this.isWakeWordListening && !this.isRecording) {
        this.recognition.start();
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        this.isWakeWordListening = false;
      }
    };
  }

  private toggleWakeWord() {
    if (this.isWakeWordListening) {
      this.recognition?.stop();
      this.isWakeWordListening = false;
      this.updateStatus('Wake word listening disabled.');
    } else {
      try {
        this.recognition?.start();
        this.isWakeWordListening = true;
        this.updateStatus('Listening for "Hey Orb"...');
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }

  private playWakeUpSound() {
    const ctx = this.outputAudioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  private playResponseSound() {
    const ctx = this.outputAudioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  private async initSession() {
    if (!navigator.onLine) {
      this.updateStatus('Offline: AI features unavailable. Check your connection.');
      return;
    }

    if (this.session) {
      try {
        this.session.close();
      } catch (e) {}
    }
    const model = 'gemini-2.5-flash-native-audio-preview-09-2025';

    const tools: FunctionDeclaration[] = [
      {
        name: 'get_time',
        description: 'Get the current local time and date.',
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
      {
        name: 'set_ambient_music',
        description: 'Change the ambient background music track.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            track_index: {
              type: Type.INTEGER,
              description: 'The index of the track (0: Deep, 1: Ethereal, 2: Cosmic).',
            },
          },
          required: ['track_index'],
        },
      },
      {
        name: 'set_ambient_volume',
        description: 'Change the volume of the ambient background music.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            volume: {
              type: Type.NUMBER,
              description: 'The volume level from 0.0 to 1.0.',
            },
          },
          required: ['volume'],
        },
      },
      {
        name: 'toggle_recording',
        description: 'Stop the current recording session.',
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
    ];

    try {
      this.session = await this.client.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            this.updateStatus('Opened');
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.inputTranscription?.text) {
              this.currentTurnTranscript = message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              this.currentModelTranscript += message.serverContent.modelTurn.parts[0].text;
            }

            // Handle Tool Calls
            if (message.toolCall) {
              const responses = [];
              for (const call of message.toolCall.functionCalls) {
                let result: any = {status: 'success'};

                if (call.name === 'get_time') {
                  result = {time: new Date().toLocaleString()};
                } else if (call.name === 'set_ambient_music') {
                  const idx = call.args.track_index as number;
                  if (idx >= 0 && idx <= 2) {
                    this.ambientTrack = idx;
                    if (this.isMusicPlaying) {
                      this.stopAmbientMusic();
                      setTimeout(() => this.startAmbientMusic(), 100);
                    }
                    result = {status: 'success', track: idx};
                  } else {
                    result = {status: 'error', message: 'Invalid track index'};
                  }
                } else if (call.name === 'set_ambient_volume') {
                  const vol = call.args.volume as number;
                  this.ambientVolume = Math.max(0, Math.min(1, vol));
                  if (this.ambientMasterGain) {
                    this.ambientMasterGain.gain.setTargetAtTime(
                      this.ambientVolume * 0.05,
                      this.outputAudioContext.currentTime,
                      0.1,
                    );
                  }
                  result = {status: 'success', volume: vol};
                } else if (call.name === 'toggle_recording') {
                  this.stopRecording();
                  result = {status: 'success'};
                }

                responses.push({
                  id: call.id,
                  name: call.name,
                  response: result,
                });
              }

              this.session.sendToolResponse({
                functionResponses: responses,
              });
            }

            const audio =
              message.serverContent?.modelTurn?.parts[0]?.inlineData;

            if (audio) {
              this.isProcessing = false;
              if (!this.isModelSpeaking) {
                this.isModelSpeaking = true;
                this.playResponseSound();
              }

              this.nextStartTime = Math.max(
                this.nextStartTime,
                this.outputAudioContext.currentTime,
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                this.outputAudioContext,
                24000,
                1,
              );
              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode);
              source.addEventListener('ended', () => {
                this.sources.delete(source);
              });

              source.start(this.nextStartTime);
              this.nextStartTime = this.nextStartTime + audioBuffer.duration;
              this.sources.add(source);
            }

            if (message.serverContent?.turnComplete) {
              this.isModelSpeaking = false;
              this.isProcessing = false;

              if (this.currentTurnTranscript) {
                this.saveMemory('user', this.currentTurnTranscript);
                this.currentTurnTranscript = '';
              }
              if (this.currentModelTranscript) {
                this.saveMemory('assistant', this.currentModelTranscript);
                this.currentModelTranscript = '';
              }
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              this.isModelSpeaking = false;
              this.isProcessing = false;

              if (this.currentModelTranscript) {
                this.saveMemory('assistant', this.currentModelTranscript + ' (interrupted)');
                this.currentModelTranscript = '';
              }

              for (const source of this.sources.values()) {
                source.stop();
                this.sources.delete(source);
              }
              this.nextStartTime = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            this.updateError(e.message);
          },
          onclose: (e: CloseEvent) => {
            this.updateStatus('Close:' + e.reason);
          },
        },
        config: {
          systemInstruction: `You are the Orbital Assistant, a helpful and proactive AI agent living inside this interactive 3D orb. 
          You can help users with various tasks, answer questions, and control your own environment.
          
          ${this.memories.length > 0 ? `HISTORY OF PREVIOUS CONVERSATIONS WITH ${this.currentUser}:
          ${this.memories.slice().reverse().map(m => `[${new Date(m.timestamp).toLocaleDateString()}] ${m.role}: ${m.content}`).join('\n')}
          
          Use this history to provide context, remember user preferences, and continue previous discussions.` : ''}

          Capabilities:
          - You can tell the user the current time.
          - You can change the ambient background music (Deep, Ethereal, or Cosmic).
          - You can adjust the ambient volume.
          - You can stop recording if the user is done talking.
          
          Be concise, friendly, and helpful. Use your voice to express personality.`,
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [{functionDeclarations: tools}],
          speechConfig: {
            voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Orus'}},
            // languageCode: 'en-GB'
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadLocalData();
    this.initSession();

    window.addEventListener('online', () => {
      this.updateStatus('Back online. Reconnecting...');
      this.initSession();
    });
    window.addEventListener('offline', () => {
      this.updateStatus('Connection lost. AI features disabled.');
    });
  }

  private loadLocalData() {
    try {
      const settings = localStorage.getItem('ope_opa_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.ambientVolume = parsed.ambientVolume ?? 0.5;
        this.ambientTrack = parsed.ambientTrack ?? 0;
        if (this.ambientMasterGain) {
          this.ambientMasterGain.gain.setValueAtTime(this.ambientVolume * 0.05, this.outputAudioContext.currentTime);
        }
      }

      const memories = localStorage.getItem('ope_opa_memories');
      if (memories) {
        this.memories = JSON.parse(memories);
      }
    } catch (e) {
      console.error('Failed to load local data:', e);
    }
  }

  private saveMemory(role: string, content: string) {
    if (!content.trim()) return;
    const newMemory = { role, content, timestamp: new Date().toISOString() };
    this.memories = [newMemory, ...this.memories].slice(0, 50); // Keep last 50
    try {
      localStorage.setItem('ope_opa_memories', JSON.stringify(this.memories));
    } catch (e) {
      console.warn('Failed to save memory locally:', e);
    }
  }

  private saveUserSettings() {
    try {
      localStorage.setItem('ope_opa_settings', JSON.stringify({
        ambientVolume: this.ambientVolume,
        ambientTrack: this.ambientTrack
      }));
    } catch (e) {
      console.warn('Failed to save settings locally:', e);
    }
  }

  private showNetworkError(msg: string) {
    this.networkError = msg;
    setTimeout(() => this.networkError = '', 5000);
  }

  private updateStatus(msg: string) {
    this.status = msg;
  }

  private updateError(msg: string) {
    this.error = msg;
  }

  private async startRecording() {
    if (this.isRecording) {
      return;
    }

    this.isProcessing = false;

    if (this.isWakeWordListening) {
      this.recognition?.stop();
    }

    this.inputAudioContext.resume();

    this.updateStatus('Requesting microphone access...');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.updateStatus('Microphone access granted. Starting capture...');

      this.sourceNode = this.inputAudioContext.createMediaStreamSource(
        this.mediaStream,
      );
      this.sourceNode.connect(this.inputNode);

      const bufferSize = 256;
      this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(
        bufferSize,
        1,
        1,
      );

      this.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        if (!this.isRecording) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);

        this.session.sendRealtimeInput({media: createBlob(pcmData)});
      };

      this.sourceNode.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.inputAudioContext.destination);

      this.isRecording = true;
      this.updateStatus('🔴 Recording... Capturing PCM chunks.');
    } catch (err) {
      console.error('Error starting recording:', err);
      this.updateStatus(`Error: ${err.message}`);
      this.stopRecording();
    }
  }

  private stopRecording() {
    if (!this.isRecording && !this.mediaStream && !this.inputAudioContext)
      return;

    this.updateStatus('Stopping recording...');

    this.isRecording = false;
    this.isProcessing = true;

    if (this.isWakeWordListening) {
      setTimeout(() => {
        try {
          this.recognition?.start();
        } catch (e) {
          // Ignore if already started
        }
      }, 500);
    }

    if (this.scriptProcessorNode && this.sourceNode && this.inputAudioContext) {
      this.scriptProcessorNode.disconnect();
      this.sourceNode.disconnect();
    }

    this.scriptProcessorNode = null;
    this.sourceNode = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.updateStatus('Recording stopped. Click Start to begin again.');
  }

  private reset() {
    this.session?.close();
    this.initSession();
    this.updateStatus('Session cleared.');
  }

  private toggleMusic() {
    if (this.isMusicPlaying) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic();
    }
    this.isMusicPlaying = !this.isMusicPlaying;
  }

  private toggleMusicControls() {
    this.showMusicControls = !this.showMusicControls;
  }

  private handleVolumeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.ambientVolume = parseFloat(input.value);
    if (this.ambientMasterGain) {
      this.ambientMasterGain.gain.setTargetAtTime(
        this.ambientVolume * 0.05,
        this.outputAudioContext.currentTime,
        0.1,
      );
    }
    this.saveUserSettings();
  }

  private handleTrackChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.ambientTrack = parseInt(select.value);
    if (this.isMusicPlaying) {
      this.stopAmbientMusic();
      setTimeout(() => this.startAmbientMusic(), 1200);
    }
    this.saveUserSettings();
  }

  private startAmbientMusic() {
    const ctx = this.outputAudioContext;

    const tracks = [
      {
        name: 'Deep',
        freqs: [65.41, 98.0, 130.81, 196.0],
        type: 'sine' as OscillatorType,
      },
      {
        name: 'Ethereal',
        freqs: [130.81, 164.81, 196.0, 246.94],
        type: 'triangle' as OscillatorType,
      },
      {
        name: 'Cosmic',
        freqs: [32.7, 49.0, 65.41, 82.41],
        type: 'sine' as OscillatorType,
      },
    ];

    const track = tracks[this.ambientTrack];

    track.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = track.type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Slow volume modulation
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(this.ambientMasterGain);

      osc.start();
      lfo.start();

      this.ambientNodes.push(osc, lfo, gain, lfoGain);
    });
  }

  private stopAmbientMusic() {
    const ctx = this.outputAudioContext;
    this.ambientNodes.forEach((node) => {
      if (node instanceof GainNode) {
        node.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      }
    });

    setTimeout(() => {
      this.ambientNodes.forEach((node) => {
        if (node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      });
      this.ambientNodes = [];
    }, 1100);
  }

  render() {
    return html`
      <div>
        <div class="logo-container">
          <img src="/logo.png" class="logo" alt="Ope Opa Nation Logo" onerror="this.src='https://picsum.photos/seed/orb/200/200'" />
          <div class="app-title">Ope Opa Nation</div>
        </div>

        <div class="user-badge">
          <span>Local Profile</span>
          <button class="settings-btn" @click=${() => this.showSettings = true} title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        ${this.networkError ? html`<div class="error-toast">${this.networkError}</div>` : ''}

        ${this.showSettings ? html`
          <div class="settings-modal">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Settings
            </h2>
            
            <div class="music-controls-panel visible" style="position: static; width: 100%; background: none; border: none; padding: 0;">
              <div class="control-group">
                <label>Ambient Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  .value=${this.ambientVolume}
                  @input=${this.handleVolumeChange} />
              </div>
              <div class="control-group">
                <label>Ambient Track</label>
                <select @change=${this.handleTrackChange} .value=${this.ambientTrack}>
                  <option value="0">Deep Pad</option>
                  <option value="1">Ethereal Triangle</option>
                  <option value="2">Cosmic Sub</option>
                </select>
              </div>
            </div>

            <button @click=${() => this.showSettings = false} style="margin-top: 20px;">Close</button>
          </div>
        ` : ''}

        <div class="loader ${this.isProcessing ? 'visible' : ''}"></div>

        <button
          class="music-toggle ${this.isMusicPlaying ? 'active' : ''}"
          @click=${this.toggleMusic}
          @contextmenu=${(e: Event) => {
            e.preventDefault();
            this.toggleMusicControls();
          }}
          title="Toggle Ambient Music (Right-click for controls)">
          ${this.isMusicPlaying
            ? html`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>`
            : html`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z" />
              </svg>`}
        </button>

        <div
          class="music-controls-panel ${this.showMusicControls ? 'visible' : ''}">
          <div class="control-group">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              .value=${this.ambientVolume}
              @input=${this.handleVolumeChange} />
          </div>
          <div class="control-group">
            <label>Ambient Track</label>
            <select @change=${this.handleTrackChange} .value=${this.ambientTrack}>
              <option value="0">Deep Pad</option>
              <option value="1">Ethereal Triangle</option>
              <option value="2">Cosmic Sub</option>
            </select>
          </div>
          <button
            style="background: none; border: none; color: white; opacity: 0.5; font-size: 10px; cursor: pointer; padding: 0;"
            @click=${this.toggleMusicControls}>
            Close Controls
          </button>
        </div>

        <div class="controls">
          <button
            class="music-toggle ${this.isWakeWordListening ? 'active' : ''}"
            style="position: static; margin-bottom: 10px;"
            @click=${this.toggleWakeWord}
            title="Toggle Voice Wake Up ('Hey Orb')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24px"
              height="24px">
              <path
                d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path
                d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
          <button
            id="resetButton"
            @click=${this.reset}
            ?disabled=${this.isRecording}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#ffffff">
              <path
                d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
          <button
            id="startButton"
            @click=${this.startRecording}
            ?disabled=${this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#c80000"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </button>
          <button
            id="stopButton"
            @click=${this.stopRecording}
            ?disabled=${!this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#000000"
              xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="100" height="100" rx="15" />
            </svg>
          </button>
        </div>

        <div id="status">
          <span style="color: #60a5fa; font-size: 10px; opacity: 0.8;">● Offline Mode (Local Data)</span>
          <br />
          ${this.error}
        </div>
        <gdm-live-audio-visuals-3d
          .inputNode=${this.inputNode}
          .outputNode=${this.outputNode}
          .isWakeWordListening=${this.isWakeWordListening}></gdm-live-audio-visuals-3d>
      </div>
    `;
  }
}
