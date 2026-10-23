"""Export a silent R0 technical workprint from a successful capture, no paid calls."""
from pathlib import Path
import subprocess,json,hashlib,argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--start',type=float,default=0);parser.add_argument('--duration',type=float);args=parser.parse_args()
if args.start<0 or (args.duration is not None and args.duration<=0):raise ValueError('Invalid cut bounds')
def run(args):return subprocess.run(args,check=True,capture_output=True)
latest=json.loads((ROOT/'work/latest-rehearsal.json').read_text(encoding='utf8'))
take=(ROOT/latest['take']).resolve()
if not take.is_relative_to((ROOT/'work/rehearsals').resolve()):raise ValueError('Take is outside rehearsal workspace')
report=json.loads((take/'capture.json').read_text(encoding='utf8'))
if report['status']!='captured' or report['errors']:raise ValueError('Capture failed; do not export it as successful')
source=(take/report['rawVideo']).resolve()
if not source.is_relative_to(take):raise ValueError('Source is outside take')
source_probe=json.loads(run(['ffprobe','-v','error','-show_format','-of','json',str(source)]).stdout)
source_duration=float(source_probe['format']['duration'])
if args.start>=source_duration or (args.duration and args.start+args.duration>source_duration):raise ValueError('Cut exceeds source media bounds')
cut=args.start>0 or args.duration is not None
out=take/('CareTable-R0-SILENT-PREVIEW-REVIEW-CUT.mp4' if cut else 'CareTable-R0-SILENT-PREVIEW-WORKPRINT.mp4')
cmd=['ffmpeg','-v','error','-threads','2','-ss',str(args.start),'-i',str(source)]
if args.duration:cmd+=['-t',str(args.duration)]
run(cmd+['-an','-c:v','libx264','-threads','2','-preset','fast','-crf','20','-pix_fmt','yuv420p','-r','24','-movflags','+faststart','-y',str(out)])
probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(out)]).stdout)
run(['ffmpeg','-v','error','-i',str(out),'-f','null','-'])
data={'file':out.name,'status':'silent technical workprint, not final','sourceStart':args.start,'requestedDuration':args.duration,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'probe':probe,'fullDecodePassed':True,'humanWatchListenApproval':False,'sourceCapture':report}
(take/('verification-review-cut.json' if cut else 'verification.json')).write_text(json.dumps(data,indent=2),encoding='utf8')
print(json.dumps({'file':str(out),'duration':probe['format']['duration'],'fullDecodePassed':True}))
