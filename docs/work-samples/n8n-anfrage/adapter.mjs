import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
// Read credentials server-side only; never include them in workflow exports.
if (process.env.HASSANI_RESEND_ENV_FILE) {
 const env=readFileSync(process.env.HASSANI_RESEND_ENV_FILE,'utf8');
 for(const line of env.split(/\r?\n/)){const m=line.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&['G3_DEMO_RESEND_API_KEY','G3_DEMO_EMAIL_FROM'].includes(m[1])){let v=m[2].trim();if((v.startsWith('\"')&&v.endsWith('\"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);process.env[m[1]]??=v;}}
}
const mailTimes=[];

const seen=new Set();
export function createAdapter(){return http.createServer(async(req,res)=>{res.setHeader('Content-Type','application/json');
 if(req.url==='/health'){res.end(JSON.stringify({ready:true,mode:'local_test'}));return;}
 if(req.method!=='POST'||!['/crm','/mail'].includes(req.url)){res.writeHead(404);res.end('{}');return;}
 let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8192){res.writeHead(413);res.end('{}');return;}}
 let r;try{r=JSON.parse(raw);}catch{res.writeHead(400);res.end('{}');return;}
 if(r.valid!==true||r.consent!==true||r.mode!=='local_test'){res.writeHead(422);res.end(JSON.stringify({...r,status:'invalid'}));return;}
 let status;
 if(req.url==='/crm'){
  if(r.case==='crm_failure')status='crm_failed';
  else if(seen.has(r.email))status='duplicate';
  else {seen.add(r.email);r.eventId=randomUUID();status='crm_created';}
 }else{
  status=r.status==='crm_created'?(r.case==='mail_failure'?'mail_failed':'mail_test_accepted'):'invalid';
 }
 if(req.url==='/mail'&&r.case==='form'&&status==='mail_test_accepted'){
  const key=process.env.G3_DEMO_RESEND_API_KEY,from=process.env.G3_DEMO_EMAIL_FROM;
  if(!key||!from){res.writeHead(503);res.end(JSON.stringify({...r,status:'mail_not_configured'}));return;}
  const now=Date.now();while(mailTimes.length&&now-mailTimes[0]>3600000)mailTimes.shift();
  if(mailTimes.length>=30){res.writeHead(429);res.end(JSON.stringify({...r,status:'mail_rate_limited'}));return;}
  mailTimes.push(now);
  try {
   const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`hassani-n8n/${r.eventId}`},body:JSON.stringify({from,to:[r.email],subject:'Deine Anfrage — echte n8n-Demo von Hassani Solutions',text:`Hallo ${r.name},\n\ndeine Eingabe wurde gerade in unserem echten n8n-Workflow verarbeitet: Datenprüfung, Duplikatprüfung, simulierte CRM-Aufgabe und diese automatisch über Resend versendete E-Mail.\n\nDies ist eine Arbeitsprobe. Es wurde kein Auftrag erteilt und keine Buchung vorgenommen. Der CRM-Schritt ist eine Simulation.\n\nViele Grüße\nHassani Solutions\nhttps://hassanisolutions.com`}),signal:AbortSignal.timeout(10000)});
   const data=await response.json();
   if(!response.ok||typeof data.id!=='string')throw Error('provider_failed');
   res.end(JSON.stringify({...r,status:'mail_accepted',mail:{simulated:false,provider:'Resend',id:data.id,delivery:'accepted_not_delivery_confirmed'}}));return;
  }catch{res.writeHead(502);res.end(JSON.stringify({...r,status:'mail_failed',reason:'Versand nicht bestätigt; keine Zustellung behauptet.'}));return;}
 }
 res.writeHead(['crm_failed','mail_failed'].includes(status)?503:200);
 res.end(JSON.stringify({...r,status,crm:status==='crm_created'?{simulated:true,task:'Anfrage prüfen',stored:'memory_only'}:r.crm,mail:status==='mail_test_accepted'?{simulated:true,delivered:false,subject:'Deine Anfrage bei Hassani Solutions',text:`Hallo ${r.name}, wir haben deine Anfrage erhalten. Dies ist eine lokale Testvorschau.`}:undefined}));
 });}
if(process.argv[1]===new URL(import.meta.url).pathname)createAdapter().listen(5689,'127.0.0.1',()=>console.log('Lokaler Testadapter: http://127.0.0.1:5689/health — Formulare versenden echte Resend-Mails; synthetische Tests bleiben ohne Versand'));
