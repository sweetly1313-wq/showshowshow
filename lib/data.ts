export type Post = {id:string;title:string;content:string;author:string;created_at:string;likes:number;category:string;art:number;is_sample?:boolean};
export const samples:Post[] = [
 {id:'11111111-1111-4111-8111-111111111111',title:'조금 엉뚱한 하루의 시작',content:'매일 마시는 커피에 작은 상상을 더했습니다. 둥근 형태와 대담한 색으로 풀어낸 가상의 카페 브랜딩, MORNING CLUB. 익숙한 일상이 조금 더 즐거워지길 바라요.',author:'스튜디오 모모',category:'브랜딩',art:0,likes:128,created_at:'2026-10-15T00:00:00Z',is_sample:true},
 {id:'22222222-2222-4222-8222-222222222222',title:'마음이 자라는 작은 정원',content:'나만의 속도로 기록하는 마음 정원 앱입니다. 오늘의 기분을 한 송이의 꽃으로 남겨보세요. 이 프로젝트는 UI/UX 콘셉트 작업입니다.',author:'이지안',category:'UI/UX',art:1,likes:96,created_at:'2026-10-14T00:00:00Z',is_sample:true},
 {id:'33333333-3333-4333-8333-333333333333',title:'상상은 원래 말랑한 거야',content:'완벽하지 않아도 괜찮은 캐릭터들. 말랑한 질감과 유쾌한 표정으로 만든 3D 오브젝트 실험입니다.',author:'말랑 스튜디오',category:'3D & 아트',art:2,likes:84,created_at:'2026-10-13T00:00:00Z',is_sample:true},
 {id:'44444444-4444-4444-8444-444444444444',title:'소리에도 색깔이 있다면',content:'음악의 리듬을 타이포그래피로 번역한 가상의 페스티벌 포스터. 크게, 자유롭게, 조금은 시끄럽게!',author:'박유월',category:'그래픽',art:3,likes:72,created_at:'2026-10-12T00:00:00Z',is_sample:true},
 {id:'55555555-5555-4555-8555-555555555555',title:'좋아하는 것들을 모으는 방법',content:'취향 수집가를 위한 디지털 아카이브. 작은 발견을 오래 간직할 수 있는 인터페이스를 디자인했습니다.',author:'김소소',category:'UI/UX',art:4,likes:63,created_at:'2026-10-11T00:00:00Z',is_sample:true},
 {id:'66666666-6666-4666-8666-666666666666',title:'지구를 위한 가벼운 한 걸음',content:'다시 쓰는 일상을 제안하는 리빙 브랜드 LOOP의 콘셉트 작업. 부드러운 초록색과 순환하는 형태에 메시지를 담았습니다.',author:'오브젝트 랩',category:'브랜딩',art:5,likes:51,created_at:'2026-10-10T00:00:00Z',is_sample:true}
];
