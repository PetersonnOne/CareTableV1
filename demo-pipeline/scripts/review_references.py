"""Local reference sampling/transcription; never edits sources or calls paid APIs."""
from pathlib import Path
import subprocess, json, argparse
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
REFERENCES={
 'parallel':Path('E:/Agent Studio Pt2/Screen Capture/Parallel： AI Conference Planner for Teams ｜ Convex All Gas Hackathon [dxzxkJJZu2E].mp4'),
 'tonight':Path('D:/Agent Studio/Codex App/Hackathons/Amazon Hackathon 2026/Tonight Together - Milestone 2/Submission Video/Tonight-Together-Official-Demo.mp4'),
}
def run(cmd):return subprocess.run(cmd,check=True,capture_output=True)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--transcribe',action='store_true');args=parser.parse_args()
 for name,source in REFERENCES.items():
  target=ROOT/'work'/'reference-review'/name;target.mkdir(parents=True,exist_ok=True)
  info=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(source)]).stdout)
  (target/'probe.json').write_text(json.dumps(info,indent=2),encoding='utf8')
  run(['ffmpeg','-v','error','-threads','2','-i',str(source),'-vf','fps=1/8:start_time=0,scale=480:270','-q:v','3','-y',str(target/'frame-%03d.jpg')])
  frames=sorted(target.glob('frame-*.jpg'));font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',18)
  for start in range(0,len(frames),12):
   sheet=Image.new('RGB',(1920,930),'#10212b');draw=ImageDraw.Draw(sheet)
   for offset,path in enumerate(frames[start:start+12]):
    x=(offset%4)*480;y=(offset//4)*310;sheet.paste(Image.open(path),(x,y))
    sec=(start+offset)*8;draw.text((x+10,y+275),f'{name} / approx {sec//60:02}:{sec%60:02}',font=font,fill='#f4ebdb')
   sheet.save(target/f'contact-{start//12+1}.jpg',quality=92)
  if args.transcribe:
   audio=target/'audio.wav';run(['ffmpeg','-v','error','-i',str(source),'-vn','-ar','16000','-ac','1','-y',str(audio)])
   from faster_whisper import WhisperModel
   model=WhisperModel('tiny.en',device='cpu',compute_type='int8',local_files_only=True,cpu_threads=2)
   # FFmpeg already normalized PCM; bypass host PyAV version differences.
   import wave, numpy as np
   with wave.open(str(audio),'rb') as wav:
    samples=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(np.float32)/32768.0
   segments,details=model.transcribe(samples,language='en',beam_size=3)
   data=[dict(start=s.start,end=s.end,text=s.text.strip()) for s in segments]
   (target/'transcript-machine.json').write_text(json.dumps(data,indent=2),encoding='utf8')
   (target/'transcript-machine.txt').write_text('\n'.join(f"{s['start']:.2f}–{s['end']:.2f} {s['text']}" for s in data),encoding='utf8')
  print(f'{name}: sampled {len(frames)} frames'+(' and transcribed locally' if args.transcribe else ''),flush=True)
if __name__=='__main__':main()
