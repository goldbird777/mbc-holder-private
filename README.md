# MBC 홀더 탐색기 - 비공개 백업

마이크로비트코인(MBC) 홀더 탐색기 서버 전체 백업.

⚠️ **이 저장소는 비공개입니다. 절대 Public으로 바꾸지 마세요.**

## 백업 시점
- 날짜: 2026-06-15
- 총 홀더 수: 25,818명
- 마지막 블록: 3,481,948 (풀노드 마지막 활동 기준)

## 구성 요소

```
mbc-holder-private/
├── README.md                ← 이 파일
├── mbc-api/                 ← Node.js API 서버 (포트 3000)
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── incremental_scan.js      ← 증분 블록 스캐너
├── mbc_holders_final.json   ← 전체 홀더 데이터 (1.8MB)
├── frontend/
│   └── index.html           ← 메인 웹페이지
├── config/
│   └── microbitcoin.conf.template  ← MBC 풀노드 설정 (비밀번호 마스킹)
├── systemd/
│   ├── microd.service
│   ├── mbc-api.service
│   └── mbc-scanner.service
├── nginx/
│   └── default              ← nginx 사이트 설정
└── backup/                  ← 이전 백업본들
```

## 복원 절차 (서버 잃어버렸을 때)

### 사전 준비
- Ubuntu 22.04 서버 (Oracle Cloud Always Free 또는 다른 곳)
- Node.js v18+, nginx, MBC 풀노드 바이너리 (microd, micro-cli)

### 1. 저장소 클론
```bash
cd ~
git clone https://github.com/goldbird777/mbc-holder-private.git
cd mbc-holder-private
```

### 2. MBC 풀노드 설정
```bash
mkdir -p ~/.microbitcoin ~/.micro
cp config/microbitcoin.conf.template ~/.microbitcoin/microbitcoin.conf

# 비밀번호 본인 값으로 교체
nano ~/.microbitcoin/microbitcoin.conf
# rpcuser=YOUR_RPC_USER → 실제 사용자명
# rpcpassword=YOUR_RPC_PASSWORD → 실제 비밀번호
```

### 3. API 서버 + 스캐너 설치
```bash
mkdir -p ~/mbc-api
cp -r mbc-api/* ~/mbc-api/
cd ~/mbc-api && npm install

cp incremental_scan.js ~/incremental_scan.js
cp mbc_holders_final.json ~/mbc_holders_final.json
```

### 4. 프론트엔드 설치
```bash
sudo cp frontend/index.html /var/www/html/index.html
sudo cp nginx/default /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

### 5. systemd 서비스 등록 (자동 재시작)
```bash
sudo cp systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable microd mbc-api mbc-scanner
sudo systemctl start microd

# microd 동기화 완료 후
sudo systemctl start mbc-api mbc-scanner
```

### 6. 메모리 최적화 (1GB RAM 환경)
microbitcoin.conf 끝에 추가:
```
dbcache=100
maxmempool=50
maxorphantx=10
```

## 주의사항

- **비밀번호**: `microbitcoin.conf.template`은 비밀번호가 마스킹되어 있습니다. 실제 값은 별도 저장 필요
- **풀노드 데이터**: `~/.micro/` 블록체인 데이터(3.3GB)는 백업에 포함 안 됨 — 처음부터 재동기화 또는 별도 보관
- **SSL 인증서**: 사용 중인 경우 별도 백업 필요 (Let's Encrypt 자동 갱신은 도메인+IP에 묶여있음)

## 외부 의존성
- 거래 내역: https://api.mbc.wiki/history/{addr}?limit=999
- 토큰 정보: https://tokens.mbc.wiki/layer/address/{addr}
- 시세: https://api.coinpaprika.com/v1/tickers/mbc-microbitcoin

이 API들은 자체 운영하는 게 아니라서 사용 불가가 되면 별도 대안 필요.

## 관련 저장소
- 메인 (공개, Android 앱): https://github.com/goldbird777/microbitcoin
