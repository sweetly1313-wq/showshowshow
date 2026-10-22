import {NextResponse} from 'next/server';

export const runtime='nodejs';
export const maxDuration=60;
// Per-instance budget; use a shared hosting limit when scaling to multiple instances.
let windowStart=Date.now();
let requests=0;
export async function POST(request:Request){
 if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin) return NextResponse.json({error:'사이트에서 다시 요청해 주세요.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>4096) return NextResponse.json({error:'질문이 너무 길어요.'},{status:413});
 let query:unknown;
 try {({query}=await request.json());}catch{return NextResponse.json({error:'올바른 질문을 입력해 주세요.'},{status:400});}
 if(typeof query!=='string'||!query.trim()||query.length>600)return NextResponse.json({error:'질문은 1~600자로 입력해 주세요.'},{status:400});
 const key=process.env.CHATGPT_KEY;
 if(!key)return NextResponse.json({error:'레시피 AI 연결을 준비 중입니다. 서버 환경변수 CHATGPT_KEY를 설정해 주세요.'},{status:503});
 if(Date.now()-windowStart>60000){windowStart=Date.now();requests=0;}
 if(requests>=10)return NextResponse.json({error:'잠시 요청이 많아요. 1분 후 다시 시도해 주세요.'},{status:429,headers:{'Retry-After':'60'}});
 requests++;
 try{
 const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(50000),body:JSON.stringify({model:process.env.CHATGPT_MODEL||'gpt-5.4-mini',store:false,max_output_tokens:2200,instructions:'한국어 요리 안내자입니다. 사용자 재료와 조건에 맞는 요리 하나를 제안하세요. 역사에서 불확실한 기원이나 연대를 지어내지 마세요. 재료에는 분량과 인분을, 단계에는 시간과 안전한 조리를 포함하세요. 알레르기 조건을 지키세요. videoQuery는 해당 요리의 한국어 조리 동영상 검색어입니다. URL이나 영상 ID를 만들지 마세요.',input:query.trim(),text:{format:{type:'json_schema',name:'recipe',strict:true,schema:{type:'object',properties:{title:{type:'string'},history:{type:'string'},ingredients:{type:'array',items:{type:'string'}},steps:{type:'array',items:{type:'string'}},videoQuery:{type:'string'}},required:['title','history','ingredients','steps','videoQuery'],additionalProperties:false}}}})});
 if(!response.ok)return NextResponse.json({error:response.status===429?'요청이 많거나 API 사용 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.':'AI 연결에 실패했습니다. 서버의 API 키와 모델 접근 권한을 확인해 주세요.'},{status:502});
 const data=await response.json();
 const text=data.output?.flatMap((o:{content?:{type:string;text?:string}[]})=>o.content||[]).filter((c:{type:string})=>c.type==='output_text').map((c:{text:string})=>c.text).join('');
 if(data.status!=='completed'||!text)throw Error('Incomplete response');
 const recipe=JSON.parse(text);
 if(typeof recipe.title!=='string'||typeof recipe.history!=='string'||typeof recipe.videoQuery!=='string'||!Array.isArray(recipe.ingredients)||!recipe.ingredients.every((v:unknown)=>typeof v==='string')||!Array.isArray(recipe.steps)||!recipe.steps.every((v:unknown)=>typeof v==='string'))throw Error('Invalid response');
 return NextResponse.json({recipe},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'레시피 응답을 완성하지 못했어요. 잠시 후 다시 시도해 주세요.'},{status:502});}
}
