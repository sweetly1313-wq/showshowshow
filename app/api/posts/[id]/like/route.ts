import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {randomUUID} from 'node:crypto';
import {database} from '@/lib/server';
export const preferredRegion='icn1';
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:'올바르지 않은 게시물입니다.'},{status:400});const db=database();if(!db)return NextResponse.json({error:'샘플 전시 중에는 좋아요가 이 브라우저에만 저장됩니다.'},{status:503});const jar=await cookies();let visitor=jar.get('show-visitor')?.value;if(!visitor||! /^[0-9a-f-]{36}$/i.test(visitor))visitor=randomUUID();const {data,error}=await db.rpc('toggle_like',{post_id:id,visitor_id:visitor});if(error)return NextResponse.json({error:'좋아요를 저장하지 못했습니다.'},{status:503});const response=NextResponse.json(data);response.cookies.set('show-visitor',visitor,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:31536000,path:'/'});return response;}
