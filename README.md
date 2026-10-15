# 쑈쑈쑈

Next.js App Router 기반 한국어 크리에이티브 쇼케이스입니다. 클레이모피즘 + 네오 브루탈리즘, 반응형 화면, 라이트/다크 모드, 검색/카테고리/정렬, 작업 상세/게시/좋아요를 제공합니다.

## 실행

Node.js 24 이상에서 `npm install`, `npm run dev`, 프로덕션 검증은 `npm run build`를 실행합니다. pnpm-lock.yaml도 포함되어 있습니다.

## Supabase

Vercel Storage → Supabase → Seoul (ap-northeast-2)에서 연결하고 `supabase/schema.sql`을 실행하세요. `.env.example`에 있는 변수를 Vercel과 로컬 `.env.local`에 설정합니다. `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 공개 접두사를 붙이거나 Git에 커밋하면 안 됩니다. URL은 `SUPABASE_URL`도 지원합니다.

RLS는 posts/rankings 공개 읽기만 허용합니다. 작성과 좋아요는 서버 API를 통해 처리합니다. 좋아요는 HTTP-only 방문자 쿠키와 유니크 제약, 원자적 트랜잭션으로 중복 및 경쟁 상태를 방지합니다. 쿠키를 초기화하거나 여러 기기를 사용하는 사람을 동일인으로 식별하는 인증 서비스는 아닙니다. 공개 게시판이므로 대규모 운영 전 콘텐츠 관리 및 봇 방어 정책이 필요합니다.

DB 미설정 시 샘플 전시를 명시하고 새 글 등록은 비활성화합니다. 예시 작업과 좋아요 수는 시연용입니다. rankings는 요청된 스키마만 준비하며 게임이나 점수 제출 UI는 포함하지 않습니다.

## 배포

GitHub 저장소를 Vercel에서 Import합니다. `vercel.json`은 서버리스 리전을 `icn1`로 지정합니다. DB 서울 리전은 생성 단계에서 별도 지정해야 합니다. 실제 RTT는 부하와 네트워크 상황에 따라 달라지므로 5ms 이하를 보장하지 않습니다.
