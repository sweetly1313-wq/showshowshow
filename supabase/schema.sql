-- 쑈쑈쑈: run once in the connected Supabase SQL editor.
begin;
create table if not exists public.posts (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 1 and 80),
 content text not null check (char_length(content) between 1 and 3000),
 author text not null check (char_length(author) between 1 and 30),
 created_at timestamptz not null default now(),
 likes integer not null default 0 check (likes >= 0),
 category text not null default '기타' check (category in ('브랜딩','UI/UX','3D & 아트','그래픽','기타')),
 art integer not null default 0 check (art between 0 and 5),
 is_sample boolean not null default false
);
create table if not exists public.rankings (
 id uuid primary key default gen_random_uuid(),
 nickname text not null check (char_length(nickname) between 1 and 30),
 score integer not null default 0 check (score >= 0),
 played_at timestamptz not null default now()
);
create table if not exists public.post_likes (
 post_id uuid not null references public.posts(id) on delete cascade,
 visitor_id uuid not null,
 created_at timestamptz not null default now(),
 primary key(post_id,visitor_id)
);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists rankings_score_idx on public.rankings(score desc);
alter table public.posts enable row level security;
alter table public.rankings enable row level security;
alter table public.post_likes enable row level security;
drop policy if exists "Public posts are readable" on public.posts;
create policy "Public posts are readable" on public.posts for select to anon,authenticated using(true);
drop policy if exists "Public rankings are readable" on public.rankings;
create policy "Public rankings are readable" on public.rankings for select to anon,authenticated using(true);
revoke all on public.posts,public.rankings,public.post_likes from anon,authenticated;
grant select on public.posts,public.rankings to anon,authenticated;
grant all on public.posts,public.rankings,public.post_likes to service_role;
create or replace function public.toggle_like(post_id uuid, visitor_id uuid) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare total integer; removed integer; liked boolean;
begin
 perform 1 from public.posts where id = post_id for update;
 if not found then raise exception 'Post not found'; end if;
 delete from public.post_likes l where l.post_id=toggle_like.post_id and l.visitor_id=toggle_like.visitor_id;
 get diagnostics removed = row_count;
 if removed > 0 then
  update public.posts set likes=greatest(0,likes-1) where id=post_id returning likes into total;
  liked := false;
 else
  insert into public.post_likes(post_id,visitor_id) values(toggle_like.post_id,toggle_like.visitor_id);
  update public.posts set likes=likes+1 where id=post_id returning likes into total;
  liked := true;
 end if;
 return jsonb_build_object('likes',total,'liked',liked);
end;
$$;
revoke all on function public.toggle_like(uuid,uuid) from public,anon,authenticated;
grant execute on function public.toggle_like(uuid,uuid) to service_role;
insert into public.posts(id,title,content,author,likes,category,art,is_sample,created_at) values
('11111111-1111-4111-8111-111111111111','조금 엉뚱한 하루의 시작','매일 마시는 커피에 작은 상상을 더했습니다. 둥근 형태와 대담한 색으로 풀어낸 가상의 카페 브랜딩, MORNING CLUB. 익숙한 일상이 조금 더 즐거워지길 바라요.','스튜디오 모모',128,'브랜딩',0,true,'2026-10-15T00:00:00Z'),
('22222222-2222-4222-8222-222222222222','마음이 자라는 작은 정원','나만의 속도로 기록하는 마음 정원 앱입니다. 오늘의 기분을 한 송이의 꽃으로 남겨보세요. 이 프로젝트는 UI/UX 콘셉트 작업입니다.','이지안',96,'UI/UX',1,true,'2026-10-14T00:00:00Z'),
('33333333-3333-4333-8333-333333333333','상상은 원래 말랑한 거야','완벽하지 않아도 괜찮은 캐릭터들. 말랑한 질감과 유쾌한 표정으로 만든 3D 오브젝트 실험입니다.','말랑 스튜디오',84,'3D & 아트',2,true,'2026-10-13T00:00:00Z'),
('44444444-4444-4444-8444-444444444444','소리에도 색깔이 있다면','음악의 리듬을 타이포그래피로 번역한 가상의 페스티벌 포스터. 크게, 자유롭게, 조금은 시끄럽게!','박유월',72,'그래픽',3,true,'2026-10-12T00:00:00Z'),
('55555555-5555-4555-8555-555555555555','좋아하는 것들을 모으는 방법','취향 수집가를 위한 디지털 아카이브. 작은 발견을 오래 간직할 수 있는 인터페이스를 디자인했습니다.','김소소',63,'UI/UX',4,true,'2026-10-11T00:00:00Z'),
('66666666-6666-4666-8666-666666666666','지구를 위한 가벼운 한 걸음','다시 쓰는 일상을 제안하는 리빙 브랜드 LOOP의 콘셉트 작업. 부드러운 초록색과 순환하는 형태에 메시지를 담았습니다.','오브젝트 랩',51,'브랜딩',5,true,'2026-10-10T00:00:00Z')
on conflict(id) do nothing;
commit;
