# Iam-Mindmap

---

매일 마인드맵 형태로 생각을 기록해 성장하는 것을 느낄 수 있도록 해주는 서비스 입니다.

---

## 프로젝트 설명
- 프로젝트 진행 상황
[프로젝트링크](https://github.com/users/chanjook1m/projects/1/views/1)
- 기술 사용 이유
[Wiki링크](https://github.com/chanjook1m/iam-mindmap/wiki/%EA%B8%B0%EC%88%A0-%EC%84%A0%ED%83%9D-%EC%9D%B4%EC%9C%A0)
- 마주한 문제
[Wiki링크](https://github.com/chanjook1m/iam-mindmap/wiki/%EB%A7%88%EC%A3%BC%ED%95%9C-%EB%AC%B8%EC%A0%9C)
-   나중에 추가하고 싶은 기능
[Wiki링크](https://github.com/chanjook1m/iam-mindmap/wiki/%EC%B6%94%EA%B0%80%ED%95%A0-%EA%B8%B0%EB%8A%A5)  
  

## 프로젝트 설치 및 실행 방법

#### 1. 기본 세팅

---

```
1. supabase 계정생성
```
```
2. graphdata table 생성 (TODO: env로 설정해 유동적인 table 명을 생성해 사용가능하도록 설정 필요)
```
```
3. graphdata table realtime 기능 켜기
```
```
4. supabase OAuth 설정 (e.g.구글)
   - 구글 cloud console에서 서비스 생성
   - clientID 받아온 후 Providers에 해당 정보 입력
   - Supabase에서 제공되는 redirect callback 주소를 구글 console의 redirect 주소로 입력
   - supabasse url configuration 에서 site url = production url, redirect url = localhost url/** 로 설정
```
```
5. .env 파일 생성 후 아래내용 추가
   - VITE_SUPABASE_URL (Supabase 계정 생성 후 제공 됨)
   - VITE_SUPABASE_KEY (Supabase 계정 생성 후 제공 됨)
   - VITE_LOCALSTORAGE_KEY (클라이언트에서 session 생성 이 후 localStorage에 생성되는 값의 key)
```

#### 2. 설정

```
1. npm install
```
```
2. npm run dev
```
