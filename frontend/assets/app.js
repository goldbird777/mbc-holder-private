
// ── 다국어 사전 ─────────────────────────────────────
const i18n = {
  ko: {
    site_title: "MicroBitcoin 홀더 탐색기",
    site_sub: "전체 홀더 · 잔액 · 토큰 보유 현황",
    nav_official: "공식 사이트",
    ad_label: "광고",
    ad_top: "상단 가로 배너 (970×90 또는 자동 반응형)",
    ad_right: "우측 세로 광고<br>(160×600 또는 반응형)<br><br>스크롤해도<br>항상 보임",

    menu_explore: "탐색 및 통계",
    menu_holders: "홀더 리스트",
    menu_search: "주소 검색",
    menu_stats_label: "통계",
    menu_stats: "전체 통계",
    menu_hashrate: "해시레이트 ↗",
    menu_guide: "가이드",
    menu_mining: "채굴 방법 소개",
    menu_exchanges: "상장 거래소",
    menu_info: "정보",
    menu_about: "사이트 소개",
    menu_privacy: "개인정보처리방침",
    menu_contact: "문의",

    page_holders_title: "홀더 리스트",
    page_holders_sub: "MicroBitcoin 네트워크의 전체 활성 홀더를 잔액 기준으로 표시합니다",
    stat_block: "현재 블록", stat_block_sub: "실시간 동기화",
    stat_holders: "전체 홀더", stat_holders_sub: "활성 주소",
    stat_progress: "진행률", stat_progress_sub: "동기화 완료",
    stat_visitors: "오늘 방문자", stat_visitors_sub: "unique IP 기준",
    stat_updated: "마지막 갱신", stat_updated_sub: "5분 주기 자동",
    ctrl_total: "총", ctrl_total_unit: "개 홀더 · 페이지",
    ctrl_csv: "CSV 다운로드",
    th_address: "지갑 주소", th_balance: "잔액 (MBC)", th_percent: "점유율", th_tokens: "토큰",
    loading: "불러오는 중…",

    page_search_title: "지갑 주소 검색",
    page_search_sub: "MBC 지갑 주소를 입력하면 거래 내역과 잔액을 확인할 수 있습니다",
    search_card_title: "지갑 주소 입력",
    search_placeholder: "B로 시작하는 MBC 지갑 주소... (예: Bq7Ld3wj...)",
    search_btn: "검색",
    search_tip: "💡 지갑 주소 형식: <strong>B</strong> 또는 <strong>b</strong> 또는 <strong>mbc1q</strong> 로 시작하는 문자열<br>주소를 정확히 입력해야 검색됩니다 (대소문자 구분).",

    page_stats_title: "전체 통계",
    page_stats_sub: "MicroBitcoin 네트워크 현황 한눈에 보기",
    supply_max: "최대 발행량", supply_max_sub: "백서 명시",
    supply_snap: "스냅샷 활성", supply_snap_sub: "초기 분배분",
    supply_satoshi: "사토시 예치", supply_satoshi_sub: "타임락",
    supply_mining: "향후 채굴", supply_mining_sub: "~100년",
    stats_network: "네트워크 사양",
    stats_fork: "분기 시점", stats_relaunch: "재론칭",
    stats_blocktime: "블록 시간", stats_blocktime_val: "분당 1블록 (~60초)",
    stats_algo: "알고리즘", stats_blocksize: "블록 크기",
    stats_diff: "난이도 조정", stats_airdrop: "에어드롭 비율",

    page_mining_title: "채굴 방법 소개",
    page_mining_sub: "MBC를 직접 채굴해보고 싶은 분들을 위한 입문 가이드",
    mining_intro_title: "MBC 채굴이 특별한 이유",
    mining_intro_p1: "<strong>MicroBitcoin은 Power2B 알고리즘</strong>을 사용해 ASIC 채굴기 없이 일반 CPU로 채굴할 수 있습니다. 사토시 나카모토가 비트코인 백서에서 강조한 <strong>\"1-CPU-1-Vote\"</strong> 원칙을 실제로 구현한 몇 안 되는 코인입니다.",
    mining_intro_p2: "데스크톱 PC는 물론 안드로이드 스마트폰에서도 채굴이 가능하며, 누구나 네트워크에 참여할 수 있습니다.",
    mining_warn: "⚠️ 본 가이드는 정보 제공 목적이며 채굴로 인한 전기 요금, 하드웨어 발열·손상, 배터리 소모 등의 책임은 본인에게 있습니다. 수익성은 시세와 네트워크 난이도에 따라 변동하며 손실 가능성이 있습니다.",
    mining_pc_title: "💻 PC에서 채굴하기",
    mining_pc_step1_title: "1단계: MBC 지갑 주소 준비",
    mining_pc_step1_desc: "채굴 보상을 받을 본인 지갑 주소가 필요합니다. <a href=\"https://microbitcoinorg.github.io/wallet/\" target=\"_blank\">공식 웹지갑</a> 또는 Wonpay 모바일 지갑에서 주소를 생성하세요. (B로 시작하는 문자열)",
    mining_pc_step2_title: "2단계: cpuminer-opt 다운로드",
    mining_pc_step2_desc: "<a href=\"https://github.com/JayDDee/cpuminer-opt/releases\" target=\"_blank\">cpuminer-opt GitHub Releases</a>에서 본인 OS(Windows/Linux/Mac)에 맞는 최신 버전을 다운로드합니다.",
    mining_pc_step3_title: "3단계: 채굴 풀 선택",
    mining_pc_step3_desc: "소규모 채굴자는 <strong>zpool.ca</strong>를 추천합니다. 다른 사람들과 해시를 합쳐 안정적으로 보상을 받을 수 있습니다.",
    mining_pc_step4_title: "4단계: 채굴 명령어 실행",
    mining_pc_step4_desc: "cpuminer 폴더에서 다음과 같이 실행:",
    mining_pc_step4_note: "<code>-t 4</code>는 사용할 CPU 스레드 수입니다. 본인 PC 코어 수에 맞게 조정하세요.",
    mining_pc_step5_title: "5단계: 보상 확인",
    mining_pc_step5_desc: "zpool.ca 사이트에서 본인 지갑 주소로 검색하면 채굴 통계와 잔액을 볼 수 있습니다. 최소 지급액 도달 시 자동으로 본인 지갑으로 전송됩니다.",
    mining_mobile_title: "📱 안드로이드 폰에서 채굴하기",
    mining_mobile_p1: "MBC는 ARM CPU 친화 알고리즘이라 스마트폰에서도 채굴이 가능합니다. 다만 발열·배터리 소모가 크니 충전 중에만 권장합니다.",
    mining_mobile_step1_title: "권장 앱: MBC Miner (직접 배포)",
    mining_mobile_step1_desc: "Play Store는 채굴 앱을 금지하므로 GitHub에서 직접 APK를 받아야 합니다.",
    mining_apk_link: "📥 APK 다운로드 링크 안내 보기",
    mining_mobile_warn: "⚠️ 안드로이드 출처를 알 수 없는 앱 설치 허용이 필요합니다. APK 파일은 본인의 책임 하에 설치하세요. Google Play Store 외부에서 받는 앱은 항상 신중히 검토해야 합니다.",
    mining_profit_title: "💰 수익성에 대한 현실적인 안내",
    mining_profit_p1: "솔직히 말씀드리면 <strong>MBC 채굴의 수익성은 낮습니다</strong>:",
    mining_profit_li1: "갤럭시 S24 기준 약 30~40 H/s",
    mining_profit_li2: "일반 데스크톱 PC 기준 약 600~1,000 H/s",
    mining_profit_li3: "하루 24시간 채굴해도 시세 기준 매우 적은 보상",
    mining_profit_li4: "전기 요금이 수익보다 클 가능성이 큼",
    mining_profit_p2: "그럼에도 채굴을 추천하는 이유는 <strong>네트워크 참여 경험과 학습 가치</strong> 때문입니다. 비트코인이 ASIC에 점령된 지금, 일반인이 직접 PoW 블록체인에 참여할 수 있는 거의 유일한 기회입니다.",
    mining_more_title: "📚 더 자세한 가이드",
    mining_more_p1: "단계별 상세 가이드와 트러블슈팅은 운영자 블로그에서 확인할 수 있습니다.",

    page_exchanges_title: "상장 거래소",
    page_exchanges_sub: "MBC를 거래할 수 있는 암호화폐 거래소 목록",
    exchanges_warn: "아래 거래소 정보는 참고용이며 거래소의 운영 상태·거래량·수수료는 수시로 변경됩니다. 거래 전 반드시 공식 사이트에서 직접 확인하시고, 본인의 책임 하에 거래하세요.",
    exchange_active: "운영중",
    exchange_check: "확인필요",
    exchange_info: "정보",
    exchange_coming: "준비중",
    exchange_trade_btn: "거래하기 ↗",
    exchange_visit_btn: "사이트 방문 ↗",
    exchange_view_btn: "목록 보기 ↗",
    exchange_coming_btn: "정보 수집 중",
    exchange_lbank_info: "2015년 설립된 글로벌 암호화폐 거래소. 현재 MBC의 메인 유동성 풀입니다.",
    exchange_cmc_info: "실시간 가격, 거래량, 모든 상장 거래소 목록을 확인할 수 있습니다.",
    exchange_all_markets: "전체 마켓",
    exchange_more_name: "추가 거래소",
    exchange_more_info: "신규 상장 정보가 들어오면 업데이트됩니다.",
    exchanges_tips_title: "거래 전 체크리스트",
    exchanges_tip1: "거래소가 정상 운영 중인지 확인 (입출금 정상, KYC 정책)",
    exchanges_tip2: "실시간 거래량과 호가창 깊이 확인 (낮은 거래량은 슬리피지 위험)",
    exchanges_tip3: "출금 수수료와 최소 출금 금액 확인",
    exchanges_tip4: "2FA(2단계 인증) 필수 설정",
    exchanges_tip5: "거래소에 장기 보관 금지 — 개인 지갑으로 출금 권장",
    exchanges_update_title: "정보 제보",
    exchanges_update_p: "잘못된 정보 또는 새로 상장된 거래소 정보가 있으면 <a onclick=\"navigate('contact'); return false;\" style=\"cursor:pointer;\">문의 페이지</a>로 알려주세요. 빠르게 업데이트하겠습니다.",

    page_about_title: "사이트 소개", page_about_sub: "MicroBitcoin(MBC) 프로젝트와 본 탐색기에 대하여",
    about_h1: "MicroBitcoin 홀더 탐색기란?",
    about_p1: "본 사이트는 <strong>마이크로비트코인(MBC) 네트워크의 전체 홀더 정보</strong>를 누구나 쉽게 조회할 수 있도록 만들어진 커뮤니티 운영 익스플로러입니다.",
    about_p2: "MBC 풀노드를 직접 운영하며, 블록체인 데이터를 실시간으로 스캔해 모든 활성 주소와 잔액, 토큰 보유 현황을 표시합니다.",
    about_features: "주요 기능",
    about_feat1: "<strong>전체 홀더 리스트</strong>: 25,000+ 활성 주소 잔액순 정렬",
    about_feat2: "<strong>주소 상세 조회</strong>: 거래 내역, 토큰 보유, 입출금 기록",
    about_feat3: "<strong>실시간 동기화</strong>: 분당 1블록 자동 반영",
    about_feat4: "<strong>CSV 다운로드</strong>: 데이터 전체 내려받기 가능",
    about_feat5: "<strong>API 제공</strong>: 개발자용 REST API (<code>/api/holders</code>)",
    about_stack: "기술 스택",
    about_stack1: "MicroBitcoin Core 풀노드 (microd)",
    about_stack2: "Node.js + Express API 서버",
    about_stack3: "nginx 정적/리버스 프록시",
    about_stack4: "Oracle Cloud Always Free Tier",
    about_disclaimer: "면책",
    about_disc1: "본 사이트는 MicroBitcoin 공식 단체와 무관한 커뮤니티 운영 사이트입니다. 표시되는 정보는 정확성을 보장하지 않으며, 투자 권유 또는 금융 자문이 아닙니다.",
    about_disc2: "관련 공식 자료는 <a href=\"https://microbitcoin.org\" target=\"_blank\">microbitcoin.org</a> 및 <a href=\"https://github.com/MicroBitcoinOrg\" target=\"_blank\">GitHub MicroBitcoinOrg</a>를 참고하세요.",

    page_privacy_title: "개인정보처리방침", page_privacy_sub: "최종 수정일: 2026년 6월 29일 · 시행일: 2026년 6월 29일",
    priv_h1: "1. 수집하는 정보", priv_p1: "본 사이트는 다음 정보를 자동으로 수집할 수 있습니다.",
    priv_li1: "접속 IP 주소 (방문자 통계 목적)",
    priv_li2: "브라우저 종류 및 운영체제 정보",
    priv_li3: "접속 일시 및 페이지 이동 경로",
    priv_li4: "참조 URL",
    priv_h2: "2. 수집 목적",
    priv_li5: "사이트 운영 및 서비스 품질 개선",
    priv_li6: "익명 통계 분석",
    priv_li7: "보안 (비정상 접근 차단)",
    priv_li8: "광고 노출 빈도 최적화",
    priv_h3: "3. 보관 기간", priv_p2: "접속 로그는 <strong>30일</strong>간 보관 후 자동 삭제됩니다.",
    priv_h4: "4. 제3자 제공", priv_p3: "본 사이트는 수집한 정보를 제3자에게 제공하지 않습니다. 다만 다음 서비스가 자체 수집할 수 있습니다.",
    priv_li9: "<strong>Google AdSense</strong>: 광고 게재용 쿠키 및 식별자",
    priv_li10: "<strong>외부 API</strong>: 거래 내역 조회 시 api.mbc.wiki 호출",
    priv_h5: "5. 쿠키 사용", priv_p4: "광고 노출과 사이트 환경설정 저장에 쿠키가 사용됩니다.",
    priv_h6: "6. 문의", priv_p5: "개인정보 처리에 관한 문의는 <a onclick=\"navigate('contact'); return false;\" style=\"cursor:pointer;\">문의 페이지</a>를 이용해 주세요.",

    page_contact_title: "문의 · 운영 정보", page_contact_sub: "사이트 운영 정보, 데이터 출처, 연락 방법을 안내합니다",
    contact_h1: "연락 방법", contact_email: "이메일", contact_blog: "운영자 블로그",
    contact_welcome: "이런 문의를 환영합니다",
    contact_w1: "홀더 데이터 오류 신고", contact_w2: "새 기능 제안", contact_w3: "API 활용 관련",
    contact_w4: "광고/협력 제안", contact_w5: "MBC 관련 정보 공유",
    contact_reply: "답변 안내", contact_reply_p: "모든 문의는 영업일 기준 2~3일 이내 답변 드리도록 노력합니다.",

    footer_about: "사이트 소개", footer_privacy: "개인정보처리방침", footer_contact: "문의",
    footer_copy: "© 2026 MBC Holder Explorer · MicroBitcoin 공식 단체와 무관한 커뮤니티 사이트",
    footer_disclaimer: "본 사이트는 정보 제공 목적으로 운영되며 투자 권유나 금융 자문이 아닙니다. 암호화폐 투자는 원금 손실 위험이 있으며 모든 결정과 결과의 책임은 본인에게 있습니다.",
  },
  en: {
    site_title: "MicroBitcoin Holder Explorer",
    site_sub: "All holders · Balance · Token status",
    nav_official: "Official Site",
    ad_label: "AD",
    ad_top: "Top Banner Ad (970×90 or Auto Responsive)",
    ad_right: "Vertical Ad<br>(160×600 or Responsive)<br><br>Sticky on scroll",

    menu_explore: "EXPLORE & STATS",
    menu_holders: "Holder List",
    menu_search: "Address Search",
    menu_stats_label: "STATS",
    menu_stats: "Statistics",
    menu_hashrate: "Hashrate ↗",
    menu_guide: "GUIDE",
    menu_mining: "Mining Guide",
    menu_exchanges: "Exchanges",
    menu_info: "INFO",
    menu_about: "About",
    menu_privacy: "Privacy Policy",
    menu_contact: "Contact",

    page_holders_title: "Holder List",
    page_holders_sub: "All active holders on the MicroBitcoin network, sorted by balance",
    stat_block: "Current Block", stat_block_sub: "Real-time sync",
    stat_holders: "Total Holders", stat_holders_sub: "Active addresses",
    stat_progress: "Progress", stat_progress_sub: "Synced",
    stat_visitors: "Today's Visitors", stat_visitors_sub: "Unique IPs",
    stat_updated: "Last Updated", stat_updated_sub: "Auto every 5 min",
    ctrl_total: "Total", ctrl_total_unit: " holders · Page",
    ctrl_csv: "Download CSV",
    th_address: "Wallet Address", th_balance: "Balance (MBC)", th_percent: "Share", th_tokens: "Tokens",
    loading: "Loading…",

    page_search_title: "Address Search",
    page_search_sub: "Enter an MBC wallet address to view transactions and balance",
    search_card_title: "Enter Wallet Address",
    search_placeholder: "MBC wallet address starting with B... (e.g. Bq7Ld3wj...)",
    search_btn: "Search",
    search_tip: "💡 Address format: starts with <strong>B</strong>, <strong>b</strong>, or <strong>mbc1q</strong>.<br>Case-sensitive — enter exactly.",

    page_stats_title: "Statistics",
    page_stats_sub: "MicroBitcoin network at a glance",
    supply_max: "Max Supply", supply_max_sub: "Per Whitepaper",
    supply_snap: "Snapshot Active", supply_snap_sub: "Initial distribution",
    supply_satoshi: "Satoshi Reserve", supply_satoshi_sub: "Timelocked",
    supply_mining: "Future Mining", supply_mining_sub: "~100 years",
    stats_network: "Network Specs",
    stats_fork: "Fork Date", stats_relaunch: "Relaunch",
    stats_blocktime: "Block Time", stats_blocktime_val: "1 block/min (~60s)",
    stats_algo: "Algorithm", stats_blocksize: "Block Size",
    stats_diff: "Difficulty Adj.", stats_airdrop: "Airdrop Ratio",

    page_mining_title: "Mining Guide",
    page_mining_sub: "An introduction for those who want to mine MBC themselves",
    mining_intro_title: "What makes MBC mining special",
    mining_intro_p1: "<strong>MicroBitcoin uses the Power2B algorithm</strong>, allowing CPU mining without ASIC hardware. It is one of the few coins that genuinely implements Satoshi's <strong>\"1-CPU-1-Vote\"</strong> principle from the Bitcoin whitepaper.",
    mining_intro_p2: "Mining works on desktop PCs and even Android smartphones — anyone can participate.",
    mining_warn: "⚠️ This guide is for informational purposes. You are responsible for electricity costs, hardware heat, battery wear, and any losses. Profitability varies with price and network difficulty.",
    mining_pc_title: "💻 Mining on PC",
    mining_pc_step1_title: "Step 1: Prepare your MBC wallet address",
    mining_pc_step1_desc: "You need a wallet address to receive rewards. Create one at the <a href=\"https://microbitcoinorg.github.io/wallet/\" target=\"_blank\">official web wallet</a> or Wonpay mobile wallet. (Starts with B.)",
    mining_pc_step2_title: "Step 2: Download cpuminer-opt",
    mining_pc_step2_desc: "Get the latest version for your OS (Windows/Linux/Mac) from <a href=\"https://github.com/JayDDee/cpuminer-opt/releases\" target=\"_blank\">cpuminer-opt Releases</a>.",
    mining_pc_step3_title: "Step 3: Choose a mining pool",
    mining_pc_step3_desc: "For small miners, <strong>zpool.ca</strong> is recommended — you earn rewards consistently by pooling hashpower with others.",
    mining_pc_step4_title: "Step 4: Run the mining command",
    mining_pc_step4_desc: "Inside the cpuminer folder, run:",
    mining_pc_step4_note: "<code>-t 4</code> is the number of CPU threads to use. Adjust to match your CPU's core count.",
    mining_pc_step5_title: "Step 5: Check rewards",
    mining_pc_step5_desc: "Search your wallet address on zpool.ca to see stats and balance. Once you reach the minimum payout, MBC is sent to your wallet automatically.",
    mining_mobile_title: "📱 Mining on Android",
    mining_mobile_p1: "MBC is ARM-CPU friendly, so smartphone mining works. However, it produces heat and drains battery — only recommended while charging.",
    mining_mobile_step1_title: "Recommended App: MBC Miner (Direct Distribution)",
    mining_mobile_step1_desc: "Google Play bans mining apps, so APK must be downloaded directly from GitHub.",
    mining_apk_link: "📥 Request APK download link",
    mining_mobile_warn: "⚠️ Android requires enabling \"Install unknown apps\". Install APKs at your own risk. Always be cautious with apps from outside the Play Store.",
    mining_profit_title: "💰 Realistic profitability notice",
    mining_profit_p1: "Honestly, <strong>MBC mining is not very profitable</strong>:",
    mining_profit_li1: "Galaxy S24: about 30–40 H/s",
    mining_profit_li2: "Average desktop PC: about 600–1,000 H/s",
    mining_profit_li3: "Even 24/7 mining yields modest rewards at current prices",
    mining_profit_li4: "Electricity may cost more than rewards",
    mining_profit_p2: "We still recommend mining for the <strong>experience of participating in a network and the educational value</strong>. With Bitcoin dominated by ASICs, MBC is one of the few PoW chains a regular person can actually mine.",
    mining_more_title: "📚 More detailed guides",
    mining_more_p1: "Step-by-step guides and troubleshooting are available on the operator's blog.",

    page_exchanges_title: "Exchanges",
    page_exchanges_sub: "Cryptocurrency exchanges where MBC can be traded",
    exchanges_warn: "Exchange information below is for reference only. Operational status, trading volume, and fees change frequently. Always verify on the official exchange site before trading. Trade at your own risk.",
    exchange_active: "ACTIVE",
    exchange_check: "VERIFY",
    exchange_info: "INFO",
    exchange_coming: "TBD",
    exchange_trade_btn: "Trade ↗",
    exchange_visit_btn: "Visit Site ↗",
    exchange_view_btn: "View List ↗",
    exchange_coming_btn: "Gathering info",
    exchange_lbank_info: "Global cryptocurrency exchange founded in 2015. Currently the main MBC liquidity pool.",
    exchange_cmc_info: "Real-time prices, volume, and a full list of all exchanges listing MBC.",
    exchange_all_markets: "All Markets",
    exchange_more_name: "More Exchanges",
    exchange_more_info: "Will be updated as new listings are announced.",
    exchanges_tips_title: "Pre-Trade Checklist",
    exchanges_tip1: "Confirm the exchange is operational (deposits/withdrawals working, KYC policy)",
    exchanges_tip2: "Check live volume and order book depth (low volume = slippage risk)",
    exchanges_tip3: "Check withdrawal fees and minimum withdrawal amount",
    exchanges_tip4: "Enable 2FA (two-factor authentication)",
    exchanges_tip5: "Don't keep funds long-term on exchanges — withdraw to your own wallet",
    exchanges_update_title: "Report Information",
    exchanges_update_p: "If you spot inaccurate info or a newly listed exchange, please let us know via the <a onclick=\"navigate('contact'); return false;\" style=\"cursor:pointer;\">contact page</a>. We'll update it promptly.",

    page_about_title: "About", page_about_sub: "About the MicroBitcoin (MBC) project and this explorer",
    about_h1: "What is MicroBitcoin Holder Explorer?",
    about_p1: "This site is a community-run explorer that lets anyone view <strong>all holder information on the MicroBitcoin (MBC) network</strong>.",
    about_p2: "We run an MBC full node directly, scanning blockchain data in real time to display all active addresses, balances, and token holdings.",
    about_features: "Main Features",
    about_feat1: "<strong>Full Holder List</strong>: 25,000+ active addresses sorted by balance",
    about_feat2: "<strong>Address Details</strong>: Transactions, token holdings, in/out history",
    about_feat3: "<strong>Real-time Sync</strong>: 1 block per minute automatic update",
    about_feat4: "<strong>CSV Download</strong>: Full dataset available",
    about_feat5: "<strong>API</strong>: Developer REST API (<code>/api/holders</code>)",
    about_stack: "Tech Stack",
    about_stack1: "MicroBitcoin Core full node (microd)",
    about_stack2: "Node.js + Express API server",
    about_stack3: "nginx static / reverse proxy",
    about_stack4: "Oracle Cloud Always Free Tier",
    about_disclaimer: "Disclaimer",
    about_disc1: "This is a community-run site, not affiliated with the official MicroBitcoin organization. Information is provided without warranty and is not investment advice.",
    about_disc2: "For official resources, see <a href=\"https://microbitcoin.org\" target=\"_blank\">microbitcoin.org</a> and <a href=\"https://github.com/MicroBitcoinOrg\" target=\"_blank\">GitHub MicroBitcoinOrg</a>.",

    page_privacy_title: "Privacy Policy", page_privacy_sub: "Last updated: June 29, 2026 · Effective: June 29, 2026",
    priv_h1: "1. Information Collected", priv_p1: "This site may automatically collect the following:",
    priv_li1: "Visitor IP address (for stats)",
    priv_li2: "Browser type and OS information",
    priv_li3: "Access time and page navigation",
    priv_li4: "Referrer URL",
    priv_h2: "2. Purpose of Collection",
    priv_li5: "Site operation and service quality",
    priv_li6: "Anonymous statistical analysis",
    priv_li7: "Security (blocking abnormal access)",
    priv_li8: "Optimizing ad frequency",
    priv_h3: "3. Retention", priv_p2: "Access logs are stored for <strong>30 days</strong> then automatically deleted.",
    priv_h4: "4. Third-Party Sharing", priv_p3: "We do not share collected information with third parties. However, the following services may collect data independently:",
    priv_li9: "<strong>Google AdSense</strong>: cookies and identifiers for ad serving",
    priv_li10: "<strong>External APIs</strong>: api.mbc.wiki for transaction lookups",
    priv_h5: "5. Cookies", priv_p4: "Cookies are used for ad serving and preference storage.",
    priv_h6: "6. Inquiries", priv_p5: "For privacy-related questions, use the <a onclick=\"navigate('contact'); return false;\" style=\"cursor:pointer;\">contact page</a>.",

    page_contact_title: "Contact · Operations", page_contact_sub: "Site operations, data sources, and contact information",
    contact_h1: "How to Reach Us", contact_email: "Email", contact_blog: "Operator Blog",
    contact_welcome: "What we welcome",
    contact_w1: "Report holder data errors", contact_w2: "Feature suggestions", contact_w3: "API usage questions",
    contact_w4: "Advertising / partnership proposals", contact_w5: "Sharing MBC-related information",
    contact_reply: "Reply Notice", contact_reply_p: "We aim to reply within 2–3 business days.",

    footer_about: "About", footer_privacy: "Privacy Policy", footer_contact: "Contact",
    footer_copy: "© 2026 MBC Holder Explorer · A community site not affiliated with the official MicroBitcoin organization",
    footer_disclaimer: "This site is for informational purposes only and is not investment advice or financial guidance. Cryptocurrency investments carry risk of capital loss; all decisions and outcomes are the user's responsibility.",
  }
};

let currentLang = localStorage.getItem('lang') || 'ko';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.getElementById('lang-kor').classList.toggle('active', lang === 'ko');
  document.getElementById('lang-eng').classList.toggle('active', lang === 'en');

  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  if (lang === 'en') document.title = 'MicroBitcoin Holder Explorer';
  else document.title = 'MicroBitcoin 홀더 탐색기';
}

// ── 후원 주소 (3채널: BTC / MBC / USDT) ─────────────
let donateData = null;
let currentDonateTab = 'btc';

async function loadDonateAddresses() {
  try {
    const res = await fetch('/api/donate');
    donateData = await res.json();
    switchDonateTab(currentDonateTab);
  } catch (e) {
    console.warn('donate load failed', e);
  }
}

function switchDonateTab(key) {
  currentDonateTab = key;
  if (!donateData) return;
  const ch = donateData[key] || {};
  document.querySelectorAll('.donate-tab').forEach(b => {
    const active = b.dataset.key === key;
    b.style.background = active ? 'var(--mbc-navy)' : '#fff';
    b.style.color = active ? '#fff' : 'var(--mbc-navy)';
    b.classList.toggle('active', active);
  });
  const addrEl = document.getElementById('donateAddr');
  const netEl = document.getElementById('donateNetwork');
  if (addrEl) addrEl.textContent = ch.address || '(주소 미등록 - 관리자 페이지에서 설정)';
  if (netEl) netEl.textContent = ch.network ? '· ' + ch.network : '';
}

function copyDonate() {
  if (!donateData || !donateData[currentDonateTab]) return;
  const addr = donateData[currentDonateTab].address;
  if (!addr) { alert('이 채널은 주소가 등록되지 않았습니다.'); return; }
  copyToClipboardDonate(addr);
}

function copyToClipboardDonate(addr) {
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = addr;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(addr).catch(fallback);
  } else {
    fallback();
  }
  const ok = document.getElementById('donateOk');
  if (ok) {
    ok.style.opacity = '1';
    setTimeout(() => { ok.style.opacity = '0'; }, 1500);
  }
}

// 페이지 로드 시 주소 fetch
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDonateAddresses);
} else {
  loadDonateAddresses();
}

// ── 페이지 전환 ─────────────────────────────────────
// ── 페이지별 SEO 메타데이터 ────────────────────────────
const PAGE_META = {
  holders:   { title:'MBC 홀더 리스트 - 전체 활성 지갑 잔액 | MicroBitcoin 탐색기', desc:'MicroBitcoin(MBC) 네트워크 전체 25,000명 이상 활성 홀더 리스트와 잔액, 토큰 보유 현황을 실시간 조회.' },
  transfers: { title:'MBC 최근 트랜잭션 - 채굴 제외 실시간 이동 | MicroBitcoin 탐색기', desc:'MBC 블록체인의 최근 트랜잭션 (채굴 보상 제외, 지갑 간 실제 자금 이동) 실시간 확인.' },
  whales:    { title:'🐳 Whale Alert - MBC 대형 거래 추적 | MicroBitcoin 탐색기', desc:'MicroBitcoin 블록체인의 1억 MBC 이상 대형 자금 이동을 실시간 모니터링합니다.' },
  search:    { title:'MBC 지갑 주소 검색 - 거래 내역 조회 | MicroBitcoin 탐색기', desc:'MBC 지갑 주소로 잔액·거래 내역·토큰 보유 현황을 검색할 수 있습니다.' },
  stats:     { title:'MBC 네트워크 통계 - 블록·해시레이트·발행량 | MicroBitcoin 탐색기', desc:'MicroBitcoin 네트워크 전체 통계, 반감기 카운트다운, 발행량, 해시레이트를 한눈에.' },
  mining:    { title:'MBC 채굴 방법 안내 - PC·스마트폰 채굴 가이드 | MicroBitcoin 탐색기', desc:'MicroBitcoin(MBC) 채굴 방법과 수익성 계산기. Power2B 알고리즘, CPU 채굴 입문 가이드.' },
  exchanges: { title:'MBC 상장 거래소 - 매매·시세 정보 | MicroBitcoin 탐색기', desc:'MicroBitcoin(MBC) 현재 상장 거래소 목록과 거래 페어, 거래 가이드.' },
  wonpay:    { title:'Wonpay 지갑 - MBC 공식 모바일 지갑 다운로드 | MicroBitcoin 탐색기', desc:'MicroBitcoin 공식 모바일 지갑 Wonpay. Android / iOS 다운로드 및 사용 가이드.' },
  tokens:    { title:'MBC 레이어2 토큰 일람 - MicroBitcoin Layer2 토큰 | MicroBitcoin 탐색기', desc:'MicroBitcoin 레이어2 발행 토큰 목록과 각 토큰의 보유 정보.' },
  news:      { title:'MBC 최근 소식 - MicroBitcoin 공지·이벤트 | MicroBitcoin 탐색기', desc:'MicroBitcoin 관련 공지·업데이트·이벤트 등 운영자가 직접 등록한 최신 소식.' },
  qna:       { title:'MBC Q&A - 자주 묻는 질문과 답변 | MicroBitcoin 탐색기', desc:'MicroBitcoin 관련 자주 묻는 질문(FAQ)과 답변 모음.' },
  lab:       { title:'랩 노트 - 채굴·지갑·서버 실험 기록 | MicroBitcoin 탐색기', desc:'채굴, 지갑, 서버, 노드, 코인 실험과 운영 기록을 정리한 랩 노트.' },
  links:     { title:'MBC 관련 사이트 모음 - 공식·커뮤니티 링크 | MicroBitcoin 탐색기', desc:'MicroBitcoin 공식 사이트·커뮤니티·도구 등 관련 사이트 링크 모음.' },
  about:     { title:'사이트 소개 - MBC 홀더 탐색기 | MicroBitcoin Holder Explorer', desc:'MBC 홀더 탐색기는 MicroBitcoin 풀노드를 직접 운영하여 실시간 홀더 데이터를 제공합니다.' },
  privacy:   { title:'개인정보처리방침 | MBC 홀더 탐색기', desc:'MBC 홀더 탐색기의 개인정보 수집·이용 정책.' },
  contact:   { title:'문의 | MBC 홀더 탐색기', desc:'MBC 홀더 탐색기 관련 문의 및 피드백을 보내실 수 있습니다.' }
};

function updatePageMeta(page, address) {
  let title, desc;
  if (page === 'detail' && address) {
    const sa = address.length > 16 ? (address.substring(0,8)+'...'+address.substring(address.length-6)) : address;
    title = 'MBC 지갑 ' + sa + ' - 잔액 및 거래 내역 | MicroBitcoin 탐색기';
    desc = 'MicroBitcoin 지갑 ' + address + ' 의 잔액, 토큰 보유, 거래 내역을 실시간 조회.';
  } else {
    const m = PAGE_META[page] || PAGE_META.holders;
    title = m.title; desc = m.desc;
  }
  document.title = title;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name='description'; document.head.appendChild(metaDesc); }
  metaDesc.content = desc;
  // og:title / og:description
  let ogt = document.querySelector('meta[property="og:title"]');
  if (!ogt) { ogt = document.createElement('meta'); ogt.setAttribute('property','og:title'); document.head.appendChild(ogt); }
  ogt.content = title;
  let ogd = document.querySelector('meta[property="og:description"]');
  if (!ogd) { ogd = document.createElement('meta'); ogd.setAttribute('property','og:description'); document.head.appendChild(ogd); }
  ogd.content = desc;
  let ogu = document.querySelector('meta[property="og:url"]');
  if (!ogu) { ogu = document.createElement('meta'); ogu.setAttribute('property','og:url'); document.head.appendChild(ogu); }
  ogu.content = location.origin + location.pathname;
  // canonical
  let can = document.querySelector('link[rel="canonical"]');
  if (!can) { can = document.createElement('link'); can.rel='canonical'; document.head.appendChild(can); }
  can.href = location.origin + location.pathname;
}

function navigate(page, fromPopstate) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  const menuItem = document.querySelector(`.menu-item[data-page="${page}"]`);
  if (menuItem) menuItem.classList.add('active');

  // 뒤로가기 popstate에서 호출된 경우엔 history에 또 push 안 함
  if (!fromPopstate) {
    const newPath = '/' + page;
    if (location.pathname !== newPath) {
      history.pushState({page: page}, '', newPath);
    }
  }

  updatePageMeta(page);

  document.getElementById('sidebar').classList.remove('mobile-open');
  document.querySelector('.sidebar-overlay').classList.remove('active');

  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);

  // 최근 트랜잭션 페이지 진입 시 폴링 시작, 나가면 중단
  if (page === 'transfers') startTransfersPolling();
  else stopTransfersPolling();

  // Whale Alert 페이지 진입
  if (page === 'whales' && typeof loadWhales === 'function') loadWhales(1);

  // 채굴 페이지 진입 시 수익 계산기 데이터 갱신
  if (page === 'mining' && typeof fetchCalcData === 'function') fetchCalcData();

  // 게시판 페이지 진입 시 데이터 로드
  if (page === 'news' && typeof loadBoard === 'function') loadBoard('news');
  if (page === 'qna' && typeof loadQnaList === 'function') loadQnaList(1);
  if (page === 'lab' && typeof loadBoard === 'function') loadBoard('lab');
  if (page === 'links' && typeof loadBoard === 'function') loadBoard('links');
  if (page === 'tokens' && typeof loadTokensList === 'function') loadTokensList();
}

// ── Q&A 게시판 (익명 + 비밀번호) ────────────────────────
let qnaCurrentPage = 1;

async function fetchPublicBoard(type) {
  const res = await fetch('/data/board/' + encodeURIComponent(type) + '.json?v=' + Date.now());
  if (!res.ok) throw new Error('static board not found');
  return res.json();
}

async function loadQnaList(page) {
  page = page || qnaCurrentPage;
  qnaCurrentPage = page;
  const body = document.getElementById('qnaListBody');
  body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;">불러오는 중…</td></tr>';
  try {
    const perPage = 15;
    let data;
    try {
      const publicData = await fetchPublicBoard('qna');
      const all = publicData.items || [];
      const offset = (page - 1) * perPage;
      data = {
        items: all.slice(offset, offset + perPage),
        page: page,
        perPage: perPage,
        total: publicData.total || all.length,
        totalPages: Math.ceil((publicData.total || all.length) / perPage) || 1
      };
    } catch (staticErr) {
      const res = await fetch('/api/qna?page=' + page + '&perPage=' + perPage);
      data = await res.json();
    }
    const items = data.items || [];

    document.getElementById('qnaTotal').textContent = (data.total || 0).toLocaleString();
    document.getElementById('qnaPage').textContent = data.page || 1;
    document.getElementById('qnaTotalPages').textContent = data.totalPages || 1;

    if (items.length === 0) {
      body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#999;">등록된 글이 없습니다. 첫 글을 작성해주세요!</td></tr>';
      document.getElementById('qnaPagination').innerHTML = '';
      return;
    }

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const startNum = data.total - (page - 1) * data.perPage;
    body.innerHTML = items.map((it, i) => {
      const num = startNum - i;
      const statusBadge = it.hasReply
        ? '<span style="display:inline-block; padding:3px 10px; background:#E8F5E9; color:var(--green); border-radius:10px; font-size:11px; font-weight:700;">답변완료</span>'
        : '<span style="display:inline-block; padding:3px 10px; background:#FFF8E1; color:#6D4C00; border-radius:10px; font-size:11px; font-weight:700;">답변대기</span>';
      const date = new Date(it.createdAt).toLocaleDateString('ko-KR', {month:'2-digit', day:'2-digit'});
      return `<tr style="cursor:pointer;" onclick="showQnaDetail('${it.id}')">
        <td class="center" style="color:var(--text-sub);">${num}</td>
        <td class="center">${statusBadge}</td>
        <td style="font-weight:600;">${esc(it.title)}${it.replyCount > 0 ? ` <span style="color:var(--mbc-accent); font-size:11px;">[${it.replyCount}]</span>` : ''}</td>
        <td class="center" style="font-size:12px; color:var(--text-sub);">${esc(it.author || '익명')}</td>
        <td class="center" style="font-size:12px; color:var(--text-sub);">${date}</td>
        <td class="center" style="font-size:12px; color:var(--text-sub);">${it.viewCount || 0}</td>
      </tr>`;
    }).join('');

    // 페이지네이션
    renderQnaPagination(data.totalPages || 1, data.page || 1);
  } catch (e) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#C62828;">로드 실패: ' + e.message + '</td></tr>';
  }
}

function renderQnaPagination(totalPages, currentPage) {
  const el = document.getElementById('qnaPagination');
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  const GROUP = 10;
  const groupStart = Math.floor((currentPage - 1) / GROUP) * GROUP + 1;
  const groupEnd = Math.min(groupStart + GROUP - 1, totalPages);
  let html = '';
  html += `<button onclick="loadQnaList(1)" ${currentPage===1?'disabled':''}>«</button>`;
  html += `<button onclick="loadQnaList(${Math.max(1, currentPage-1)})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<button class="${i===currentPage?'active':''}" onclick="loadQnaList(${i})">${i}</button>`;
  }
  html += `<button onclick="loadQnaList(${Math.min(totalPages, currentPage+1)})" ${currentPage===totalPages?'disabled':''}>›</button>`;
  html += `<button onclick="loadQnaList(${totalPages})" ${currentPage===totalPages?'disabled':''}>»</button>`;
  el.innerHTML = html;
}

// 글쓰기 모달
function openQnaWriteModal(editing) {
  const isEdit = !!editing;
  const html = `
    <div id="qnaModalBackdrop" style="position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:14px;" onclick="if(event.target===this) closeQnaModal()">
      <div style="background:#fff; border-radius:12px; padding:24px; max-width:560px; width:100%; max-height:90vh; overflow-y:auto;">
        <h2 style="font-size:18px; color:var(--mbc-navy); margin-bottom:14px;">${isEdit ? '글 수정' : '✍ 새 글 작성'}</h2>
        <label style="font-size:11px; color:var(--text-sub); font-weight:700;">제목</label>
        <input type="text" id="qnaModalTitle" placeholder="제목 입력 (최대 200자)" style="width:100%; padding:10px 12px; background:var(--bg-soft); border:1.5px solid var(--border); border-radius:6px; font-size:14px; margin:4px 0 10px; outline:none;" value="${editing ? String(editing.title || '').replace(/"/g,'&quot;') : ''}">
        <label style="font-size:11px; color:var(--text-sub); font-weight:700;">본문</label>
        <textarea id="qnaModalContent" placeholder="내용을 입력하세요" style="width:100%; min-height:160px; padding:10px 12px; background:var(--bg-soft); border:1.5px solid var(--border); border-radius:6px; font-size:13px; margin:4px 0 10px; outline:none; font-family:inherit; resize:vertical;">${editing ? String(editing.content || '') : ''}</textarea>
        <label style="font-size:11px; color:var(--text-sub); font-weight:700;">작성자 (선택)</label>
        <input type="text" id="qnaModalAuthor" placeholder="익명" style="width:100%; padding:10px 12px; background:var(--bg-soft); border:1.5px solid var(--border); border-radius:6px; font-size:13px; margin:4px 0 10px; outline:none;" value="${editing ? String(editing.author || '').replace(/"/g,'&quot;') : ''}">
        <label style="font-size:11px; color:var(--text-sub); font-weight:700;">비밀번호 (최소 4자) ${isEdit ? '— 본인 확인용' : ''}</label>
        <input type="password" id="qnaModalPassword" placeholder="${isEdit ? '글 작성 시 사용한 비밀번호' : '본인 글 수정·삭제 시 필요'}" style="width:100%; padding:10px 12px; background:var(--bg-soft); border:1.5px solid var(--border); border-radius:6px; font-size:13px; margin:4px 0 14px; outline:none;">
        <div id="qnaModalError" style="color:var(--red); font-size:12px; margin-bottom:10px; min-height:16px;"></div>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button onclick="closeQnaModal()" style="padding:10px 20px; background:#fff; color:var(--text-sub); border:1.5px solid var(--border); border-radius:6px; font-weight:700; cursor:pointer;">취소</button>
          <button onclick="${isEdit ? `submitQnaEdit('${editing.id}')` : 'submitQnaWrite()'}" style="padding:10px 20px; background:var(--mbc-navy); color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer;">${isEdit ? '수정' : '등록'}</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeQnaModal() {
  const m = document.getElementById('qnaModalBackdrop');
  if (m) m.remove();
}

async function submitQnaWrite() {
  const title = document.getElementById('qnaModalTitle').value.trim();
  const content = document.getElementById('qnaModalContent').value.trim();
  const author = document.getElementById('qnaModalAuthor').value.trim();
  const password = document.getElementById('qnaModalPassword').value;
  const err = document.getElementById('qnaModalError');
  err.textContent = '';
  if (!title || !content) { err.textContent = '제목과 본문을 입력하세요'; return; }
  if (!password || password.length < 4) { err.textContent = '비밀번호는 최소 4자 이상'; return; }
  try {
    const res = await fetch('/api/qna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author: author || '익명', password })
    });
    const data = await res.json();
    if (!res.ok) { err.textContent = data.error || '등록 실패'; return; }
    closeQnaModal();
    loadQnaList(1);
  } catch (e) { err.textContent = '오류: ' + e.message; }
}

async function submitQnaEdit(id) {
  const title = document.getElementById('qnaModalTitle').value.trim();
  const content = document.getElementById('qnaModalContent').value.trim();
  const author = document.getElementById('qnaModalAuthor').value.trim();
  const password = document.getElementById('qnaModalPassword').value;
  const err = document.getElementById('qnaModalError');
  err.textContent = '';
  if (!title || !content) { err.textContent = '제목과 본문을 입력하세요'; return; }
  if (!password) { err.textContent = '비밀번호 입력 필요'; return; }
  try {
    const res = await fetch('/api/qna/' + encodeURIComponent(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author, password })
    });
    const data = await res.json();
    if (!res.ok) { err.textContent = data.error || '수정 실패'; return; }
    closeQnaModal();
    showQnaDetail(id);
  } catch (e) { err.textContent = '오류: ' + e.message; }
}

async function showQnaDetail(id, fromPopstate) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-qna-detail').classList.add('active');
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  const qnaMenu = document.querySelector('.menu-item[data-page="qna"]');
  if (qnaMenu) qnaMenu.classList.add('active');

  if (!fromPopstate) {
    const newPath = '/qna/' + encodeURIComponent(id);
    if (location.pathname !== newPath) history.pushState({qna: id}, '', newPath);
  }
  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);

  const card = document.getElementById('qnaDetailCard');
  card.innerHTML = '<div style="text-align:center; padding:30px; color:#999;">불러오는 중…</div>';
  try {
    const res = await fetch('/api/qna/' + encodeURIComponent(id));
    if (!res.ok) { card.innerHTML = '<div style="text-align:center; padding:30px; color:var(--red);">글을 찾을 수 없습니다</div>'; return; }
    const it = await res.json();
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const date = new Date(it.createdAt).toLocaleString('ko-KR');
    const replies = (it.replies || []).map((r, i) => `
      <div style="background:#E3F2FD; border-left:4px solid var(--mbc-blue); padding:14px 18px; border-radius:6px; margin-top:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <strong style="color:var(--mbc-navy); font-size:13px;">💬 운영자 답변</strong>
          <span style="font-size:11px; color:var(--text-sub);">${new Date(r.createdAt).toLocaleString('ko-KR')}</span>
        </div>
        <div style="font-size:14px; color:var(--text); line-height:1.7; white-space:pre-wrap; word-break:break-word;">${esc(r.content)}</div>
      </div>
    `).join('');

    card.innerHTML = `
      <div style="border-bottom:1px solid var(--border); padding-bottom:14px; margin-bottom:18px;">
        <h2 style="font-size:18px; color:var(--mbc-navy); margin-bottom:8px;">${esc(it.title)}</h2>
        <div style="display:flex; gap:14px; flex-wrap:wrap; font-size:12px; color:var(--text-sub);">
          <span>작성자: <strong>${esc(it.author || '익명')}</strong></span>
          <span>${date}</span>
          <span>조회 ${it.viewCount || 0}</span>
        </div>
      </div>
      <div style="font-size:14px; color:var(--text); line-height:1.7; white-space:pre-wrap; word-break:break-word; margin-bottom:18px;">${esc(it.content)}</div>
      ${replies}
      <div style="display:flex; gap:8px; margin-top:20px; padding-top:14px; border-top:1px solid var(--border); flex-wrap:wrap;">
        <button onclick="askQnaEdit('${it.id}')" style="padding:8px 16px; background:#FFF8E1; color:#6D4C00; border:none; border-radius:5px; font-size:12px; font-weight:700; cursor:pointer;">✏ 수정</button>
        <button onclick="askQnaDelete('${it.id}')" style="padding:8px 16px; background:#FFEBEE; color:var(--red); border:none; border-radius:5px; font-size:12px; font-weight:700; cursor:pointer;">🗑 삭제</button>
      </div>
    `;
  } catch (e) {
    card.innerHTML = '<div style="text-align:center; padding:30px; color:var(--red);">로드 실패: ' + e.message + '</div>';
  }
}

async function askQnaEdit(id) {
  try {
    const res = await fetch('/api/qna/' + encodeURIComponent(id));
    const it = await res.json();
    openQnaWriteModal(it);
  } catch (e) { alert('로드 실패: ' + e.message); }
}

async function askQnaDelete(id) {
  const pw = prompt('비밀번호를 입력하세요 (관리자는 빈 칸으로 두고 OK):');
  if (pw === null) return;
  try {
    const res = await fetch('/api/qna/' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || '삭제 실패'); return; }
    alert('삭제되었습니다');
    navigate('qna');
  } catch (e) { alert('오류: ' + e.message); }
}

// ── MBC 레이어2 토큰 일람 로딩 ─────────────────────────────
let tokenListCache = null;
async function fetchTokenList(force) {
  if (!force && tokenListCache) return tokenListCache;
  const res = await fetch('/api/board/tokens');
  const data = await res.json();
  tokenListCache = data.items || [];
  return tokenListCache;
}
async function loadTokensList() {
  const el = document.getElementById('tokensList');
  if (!el) return;
  try {
    const items = await fetchTokenList(true);
    if (items.length === 0) {
      el.innerHTML = '<div style="text-align:center; padding:40px 20px; color:#999; grid-column:1/-1;">아직 등록된 토큰이 없습니다. 관리자 페이지에서 토큰을 추가해주세요.</div>';
      return;
    }
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    el.innerHTML = items.map(t => {
      const ticker = esc(t.ticker || '?');
      const name = esc(t.name || ticker);
      const desc = esc(t.description || '');
      const supply = t.supply ? `<div style="font-size:11px; color:var(--text-sub); margin-top:8px;">최대 발행: <strong>${esc(t.supply)}</strong></div>` : '';
      // 아이콘: iconUrl이 있으면 이미지, 없으면 ticker 첫 글자 그라데이션 원
      const iconHtml = t.iconUrl
        ? `<img src="${esc(t.iconUrl)}" alt="${ticker}" style="width:56px; height:56px; border-radius:50%; object-fit:cover; flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,.1);" onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:'${ticker.substring(0,1)}',style:'width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--mbc-navy),var(--mbc-accent));color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;flex-shrink:0;'}))">`
        : `<div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg, var(--mbc-navy), var(--mbc-accent)); color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:800; flex-shrink:0;">${ticker.substring(0,1)}</div>`;
      return `
        <a onclick="showTokenDetail('${ticker}'); return false;"
           style="display:flex; flex-direction:column; gap:8px; padding:20px 22px; background:#fff; border:1.5px solid var(--border); border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,.04); cursor:pointer; text-decoration:none; color:inherit; transition:transform .15s, box-shadow .2s, border-color .2s;"
           onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 16px rgba(22,0,92,.12)';this.style.borderColor='var(--mbc-accent)'"
           onmouseout="this.style.transform='';this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.borderColor='var(--border)'">
          <div style="display:flex; align-items:center; gap:12px;">
            ${iconHtml}
            <div style="flex:1; min-width:0;">
              <div style="background:var(--mbc-gold); color:var(--mbc-navy-dark); padding:3px 10px; border-radius:4px; font-size:11px; font-weight:800; letter-spacing:.5px; display:inline-block; margin-bottom:6px;">${ticker}</div>
              <div style="font-size:16px; font-weight:800; color:var(--mbc-navy); line-height:1.2;">${name}</div>
            </div>
          </div>
          ${desc ? `<div style="font-size:12px; color:var(--text-sub); line-height:1.5;">${desc}</div>` : ''}
          ${supply}
          <div style="margin-top:auto; font-size:12px; color:var(--mbc-accent); font-weight:700;">홀더 보기 →</div>
        </a>
      `;
    }).join('');
  } catch (e) {
    el.innerHTML = '<div style="text-align:center; padding:30px; color:#C62828; grid-column:1/-1;">로드 실패: ' + e.message + '</div>';
  }
}

// ── 토큰 상세 (홀더 리스트) ────────────────────────
let currentTokenTicker = null;
async function showTokenDetail(ticker, fromPopstate) {
  if (!ticker) return;
  currentTokenTicker = ticker;

  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-token-detail').classList.add('active');
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  const tokensMenu = document.querySelector('.menu-item[data-page="tokens"]');
  if (tokensMenu) tokensMenu.classList.add('active');

  if (!fromPopstate) {
    const newPath = '/tokens/' + encodeURIComponent(ticker);
    if (location.pathname !== newPath) history.pushState({token: ticker}, '', newPath);
  }

  document.title = ticker + ' 홀더 - MBC 레이어2 토큰 | MicroBitcoin 탐색기';
  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);

  // 토큰 메타 + 홀더 로드 (캐시 우선, 없으면 fetch)
  try {
    const items = await fetchTokenList(false);
    const token = items.find(t => (t.ticker || '').toUpperCase() === ticker.toUpperCase());

    if (token) {
      document.getElementById('tokenDetailName').textContent = token.name || ticker;
      document.getElementById('tokenDetailDesc').textContent = token.description || '';
      document.getElementById('tokenDetailTicker').textContent = token.ticker || ticker;
      document.getElementById('tokenDetailSupply').textContent = token.supply || '-';
      // 헤더 아이콘 (제목 옆에 배치)
      const headerEl = document.getElementById('tokenDetailHeader');
      const tNameEl = document.getElementById('tokenDetailName');
      if (headerEl && tNameEl && !document.getElementById('tokenDetailIcon')) {
        const iconWrap = document.createElement('div');
        iconWrap.id = 'tokenDetailIcon';
        iconWrap.style.cssText = 'display:flex; align-items:center; gap:14px; margin-bottom:10px;';
        if (token.iconUrl) {
          iconWrap.innerHTML = `<img src="${encodeURI(token.iconUrl)}" alt="${(ticker || '').replace(/"/g,'')}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; box-shadow:0 2px 8px rgba(0,0,0,.12);">`;
        } else {
          iconWrap.innerHTML = `<div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, var(--mbc-navy), var(--mbc-accent)); color:#fff; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800;">${(ticker || '?').substring(0,1)}</div>`;
        }
        tNameEl.parentNode.insertBefore(iconWrap, tNameEl);
      }
      const linkEl = document.getElementById('tokenDetailLink');
      let actionsHtml = '';
      if (token.url) {
        actionsHtml += `<a href="${encodeURI(token.url)}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:var(--mbc-navy); color:#fff; border-radius:6px; font-size:13px; font-weight:700; text-decoration:none;">관련 사이트 ↗</a>`;
      }
      if (token.whitepaperUrl) {
        const fileName = (token.ticker || ticker) + '_whitepaper.pdf';
        actionsHtml += `<a href="${encodeURI(token.whitepaperUrl)}" target="_blank" rel="noopener" download="${fileName}" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:var(--mbc-gold); color:var(--mbc-navy-dark); border-radius:6px; font-size:13px; font-weight:700; text-decoration:none; margin-left:8px;">📄 백서 다운로드</a>`;
      }
      linkEl.innerHTML = actionsHtml;
    } else {
      document.getElementById('tokenDetailName').textContent = ticker;
      document.getElementById('tokenDetailDesc').textContent = '등록되지 않은 토큰입니다.';
      document.getElementById('tokenDetailTicker').textContent = ticker;
      document.getElementById('tokenDetailSupply').textContent = '-';
      document.getElementById('tokenDetailLink').innerHTML = '';
    }
  } catch(e) {}

  loadTokenHolders(ticker);
}

// 토큰 홀더 외부 API 프록시 조회 (tokens.mbc.wiki/layer/token/{ticker}/holders)
let tokenHolderPage = 1;
async function loadTokenHolders(ticker, page) {
  page = page || 1;
  tokenHolderPage = page;
  const body = document.getElementById('tokenHolderBody');
  const totalEl = document.getElementById('tokenHolderTotal');
  const countEl = document.getElementById('tokenDetailHolderCount');
  const supplyEl = document.getElementById('tokenDetailSupply');
  body.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:30px; color:#999;">불러오는 중…</td></tr>';

  try {
    const res = await fetch('/api/tokens/holders/' + encodeURIComponent(ticker) + '?page=' + page);
    const data = await res.json();

    if (!data.available || data.count === 0) {
      body.innerHTML = `
        <tr><td colspan="3" style="text-align:center; padding:40px 20px;">
          <div style="color:var(--text-sub); font-size:13px; line-height:1.7;">
            <strong>${ticker}</strong> 토큰을 외부 API에서 찾을 수 없습니다.<br>
            티커가 정확한지 확인해주세요 (대소문자 구분).
          </div>
        </td></tr>
      `;
      totalEl.textContent = '0';
      countEl.textContent = '-';
      return;
    }

    totalEl.textContent = data.count.toLocaleString();
    countEl.textContent = data.count.toLocaleString();
    // supply도 API 응답으로 덮어쓰기 (decimals 반영)
    if (data.supply > 0 && supplyEl) {
      const decimals = data.decimals || 4;
      const supplyDisplay = (data.supply / Math.pow(10, decimals)).toLocaleString('en-US', { maximumFractionDigits: 0 });
      supplyEl.textContent = supplyDisplay;
    }

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const decimals = data.decimals || 4;
    const startRank = (page - 1) * 20 + 1; // pagination=20 per page typical
    body.innerHTML = data.holders.map((h, i) => {
      const rank = (page - 1) * data.holders.length + i + 1;
      const isTop = rank <= 3;
      const bal = (h.balance / Math.pow(10, decimals)).toLocaleString('en-US', { maximumFractionDigits: 4 });
      return `<tr>
        <td class="center"><span class="rank ${isTop ? 'top' : ''}">${rank}</span></td>
        <td><a class="address" onclick="showDetail('${esc(h.address)}'); return false;">${esc(shortAddr(h.address))}</a></td>
        <td class="right balance">${bal}</td>
      </tr>`;
    }).join('');

    // 페이지네이션
    if (data.totalPages > 1) {
      let pgHtml = '<tr><td colspan="3" style="text-align:center; padding:14px; background:var(--bg-soft);">';
      pgHtml += `<button onclick="loadTokenHolders('${esc(ticker)}', 1)" ${page===1?'disabled':''} style="padding:6px 12px; margin:2px; border:1px solid var(--border); background:#fff; border-radius:4px; cursor:pointer;">«</button>`;
      pgHtml += `<button onclick="loadTokenHolders('${esc(ticker)}', ${Math.max(1, page-1)})" ${page===1?'disabled':''} style="padding:6px 12px; margin:2px; border:1px solid var(--border); background:#fff; border-radius:4px; cursor:pointer;">‹</button>`;
      pgHtml += `<span style="padding:6px 14px; color:var(--text-sub); font-size:13px;">${page} / ${data.totalPages}</span>`;
      pgHtml += `<button onclick="loadTokenHolders('${esc(ticker)}', ${Math.min(data.totalPages, page+1)})" ${page===data.totalPages?'disabled':''} style="padding:6px 12px; margin:2px; border:1px solid var(--border); background:#fff; border-radius:4px; cursor:pointer;">›</button>`;
      pgHtml += `<button onclick="loadTokenHolders('${esc(ticker)}', ${data.totalPages})" ${page===data.totalPages?'disabled':''} style="padding:6px 12px; margin:2px; border:1px solid var(--border); background:#fff; border-radius:4px; cursor:pointer;">»</button>`;
      pgHtml += '</td></tr>';
      body.innerHTML += pgHtml;
    }

    body.innerHTML += `
      <tr><td colspan="3" style="text-align:center; padding:10px; color:#999; font-size:11px; background:var(--bg-soft);">
        데이터: tokens.mbc.wiki · 전송 ${data.transfers ? data.transfers.toLocaleString() : '-'} 건 · 10분 캐시
      </td></tr>
    `;
  } catch (e) {
    body.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:30px; color:#C62828;">로드 실패: ' + e.message + '</td></tr>';
  }
}

// ── 게시판 로딩 ─────────────────────────────────────
function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ko-KR', { year:'numeric', month:'short', day:'numeric' });
}

function safeUrl(u) {
  const s = String(u || '').trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s) return 'https://' + s;
  return '#';
}

async function loadBoard(type) {
  const containerId = type + 'List';
  const el = document.getElementById(containerId);
  if (!el) return;
  try {
    let data;
    try {
      data = await fetchPublicBoard(type);
    } catch (staticErr) {
      const res = await fetch('/api/board/' + type);
      data = await res.json();
    }
    const items = data.items || [];

    if (items.length === 0) {
      el.innerHTML = '<div style="text-align:center; padding:40px 20px; color:#999; ' +
        (type === 'links' ? 'grid-column:1/-1;' : '') + '">아직 등록된 항목이 없습니다.</div>';
      return;
    }

    if (type === 'news' || type === 'lab') {
      el.innerHTML = items.map(it => `
        <div class="static-card" style="padding:20px 24px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:10px;">
            <h2 style="margin:0; font-size:16px; color:var(--mbc-navy);">${escHtml(it.title)}</h2>
            <div style="font-size:11px; color:var(--text-sub); font-weight:600;">${fmtDate(it.createdAt)}</div>
          </div>
          <div style="font-size:14px; color:var(--text); line-height:1.7; white-space:pre-wrap; word-break:break-word;">${escHtml(it.content)}</div>
        </div>
      `).join('');
    } else if (type === 'qna') {
      el.innerHTML = items.map(it => `
        <details class="static-card" style="padding:0; overflow:hidden;">
          <summary style="cursor:pointer; padding:16px 22px; font-weight:700; color:var(--mbc-navy); font-size:14px; list-style:none; display:flex; gap:10px; align-items:center;">
            <span style="background:var(--mbc-gold); color:var(--mbc-navy-dark); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:800;">Q</span>
            <span>${escHtml(it.question || it.title)}</span>
          </summary>
          <div style="padding:14px 22px 20px 40px; border-top:1px solid var(--border); background:var(--bg-soft); font-size:14px; line-height:1.7; color:var(--text); white-space:pre-wrap; word-break:break-word;">
            <strong style="color:var(--mbc-navy);">A.</strong> ${escHtml(it.answer || it.content)}
          </div>
        </details>
      `).join('');
    } else if (type === 'links') {
      el.innerHTML = items.map(it => `
        <a href="${escHtml(safeUrl(it.url))}" target="_blank" rel="noopener" class="exchange-card" style="text-decoration:none; padding:18px 20px; display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:15px; font-weight:800; color:var(--mbc-navy); display:flex; align-items:center; gap:8px;">
            🔗 <span>${escHtml(it.name)}</span>
          </div>
          ${it.description ? `<div style="font-size:12px; color:var(--text-sub); line-height:1.5;">${escHtml(it.description)}</div>` : ''}
          <div style="font-size:11px; color:var(--mbc-accent); margin-top:4px; word-break:break-all;">${escHtml(it.url)} ↗</div>
        </a>
      `).join('');
    }
  } catch (e) {
    el.innerHTML = '<div style="text-align:center; padding:30px; color:#C62828; ' +
      (type === 'links' ? 'grid-column:1/-1;' : '') + '">로드 실패: ' + escHtml(e.message) + '</div>';
  }
}

// ── 홀더 페이지 인라인 검색 ─────────────────────────
function holdersInlineSearchGo() {
  const el = document.getElementById('holdersInlineSearch');
  const v = el && el.value && el.value.trim();
  if (!v) return;
  if (v.length < 10) { alert('지갑 주소를 정확히 입력해주세요.'); return; }
  showDetail(v);
}

// ── 🐳 Whale Alert (대형 거래) ───────────────────────
let whalePollTimer = null;

async function loadWhales(page) {
  page = page || 1;
  const body = document.getElementById('whaleBody');
  const thresholdMBC = parseInt(document.getElementById('whaleThresholdSel').value) || 100000000;

  // 임계값 라벨 갱신
  const labelMap = {
    100000000: '1억 MBC',
    500000000: '5억 MBC',
    1000000000: '10억 MBC',
    10000000000: '100억 MBC',
    100000000000: '1,000억 MBC'
  };
  document.getElementById('whaleThreshold').textContent = labelMap[thresholdMBC] || (thresholdMBC.toLocaleString() + ' MBC');

  // 즉시 UI: 페이지 번호 + active 버튼 + 스크롤
  document.getElementById('whalePage').textContent = page;
  const lastTotal = parseInt((document.getElementById('whaleTotalPages').textContent || '1').replace(/,/g, '')) || 1;
  renderWhalePagination(lastTotal, page);
  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);

  const qsStr = buildWhaleQs(page);
  let data = cacheGet(whaleCache, qsStr);
  if (!data) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;"><span class="tx-spinner" style="margin-right:8px;"></span>조회 중…</td></tr>';
    try {
      const res = await fetch('/api/whales?' + qsStr);
      data = await res.json();
      cacheSet(whaleCache, qsStr, data);
    } catch (e) {
      body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#C62828;">로드 실패: ' + e.message + '</td></tr>';
      return;
    }
  }
  try {

    document.getElementById('whaleCount').textContent = (data.total || 0).toLocaleString();
    document.getElementById('whalePage').textContent = data.page || 1;
    document.getElementById('whaleTotalPages').textContent = (data.totalPages || 1).toLocaleString();
    document.getElementById('whaleTotal').textContent = (data.total || 0).toLocaleString();
    document.getElementById('whale24h').textContent = (data.count24h || 0).toLocaleString();
    document.getElementById('whaleLatest').textContent = (data.latestBlock || 0).toLocaleString();
    document.getElementById('whaleUpdated').textContent = new Date().toLocaleTimeString('ko-KR');

    const items = data.items || [];
    if (items.length === 0) {
      body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px 20px; color:#999;">조건에 맞는 Whale 거래가 없습니다.</td></tr>';
      document.getElementById('whalePagination').innerHTML = '';
      return;
    }

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    body.innerHTML = items.map(t => {
      const fromHtml = t.from
        ? `<a class="address" onclick="showDetail('${esc(t.from)}'); return false;" title="${esc(t.from)}">${esc(shortAddr(t.from))}</a>`
        : `<span style="color:#999;">-</span>`;
      const toHtml = t.to
        ? `<a class="address" onclick="showDetail('${esc(t.to)}'); return false;" title="${esc(t.to)}">${esc(shortAddr(t.to))}</a>`
        : `<span style="color:#999;">-</span>`;
      const amountMBC = (t.amount || 0) / 10000;
      // 1000억+ 빨간색, 100억+ 주황색, 10억+ 강조
      let amountColor = 'var(--mbc-navy)';
      if (amountMBC >= 100000000000) amountColor = '#C62828';
      else if (amountMBC >= 10000000000) amountColor = '#E65100';
      else if (amountMBC >= 1000000000) amountColor = '#6D4C00';
      const poolBadge = t.is_pool ? ' <span style="background:#E3F2FD; color:var(--mbc-blue); padding:1px 6px; border-radius:3px; font-size:10px; font-weight:700;">🏊</span>' : '';
      return `<tr>
        <td class="center" style="color:var(--text-sub); font-size:11px;" title="${new Date((t.time||0)*1000).toLocaleString('ko-KR')}">${timeAgo(t.time)}</td>
        <td class="center" style="font-family:'Consolas',monospace; color:var(--mbc-navy); font-weight:600; font-size:12px;">${t.block.toLocaleString()}</td>
        <td>${fromHtml}${poolBadge}</td>
        <td>${toHtml}</td>
        <td class="right balance" style="color:${amountColor}; font-weight:800;">${fmt(amountMBC)}</td>
        <td class="center">${t.from ? `<a href="/address/${encodeURIComponent(t.from)}" target="_blank" rel="noopener" title="${esc(t.txid)}" style="color:var(--mbc-accent); font-family:'Consolas',monospace; font-size:11px; text-decoration:none;">${esc(shortTxid(t.txid))} ↗</a>` : `<span style="color:#999; font-family:'Consolas',monospace; font-size:11px;">${esc(shortTxid(t.txid))}</span>`}</td>
      </tr>`;
    }).join('');

    // 페이지네이션
    renderWhalePagination(data.totalPages || 1, data.page || 1);

    // 자동 갱신 (1페이지에서만) — poll 시 캐시 무효화
    if (whalePollTimer) clearInterval(whalePollTimer);
    if (page === 1) whalePollTimer = setInterval(() => { whaleCache.clear(); loadWhales(1); }, 180000);

    // 인접 페이지 prefetch (idle)
    // Disabled speculative prefetch on the low-memory Oracle host.
  } catch (e) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#C62828;">로드 실패: ' + e.message + '</td></tr>';
  }
}

function renderWhalePagination(totalPages, currentPage) {
  const el = document.getElementById('whalePagination');
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  const GROUP = 10;
  const groupStart = Math.floor((currentPage - 1) / GROUP) * GROUP + 1;
  const groupEnd = Math.min(groupStart + GROUP - 1, totalPages);
  let html = '';
  html += `<button onclick="loadWhales(1)" ${currentPage===1?'disabled':''}>«</button>`;
  html += `<button onclick="loadWhales(${Math.max(1, currentPage-1)})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<button class="${i===currentPage?'active':''}" onclick="loadWhales(${i})">${i}</button>`;
  }
  html += `<button onclick="loadWhales(${Math.min(totalPages, currentPage+1)})" ${currentPage===totalPages?'disabled':''}>›</button>`;
  html += `<button onclick="loadWhales(${totalPages})" ${currentPage===totalPages?'disabled':''}>»</button>`;
  el.innerHTML = html;
}

// ── 트랜잭션 탐색 (etherscan 스타일) ──────────────────
let txState = { page: 1, perPage: 25, address: '', excludePool: false, excludeDust: false, dustThreshold: 1 };
let txPollTimer = null;
const TX_POLL_INTERVAL = 120 * 1000;

// 클라이언트 페이지 캐시 (TTL 300초)
const PAGE_CACHE_TTL = 300 * 1000;
const txCache = new Map();
const whaleCache = new Map();
function cacheGet(map, key) {
  const e = map.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > PAGE_CACHE_TTL) { map.delete(key); return null; }
  return e.data;
}
function cacheSet(map, key, data) {
  map.set(key, { ts: Date.now(), data });
  if (map.size > 60) map.delete(map.keys().next().value);
}
function buildTxQs(pageOverride) {
  const p = pageOverride == null ? txState.page : pageOverride;
  const qs = new URLSearchParams({
    page: p, perPage: txState.perPage,
    excludePool: txState.excludePool ? '1' : '0',
    excludeDust: txState.excludeDust ? '1' : '0'
  });
  if (txState.excludeDust) qs.set('dustThreshold', Math.round((txState.dustThreshold || 1) * 10000));
  if (txState.address) qs.set('address', txState.address);
  return qs.toString();
}
function buildWhaleQs(pageOverride) {
  const thresholdMBC = parseInt(document.getElementById('whaleThresholdSel').value) || 100000000;
  const excludePool = document.getElementById('whaleExcludePool').checked;
  const qs = new URLSearchParams({
    page: pageOverride, perPage: 25,
    threshold: thresholdMBC * 10000,
    excludePool: excludePool ? '1' : '0'
  });
  return qs.toString();
}
function prefetchAdjacent(cur, kind) {
  return;
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  [cur - 1, cur + 1].forEach(pp => {
    if (pp < 1) return;
    if (kind === 'tx') {
      const k = buildTxQs(pp);
      if (cacheGet(txCache, k)) return;
      idle(() => fetch('/api/transactions?' + k).then(r => r.json()).then(d => cacheSet(txCache, k, d)).catch(() => {}), { timeout: 2000 });
    } else {
      const k = buildWhaleQs(pp);
      if (cacheGet(whaleCache, k)) return;
      idle(() => fetch('/api/whales?' + k).then(r => r.json()).then(d => cacheSet(whaleCache, k, d)).catch(() => {}), { timeout: 2000 });
    }
  });
}

function startTransfersPolling() {
  loadTxStats();          // 페이지 첫 진입 시 1회
  loadTransactions();
  if (txPollTimer) clearInterval(txPollTimer);
  // 첫 페이지일 때만 30초 자동 갱신 (poll에서만 stats 재호출)
  txPollTimer = setInterval(() => {
    if (txState.page === 1) {
      // poll 새로고침 시 캐시 무효화 + stats 갱신
      txCache.clear();
      loadTxStats();
      loadTransactions();
    }
  }, TX_POLL_INTERVAL);
}
function stopTransfersPolling() {
  if (txPollTimer) { clearInterval(txPollTimer); txPollTimer = null; }
}

function timeAgo(ts) {
  if (!ts) return '-';
  const diff = Math.floor(Date.now() / 1000 - ts);
  if (diff < 60) return diff + '초 전';
  if (diff < 3600) return Math.floor(diff / 60) + '분 전';
  if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
  if (diff < 86400 * 30) return Math.floor(diff / 86400) + '일 전';
  if (diff < 86400 * 365) return Math.floor(diff / 86400 / 30) + '개월 전';
  return Math.floor(diff / 86400 / 365) + '년 전';
}

function shortTxid(txid) {
  if (!txid) return '';
  return txid.substring(0, 6) + '..' + txid.substring(txid.length - 4);
}

function showTxFilterMsg(text, type) {
  const el = document.getElementById('txFilterMsg');
  if (!el) return;
  if (!text) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  if (type === 'error') { el.style.background = '#FFEBEE'; el.style.color = '#C62828'; el.style.border = '1px solid #FFCDD2'; }
  else if (type === 'info') { el.style.background = '#E3F2FD'; el.style.color = 'var(--mbc-navy)'; el.style.border = '1px solid #BBDEFB'; }
  else { el.style.background = '#FFF8E1'; el.style.color = '#6D4C00'; el.style.border = '1px solid #FFE082'; }
  el.innerHTML = text;
}

function normalizeAddress(input) {
  let v = (input || '').trim();
  if (!v) return { value: '', valid: true, note: '' };
  // bc1q로 시작하면 mbc1q로 자동 보정 (사용자 흔한 실수)
  if (/^bc1q[a-z0-9]/i.test(v) && !/^mbc1q/i.test(v)) {
    v = 'm' + v;
    return { value: v, valid: true, note: '"bc1q..." 입력 → "mbc1q..." 로 자동 보정했습니다.' };
  }
  // 유효한 MBC 주소 형식: B/b로 시작 26~35자, 또는 mbc1q로 시작 40~62자
  if (/^[Bb][a-zA-Z0-9]{25,40}$/.test(v) || /^mbc1q[a-z0-9]{30,60}$/.test(v)) {
    return { value: v, valid: true, note: '' };
  }
  return { value: v, valid: false, note: '주소 형식이 올바르지 않습니다. <strong>B</strong>, <strong>b</strong>, 또는 <strong>mbc1q</strong> 로 시작해야 합니다.' };
}

async function applyTxFilters() {
  const raw = document.getElementById('txFilterAddress').value;
  const n = normalizeAddress(raw);

  if (!n.valid) {
    showTxFilterMsg(n.note, 'error');
    return;
  }

  if (n.note) {
    showTxFilterMsg(n.note, 'info');
    document.getElementById('txFilterAddress').value = n.value;
  } else if (n.value === '') {
    showTxFilterMsg('', null);
  } else {
    showTxFilterMsg('', null);
  }

  txState.address = n.value;
  txState.excludePool = document.getElementById('txExcludePool').checked;
  txState.excludeDust = document.getElementById('txExcludeDust').checked;
  txState.dustThreshold = parseFloat(document.getElementById('txDustThreshold').value) || 1;
  txState.page = 1;

  const btn = document.getElementById('txApplyBtn');
  const prev = btn ? btn.textContent : '';
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'wait';
    btn.innerHTML = '<span class="tx-spinner"></span>조회 중...';
  }
  try {
    await loadTransactions();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = 'pointer';
      btn.textContent = prev || '적용';
    }
  }
}

function resetTxFilters() {
  document.getElementById('txFilterAddress').value = '';
  document.getElementById('txExcludePool').checked = false;
  document.getElementById('txExcludeDust').checked = false;
  document.getElementById('txDustThreshold').value = 1;
  showTxFilterMsg('', null);
  txState = { page: 1, perPage: 25, address: '', excludePool: false, excludeDust: false, dustThreshold: 1 };
  loadTransactions();
}

function goTxPage(p) {
  txState.page = p;
  // 즉시 UI: 페이지 번호 표시 + active 버튼 + 스크롤
  document.getElementById('txCurrentPage').textContent = p;
  const totalPages = parseInt((document.getElementById('txTotalPages').textContent || '1').replace(/,/g, '')) || 1;
  renderTxPagination(totalPages, p);
  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);
  loadTransactions();
}

function renderTxPagination(totalPages, currentPage) {
  const el = document.getElementById('txPagination');
  if (!el) return;
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  const GROUP = 10;
  const groupStart = Math.floor((currentPage - 1) / GROUP) * GROUP + 1;
  const groupEnd = Math.min(groupStart + GROUP - 1, totalPages);
  let html = '';
  html += `<button onclick="goTxPage(1)" ${currentPage===1?'disabled':''}>«</button>`;
  html += `<button onclick="goTxPage(${Math.max(1, currentPage-1)})" ${currentPage===1?'disabled':''}>‹</button>`;
  if (groupStart > 1) html += `<button onclick="goTxPage(${groupStart-1})">…</button>`;
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<button class="${i===currentPage?'active':''}" onclick="goTxPage(${i})">${i}</button>`;
  }
  if (groupEnd < totalPages) html += `<button onclick="goTxPage(${groupEnd+1})">…</button>`;
  html += `<button onclick="goTxPage(${Math.min(totalPages, currentPage+1)})" ${currentPage===totalPages?'disabled':''}>›</button>`;
  html += `<button onclick="goTxPage(${totalPages})" ${currentPage===totalPages?'disabled':''}>»</button>`;
  el.innerHTML = html;
}

async function loadTxStats() {
  try {
    const s = await fetch('/api/transactions/stats').then(r => r.json());
    document.getElementById('tx-latest').textContent = (s.latestBlock || 0).toLocaleString();
    document.getElementById('tx-total').textContent = (s.total || 0).toLocaleString();
    document.getElementById('tx-earliest').textContent = (s.earliestBlock || 0).toLocaleString();
    // 풀스캔 진행률 (대략 — earliest가 0에 가까워질수록 100%)
    if (s.latestBlock && s.earliestBlock !== null && s.earliestBlock !== undefined) {
      const range = s.latestBlock;
      const covered = s.latestBlock - s.earliestBlock + 1;
      const pct = Math.min(100, (covered / range * 100));
      document.getElementById('tx-progress').textContent = pct.toFixed(2) + '%';
    } else {
      document.getElementById('tx-progress').textContent = '-';
    }
    document.getElementById('tx-updated').textContent = new Date().toLocaleTimeString('ko-KR');
  } catch (e) {}
}

async function loadTransactions() {
  const body = document.getElementById('transfersBody');
  const qsStr = buildTxQs();
  let data = cacheGet(txCache, qsStr);
  if (!data) {
    body.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#666;"><span class="tx-spinner" style="margin-right:8px;"></span>조회 중...</td></tr>';
    try {
      const res = await fetch('/api/transactions?' + qsStr);
      data = await res.json();
      cacheSet(txCache, qsStr, data);
    } catch (e) {
      body.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#C62828;">로드 실패: ' + e.message + '</td></tr>';
      return;
    }
  }
  try {

    document.getElementById('txTotalCount').textContent = (data.total || 0).toLocaleString();
    document.getElementById('txCurrentPage').textContent = data.page || 1;
    document.getElementById('txTotalPages').textContent = (data.totalPages || 1).toLocaleString();

    const items = data.items || [];
    if (items.length === 0) {
      body.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#999;">' +
        (data.total === 0 ? '아직 수집된 트랜잭션이 없습니다 (풀스캔 진행 중)' : '조건에 맞는 트랜잭션이 없습니다.') +
        '</td></tr>';
      renderTxPagination(0, 1);
      return;
    }

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    body.innerHTML = items.map(t => {
      const fromHtml = t.from
        ? `<a class="address" onclick="showDetail('${esc(t.from)}'); return false;" title="${esc(t.from)}">${esc(shortAddr(t.from))}</a>`
        : `<span style="color:#999;">-</span>`;
      const toHtml = t.to
        ? `<a class="address" onclick="showDetail('${esc(t.to)}'); return false;" title="${esc(t.to)}">${esc(shortAddr(t.to))}</a>`
        : `<span style="color:#999;">-</span>`;
      const txHashHtml = t.from
        ? `<a href="/address/${encodeURIComponent(t.from)}" target="_blank" rel="noopener" title="TXID: ${esc(t.txid)}\n(클릭 시 새 창에서 보낸 지갑의 거래 이력 보기)" style="color:var(--mbc-accent); font-family:'Consolas',monospace; font-size:11px; text-decoration:none;">${esc(shortTxid(t.txid))} ↗</a>`
        : `<span style="color:#999; font-family:'Consolas',monospace; font-size:11px;" title="${esc(t.txid)}">${esc(shortTxid(t.txid))}</span>`;
      const methodHtml = t.is_pool
        ? '<span style="display:inline-block; background:#E3F2FD; color:var(--mbc-blue); padding:3px 10px; border-radius:10px; font-size:11px; font-weight:700; white-space:nowrap;" title="채굴풀이 채굴자에게 분배">🏊 Pool</span>'
        : '<span style="display:inline-block; background:#E8F5E9; color:var(--green); padding:3px 10px; border-radius:10px; font-size:11px; font-weight:700; white-space:nowrap;" title="일반 지갑 간 송금">💸 Transfer</span>';
      return `<tr>
        <td>${fromHtml}</td>
        <td>${toHtml}</td>
        <td class="right balance">${fmt((t.amount || 0) / 1e4)}</td>
        <td class="center">${txHashHtml}</td>
        <td class="center">${methodHtml}</td>
        <td class="center" style="font-family:'Consolas',monospace; color:var(--mbc-navy); font-weight:600; font-size:12px;">${t.block.toLocaleString()}</td>
        <td class="center" style="color:var(--text-sub); font-size:11px;" title="${new Date((t.time||0)*1000).toLocaleString('ko-KR')}">${timeAgo(t.time)}</td>
      </tr>`;
    }).join('');

    renderTxPagination(data.totalPages || 1, data.page || 1);
    // 인접 페이지 prefetch (idle)
    // Disabled speculative prefetch on the low-memory Oracle host.
  } catch (e) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#C62828;">로드 실패: ' + e.message + '</td></tr>';
  }
}

// ── 라우트 파싱 ─────────────────────────
const VALID_PAGES = ['holders','transfers','whales','search','stats','mining','exchanges','wonpay','tokens','news','qna','qna-detail','lab','links','about','privacy','contact'];

function parseRoute() {
  // 우선순위: pathname → hash (legacy #holders 등 구글 인덱스 호환)
  let p = location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!p && location.hash) p = location.hash.substring(1);
  if (!p) return { type: 'page', page: 'holders' };

  if (p.startsWith('address/')) {
    return { type: 'detail', address: decodeURIComponent(p.substring(8)) };
  }
  if (p.startsWith('tokens/')) {
    return { type: 'token', ticker: decodeURIComponent(p.substring(7)) };
  }
  if (p.startsWith('qna/')) {
    return { type: 'qna-detail', id: decodeURIComponent(p.substring(4)) };
  }
  // legacy hash 호환: detail/주소
  if (p.startsWith('detail/')) {
    return { type: 'detail', address: decodeURIComponent(p.substring(7)) };
  }
  if (VALID_PAGES.includes(p)) return { type: 'page', page: p };
  return { type: 'page', page: 'holders' };
}

// ── 뒤로가기/앞으로가기 처리 ─────────────────────────
window.addEventListener('popstate', (e) => {
  const r = parseRoute();
  if (r.type === 'detail') showDetail(r.address, undefined, true);
  else if (r.type === 'token') showTokenDetail(r.ticker, true);
  else if (r.type === 'qna-detail') showQnaDetail(r.id, true);
  else navigate(r.page, true);
});

// ── 사이드바 토글 ─────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('collapsed');
  // body 클래스도 토글해서 main-wrap의 margin-left를 동기화 (모바일 퍼스트 리팩터링)
  document.body.classList.toggle('sidebar-collapsed', sb.classList.contains('collapsed'));
  document.getElementById('toggleIcon').textContent = sb.classList.contains('collapsed') ? '▶' : '◀';
}
function toggleMobileSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.querySelector('.sidebar-overlay');
  sb.classList.toggle('mobile-open');
  ov.classList.toggle('active');
}

// ── 데이터 로드 (서버 페이지네이션) ─────────────────────────────
let allHolders = [];          // 현재 페이지(50개) — CSV/showDetail 호환 유지
let currentPageNum = 1;
const PAGE_SIZE = 50;
const PAGE_GROUP = 10;        // 한 번에 보이는 페이지 버튼 수
let totalHoldersCount = 0;
let totalHoldersSupply = 0;   // 전체 잔액 합 (점유율 계산용, 서버에서 받음)
let tokenLoadQueue = [];
let tokenLoadTimer = null;

function fmt(num) {
  return Number(num).toLocaleString(currentLang === 'en' ? 'en-US' : 'ko-KR', {maximumFractionDigits: 8});
}
function shortAddr(addr) {
  if (!addr) return '';
  if (addr.length <= 20) return addr;
  return addr.substring(0, 12) + '...' + addr.substring(addr.length - 6);
}

async function loadData() {
  fetch('/api/stats').then(r => r.json()).then(s => {
    document.getElementById('stat-visitors').textContent = (s.todayVisitors || 0).toLocaleString();
  }).catch(() => {
    document.getElementById('stat-visitors').textContent = '-';
  });
  renderPage(1);
}

async function renderPage(page) {
  currentPageNum = page;
  const body = document.getElementById('holdersBody');
  body.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:#999;">불러오는 중…</td></tr>';
  try {
    const res = await fetch('/api/holders?page=' + page + '&limit=' + PAGE_SIZE);
    const data = await res.json();
    const pageData = data.holders || [];
    allHolders = pageData;
    totalHoldersCount = data.count || 0;
    if (data.totalSupply) totalHoldersSupply = data.totalSupply;

    document.getElementById('stat-block').textContent = (data.blockHeight || 0).toLocaleString();
    document.getElementById('stat-holders').textContent = totalHoldersCount.toLocaleString();
    document.getElementById('stat-updated').textContent = new Date().toLocaleTimeString(currentLang === 'en' ? 'en-US' : 'ko-KR');

    const start = (page - 1) * PAGE_SIZE;
    const html = pageData.map((h, i) => {
      const rowIndex = start + i;
      const rank = rowIndex + 1;
      const balanceMBC = (h.balance || 0) / 1e8;
      const percent = totalHoldersSupply ? ((h.balance / totalHoldersSupply) * 100).toFixed(4) : '0.0000';
      const rankClass = rank <= 10 ? 'rank top' : 'rank';
      const addrEscaped = h.address.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
      return `
        <tr>
          <td class="center"><span class="${rankClass}">${rank}</span></td>
          <td><a class="address" onclick="showDetail('${addrEscaped}'); return false;" title="${h.address}" style="cursor:pointer;">${h.address}</a></td>
          <td class="right balance">${fmt(balanceMBC)}</td>
          <td class="right percent">${percent}%</td>
          <td class="center" id="tcell-${rowIndex}"><span style="color:#bbb;font-size:11px;">···</span></td>
        </tr>`;
    }).join('');

    const noData = currentLang === 'en' ? 'No data' : '데이터가 없습니다';
    body.innerHTML = html || '<tr><td colspan="5" style="text-align:center; padding:30px; color:#999;">' + noData + '</td></tr>';

    document.getElementById('totalCount').textContent = totalHoldersCount.toLocaleString();
    document.getElementById('currentPage').textContent = page;
    const totalPages = data.totalPages || Math.ceil(totalHoldersCount / PAGE_SIZE) || 1;
    document.getElementById('totalPages').textContent = totalPages;

    renderPagination(page, totalPages);

    const queueItems = pageData.map((h, i) => ({ rowIndex: start + i, address: h.address }));
    startTokenBatchLoad(queueItems);

    if (page === 1) window.scrollTo(0, 0);
  } catch (e) {
    const errMsg = currentLang === 'en' ? '❌ Failed to load: ' : '❌ 데이터 로드 실패: ';
    body.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#C62828;">' + errMsg + e.message + '</td></tr>';
  }
}

// ── 토큰 배치 로딩 ─────────────────────────────────
function startTokenBatchLoad(items) {
  if (tokenLoadTimer) clearTimeout(tokenLoadTimer);
  tokenLoadQueue = items.slice();
  tokenLoadTimer = setTimeout(processTokenBatch, 200);
}

// localStorage 토큰 캐시 (1시간) — 같은 브라우저는 1시간 동안 같은 주소를 다시 요청하지 않음
const TOKEN_LS_TTL = 60 * 60 * 1000;
function getTokenCache(addr) {
  try {
    const raw = localStorage.getItem('tkc:' + addr);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.t) return null;
    if (Date.now() - obj.t > TOKEN_LS_TTL) { localStorage.removeItem('tkc:' + addr); return null; }
    return obj.b || [];
  } catch (e) { return null; }
}
function setTokenCache(addr, balances) {
  try {
    localStorage.setItem('tkc:' + addr, JSON.stringify({ t: Date.now(), b: balances }));
  } catch (e) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf('tkc:') === 0) keys.push(k);
      }
      keys.slice(0, Math.floor(keys.length / 2)).forEach(k => localStorage.removeItem(k));
      localStorage.setItem('tkc:' + addr, JSON.stringify({ t: Date.now(), b: balances }));
    } catch (e2) {}
  }
}
function renderTokenCell(cell, balances, address) {
  const filtered = (balances || []).filter(b => b.value > 0);
  if (filtered.length > 0) {
    cell.innerHTML = filtered.map(b => {
      const ticker = String(b.ticker).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
      return `<span class="token-badge" onclick="showDetail('${address.replace(/'/g, '&#39;')}', 'tokens')">${ticker}</span>`;
    }).join(' ');
  } else {
    cell.innerHTML = '<span style="color:#ccc;font-size:11px;">-</span>';
  }
}

function processTokenBatch() {
  // 캐시 hit는 큐 앞부분에서 즉시 처리 (네트워크 요청 안 함)
  while (tokenLoadQueue.length > 0) {
    const item = tokenLoadQueue[0];
    const cached = getTokenCache(item.address);
    if (cached === null) break;
    tokenLoadQueue.shift();
    const cell = document.getElementById('tcell-' + item.rowIndex);
    if (cell) renderTokenCell(cell, cached, item.address);
  }
  if (tokenLoadQueue.length === 0) return;
  const batch = tokenLoadQueue.splice(0, 5);
  const addrs = batch.map(item => item.address).join(',');
  fetch('/api/tokens/addresses?addrs=' + encodeURIComponent(addrs))
    .then(r => r.json())
    .then(payload => {
      const results = payload.results || {};
      batch.forEach(item => {
        const data = results[item.address] || {};
        const balances = data.balances || [];
        setTokenCache(item.address, balances);
        const cell = document.getElementById('tcell-' + item.rowIndex);
        if (cell) renderTokenCell(cell, balances, item.address);
      });
    })
    .catch(() => {
      batch.forEach(item => {
        const cell = document.getElementById('tcell-' + item.rowIndex);
        if (cell) cell.innerHTML = '<span style="color:#ccc;font-size:11px;">-</span>';
      });
    })
    .finally(() => {
      if (tokenLoadQueue.length > 0) tokenLoadTimer = setTimeout(processTokenBatch, 900);
    });
}

function renderPagination(current, total) {
  const wrap = document.getElementById('pagination');
  if (total <= 1) { wrap.innerHTML = ''; return; }

  const first = currentLang === 'en' ? '« First' : '« 처음';
  const last = currentLang === 'en' ? 'Last »' : '끝 »';

  // 현재 페이지가 속한 10개 그룹 계산
  // 예: current=1~10 → group 1~10, current=11~20 → group 11~20
  const groupStart = Math.floor((current - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
  const groupEnd = Math.min(total, groupStart + PAGE_GROUP - 1);
  const prevGroupPage = Math.max(1, groupStart - 1);   // 이전 그룹 마지막 페이지
  const nextGroupPage = Math.min(total, groupEnd + 1); // 다음 그룹 첫 페이지

  const pages = [];
  // « 처음
  pages.push(`<button onclick="renderPage(1)" ${current === 1 ? 'disabled' : ''}>${first}</button>`);
  // ‹‹ 이전 10개 그룹
  pages.push(`<button onclick="renderPage(${prevGroupPage})" ${groupStart === 1 ? 'disabled' : ''} title="이전 10페이지">‹‹</button>`);
  // ‹ 이전 페이지
  pages.push(`<button onclick="renderPage(${Math.max(1, current - 1)})" ${current === 1 ? 'disabled' : ''}>‹</button>`);

  // 현재 그룹 내 10개 페이지 버튼
  for (let p = groupStart; p <= groupEnd; p++) {
    pages.push(`<button class="${p === current ? 'active' : ''}" onclick="renderPage(${p})">${p}</button>`);
  }

  // › 다음 페이지
  pages.push(`<button onclick="renderPage(${Math.min(total, current + 1)})" ${current === total ? 'disabled' : ''}>›</button>`);
  // ›› 다음 10개 그룹
  pages.push(`<button onclick="renderPage(${nextGroupPage})" ${groupEnd === total ? 'disabled' : ''} title="다음 10페이지">››</button>`);
  // 끝 »
  pages.push(`<button onclick="renderPage(${total})" ${current === total ? 'disabled' : ''}>${last}</button>`);

  wrap.innerHTML = pages.join('');
}

function searchAddress() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) {
    alert(currentLang === 'en' ? 'Please enter a wallet address.' : '지갑 주소를 입력해주세요.');
    return;
  }
  showDetail(q);
}

// ── 지갑 상세 페이지 ─────────────────────────────────
let currentDetailAddr = null;

function copyAddress() {
  if (!currentDetailAddr) return;
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = currentDetailAddr;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentDetailAddr).catch(fallback);
  } else {
    fallback();
  }
  const ok = document.getElementById('copyOk');
  if (ok) {
    ok.style.opacity = '1';
    setTimeout(() => { ok.style.opacity = '0'; }, 1500);
  }
}

function showDetail(address, defaultTab, fromPopstate) {
  if (!address) return;
  currentDetailAddr = address;

  // 페이지 전환
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-detail').classList.add('active');
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

  // history에 push (뒤로가기 가능)
  if (!fromPopstate) {
    const newPath = '/address/' + encodeURIComponent(address);
    if (location.pathname !== newPath) {
      history.pushState({detail: address}, '', newPath);
    }
  }

  updatePageMeta('detail', address);

  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);

  // 헤더 채우기 (전체 주소 + 복사 버튼)
  const addrBox = document.getElementById('detailAddress');
  addrBox.innerHTML =
    '<span id="detailAddrText" style="user-select:all;">' + address.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])) + '</span>' +
    '<button onclick="copyAddress()" title="주소 복사" style="margin-left:10px; padding:4px 10px; background:var(--mbc-navy); color:#fff; border:none; border-radius:5px; cursor:pointer; font-size:12px; font-weight:700; vertical-align:middle;">📋 복사</button>' +
    '<span id="copyOk" style="margin-left:8px; color:#2E7D32; font-size:12px; font-weight:700; opacity:0; transition:opacity .3s;">✓ 복사됨</span>';

  // 순위/잔액/점유율 계산 (allHolders는 현재 페이지 50개만 → 전체 supply는 totalHoldersSupply 사용)
  const idx = allHolders.findIndex(h => h.address === address);
  if (idx >= 0) {
    const h = allHolders[idx];
    const totalSat = totalHoldersSupply || 0;
    const rank = (currentPageNum - 1) * PAGE_SIZE + idx + 1;
    document.getElementById('detailBalance').textContent = fmt((h.balance || 0) / 1e8);
    document.getElementById('detailRank').textContent = '#' + rank;
    document.getElementById('detailPercent').textContent = totalSat ? ((h.balance / totalSat) * 100).toFixed(4) + '%' : '-';
  } else {
    // 활성 홀더 리스트(잔액 > 0)에 없음 → 현재 잔액 0
    // (allHolders는 활성 잔액 보유자만 저장)
    document.getElementById('detailBalance').textContent = '0';
    document.getElementById('detailRank').textContent = '비활성';
    document.getElementById('detailPercent').textContent = '0.0000%';
    // 주소 박스 옆에 안내 배지 추가 (중복 방지)
    if (!document.getElementById('inactiveBadge')) {
      const badge = document.createElement('div');
      badge.id = 'inactiveBadge';
      badge.style.cssText = 'margin-top:10px; padding:8px 12px; background:#FFF8E1; border-left:4px solid var(--mbc-gold); border-radius:6px; font-size:12px; color:#6D4C00; line-height:1.5;';
      badge.innerHTML = 'ℹ️ <strong>이 지갑은 현재 잔액이 0</strong>이거나 활성 홀더 리스트에 없습니다. 과거 거래 내역만 조회됩니다.';
      const addrEl = document.getElementById('detailAddress');
      if (addrEl && addrEl.parentNode) addrEl.parentNode.insertBefore(badge, addrEl.nextSibling);
    }
  }
  // 활성 홀더로 진입 시 이전 배지 제거
  if (idx >= 0) {
    const oldBadge = document.getElementById('inactiveBadge');
    if (oldBadge) oldBadge.remove();
  }

  // 거래 내역 로드
  document.getElementById('txTableBody').innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#999;">로딩 중…</td></tr>';
  document.getElementById('tokensContainer').innerHTML = '로딩 중…';

  switchTab(defaultTab || 'mbc');
  loadHolderSummary(address);
  loadAddressTransactions(address);
  loadAddressTokens(address);
}

function loadHolderSummary(address) {
  fetch('/api/holder/' + encodeURIComponent(address))
    .then(r => r.json())
    .then(h => {
      if (currentDetailAddr !== address || !h) return;
      if (h.found) {
        document.getElementById('detailBalance').textContent = fmt((h.balance || 0) / 1e8);
        document.getElementById('detailRank').textContent = '#' + (h.rank || '-');
        document.getElementById('detailPercent').textContent = ((h.percent || 0).toFixed(4)) + '%';
        const oldBadge = document.getElementById('inactiveBadge');
        if (oldBadge) oldBadge.remove();
      } else {
        document.getElementById('detailBalance').textContent = '0';
        document.getElementById('detailRank').textContent = '비활성';
        document.getElementById('detailPercent').textContent = '0.0000%';
      }
    })
    .catch(() => {});
}

function switchTab(name) {
  const isMbc = name === 'mbc';
  document.getElementById('tabMbc').style.background = isMbc ? 'var(--mbc-navy)' : '#fff';
  document.getElementById('tabMbc').style.color = isMbc ? '#fff' : 'var(--mbc-navy)';
  document.getElementById('tabTokens').style.background = !isMbc ? 'var(--mbc-navy)' : '#fff';
  document.getElementById('tabTokens').style.color = !isMbc ? '#fff' : 'var(--mbc-navy)';
  document.getElementById('mbcTab').style.display = isMbc ? 'block' : 'none';
  document.getElementById('tokensTab').style.display = !isMbc ? 'block' : 'none';
}

function loadAddressTransactions(address) {
  fetch('/api/address/' + address)
    .then(r => r.json())
    .then(data => {
      if (currentDetailAddr !== address) return;
      const txs = data.transactions || data.history || [];

      // 통계 카드 채우기 (거래 횟수 / 총 수신 / 총 송신 / 순금액)
      const totalReceived = txs.reduce((s, t) => s + (t.received || 0), 0);
      const totalSent     = txs.reduce((s, t) => s + (t.sent || 0), 0);
      const net           = totalReceived - totalSent;

      // 거래 횟수는 unique txid 기준 (multi-vout으로 같은 tx가 여러 row일 수 있음)
      const uniqTxids = new Set(txs.map(t => t.txid)).size;
      document.getElementById('detailTxCount').textContent = uniqTxids.toLocaleString();
      document.getElementById('detailReceived').textContent = fmt(totalReceived / 10000);
      document.getElementById('detailSent').textContent     = fmt(totalSent / 10000);
      document.getElementById('detailNet').textContent      = (net >= 0 ? '+' : '') + fmt(net / 10000);

      if (txs.length === 0) {
        document.getElementById('txTableBody').innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:#999;">거래 내역이 없습니다</td></tr>';
        return;
      }

      const rows = txs.slice(0, 100).map(tx => {
        const fromAddr = (tx.from || '알 수 없음').toString();
        const toAddr   = (tx.to   || '알 수 없음').toString();
        const isSelf   = fromAddr === toAddr && fromAddr !== '알 수 없음' && fromAddr !== 'Coinbase(채굴)';
        const isClickable = (a) => a && a !== '알 수 없음' && a !== 'Coinbase(채굴)';
        const safeFrom = fromAddr.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        const safeTo   = toAddr.replace(/'/g, '&#39;').replace(/"/g, '&quot;');

        const fromHtml = isClickable(fromAddr)
          ? `<a class="address" onclick="showDetail('${safeFrom}'); return false;" style="cursor:pointer; font-size:13px;">${fromAddr}</a>`
          : `<span style="color:#888; font-size:13px;">${fromAddr}</span>`;
        const toHtml = isSelf
          ? `<span style="color:#F5A623; font-size:12px; font-weight:600;">(자기 전송)</span>`
          : isClickable(toAddr)
            ? `<a class="address" onclick="showDetail('${safeTo}'); return false;" style="cursor:pointer; font-size:13px;">${toAddr}</a>`
            : `<span style="color:#888; font-size:13px;">${toAddr}</span>`;

        const recv = (tx.received || 0) / 10000;
        const sent = (tx.sent || 0) / 10000;
        const netAmt = recv - sent;
        const netColor = netAmt >= 0 ? '#2E7D32' : '#C62828';
        const netSign  = netAmt >= 0 ? '+' : '';

        const txid = (tx.txid || '').toString();
        const txidShort = txid.length > 12 ? txid.substring(0, 8) + '…' + txid.substring(txid.length - 4) : (txid || '-');

        const time = tx.time ? new Date(tx.time * 1000).toLocaleString('ko-KR') : '-';
        const conf = tx.confirmations !== undefined ? tx.confirmations.toLocaleString() : '-';

        return `<tr>
          <td>${fromHtml}</td>
          <td>${toHtml}</td>
          <td style="white-space:nowrap;"><span title="${txid}" style="font-family:'Consolas',monospace; font-size:11px; color:#888;">${txidShort}</span></td>
          <td class="right" style="color:#2E7D32; font-weight:600; white-space:nowrap;">${recv > 0 ? fmt(recv) : '-'}</td>
          <td class="right" style="color:#C62828; font-weight:600; white-space:nowrap;">${sent > 0 ? fmt(sent) : '-'}</td>
          <td class="right" style="color:${netColor}; font-weight:700; white-space:nowrap;">${netSign}${fmt(netAmt)}</td>
          <td class="center" style="font-size:11px; white-space:nowrap;">${conf}</td>
          <td class="center" style="font-size:11px; white-space:nowrap;">${time}</td>
        </tr>`;
      }).join('');

      document.getElementById('txTableBody').innerHTML = rows;
    })
    .catch(err => {
      if (currentDetailAddr !== address) return;
      document.getElementById('txTableBody').innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:#C62828;">거래 내역 로드 실패: ' + err.message + '</td></tr>';
    });
}

// ── 토큰 이력 보기 토글 ─────────────────────────────────
async function toggleTokenHistory(address, ticker, btn) {
  const container = document.getElementById('tokenHist_' + ticker);
  if (!container) return;
  if (container.style.display !== 'none') {
    container.style.display = 'none';
    btn.textContent = '📜 이력 보기';
    return;
  }
  container.style.display = 'block';
  btn.textContent = '📜 이력 숨기기';
  container.innerHTML = '<div style="padding:14px; color:#888; text-align:center; font-size:12px;">불러오는 중…</div>';
  try {
    const res = await fetch('/api/tokens/transfers/' + encodeURIComponent(address) + '/' + encodeURIComponent(ticker));
    const data = await res.json();
    const list = (data && data.list) || [];
    if (list.length === 0) {
      container.innerHTML = '<div style="padding:14px; color:#888; text-align:center; font-size:12px;">전송 내역이 없습니다.</div>';
      return;
    }
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    container.innerHTML = `
      <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; background:#fff; border:1px solid var(--border); border-radius:6px;">
        <table style="width:100%; min-width:560px; font-size:12px;">
          <thead>
            <tr style="background:var(--mbc-navy); color:#fff;">
              <th style="padding:8px; text-align:center; width:90px;">시간</th>
              <th style="padding:8px; text-align:left;">상대 주소</th>
              <th style="padding:8px; text-align:center; width:60px;">방향</th>
              <th style="padding:8px; text-align:right; width:140px;">금액</th>
              <th style="padding:8px; text-align:center; width:80px;">블록</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(t => {
              const isReceiver = t.receiver === address;
              const counter = isReceiver ? t.sender : t.receiver;
              const dir = isReceiver
                ? '<span style="color:#2E7D32; font-weight:700;">⬅ 수신</span>'
                : '<span style="color:#C62828; font-weight:700;">➡ 송신</span>';
              const decimals = t.decimals || 0;
              const amt = (t.value / Math.pow(10, decimals)).toLocaleString('en-US', { maximumFractionDigits: 4 });
              const tm = t.created ? new Date(t.created * 1000).toLocaleDateString('ko-KR') : '-';
              return `<tr style="border-bottom:1px solid var(--border);">
                <td style="padding:8px; text-align:center; color:var(--text-sub); font-size:11px; white-space:nowrap;">${tm}</td>
                <td style="padding:8px; font-family:'Consolas',monospace; font-size:11px; word-break:break-all;">${counter ? `<a class="address" onclick="showDetail('${esc(counter)}'); return false;" style="cursor:pointer;">${esc(shortAddr(counter))}</a>` : '<span style="color:#999;">-</span>'}</td>
                <td style="padding:8px; text-align:center; font-size:11px;">${dir}</td>
                <td style="padding:8px; text-align:right; font-weight:700; font-family:'Consolas',monospace;">${amt}</td>
                <td style="padding:8px; text-align:center; font-family:'Consolas',monospace; color:var(--mbc-navy); font-size:11px;">${t.height ? t.height.toLocaleString() : '-'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div style="padding:8px; text-align:right; font-size:10px; color:#999;">데이터: tokens.mbc.wiki</div>
    `;
  } catch (e) {
    container.innerHTML = '<div style="padding:14px; color:#C62828; text-align:center; font-size:12px;">로드 실패: ' + e.message + '</div>';
  }
}

function loadAddressTokens(address) {
  fetch('/api/tokens/address/' + address)
    .then(r => r.json())
    .then(data => {
      if (currentDetailAddr !== address) return;
      const balances = (data.balances || []).filter(b => b.value > 0);
      if (balances.length === 0) {
        document.getElementById('tokensContainer').innerHTML = '<div style="padding:20px; color:#888; text-align:center;">보유 토큰이 없습니다</div>';
        return;
      }
      const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      document.getElementById('tokensContainer').innerHTML = balances.map(b => `
        <div style="background:var(--bg-soft); padding:14px 18px; border-radius:8px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <div style="font-weight:700; font-size:15px; color:var(--mbc-navy);">${esc(b.ticker)}</div>
            <div style="color:#2E7D32; font-weight:700; font-size:16px; text-align:right;">${fmt(b.value / Math.pow(10, b.decimals || 0))}</div>
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button onclick="toggleTokenHistory('${esc(address)}', '${esc(b.ticker)}', this)" style="padding:6px 14px; background:var(--mbc-navy); color:#fff; border:none; border-radius:5px; font-size:12px; font-weight:700; cursor:pointer;">📜 이력 보기</button>
            <a onclick="navigate('tokens'); setTimeout(() => showTokenDetail('${esc(b.ticker)}'), 50); return false;" style="display:inline-flex; align-items:center; padding:6px 14px; background:#fff; color:var(--mbc-navy); border:1.5px solid var(--mbc-navy); border-radius:5px; font-size:12px; font-weight:700; cursor:pointer; text-decoration:none;">🪙 토큰 상세</a>
          </div>
          <div id="tokenHist_${esc(b.ticker)}" style="display:none; margin-top:10px;"></div>
        </div>
      `).join('');
    })
    .catch(() => {
      if (currentDetailAddr !== address) return;
      document.getElementById('tokensContainer').innerHTML = '<div style="padding:20px; color:#C62828; text-align:center;">토큰 로드 실패</div>';
    });
}

async function downloadCSV() {
  try {
    const res = await fetch('/api/holders');
    const data = await res.json();
    const all = data.holders || [];
    const totalSatoshi = data.totalSupply || all.reduce((s, h) => s + (h.balance || 0), 0);
    const header = 'Rank,Address,Balance(MBC),Percent\n';
    const rows = all.map((h, i) => {
      const balMBC = (h.balance || 0) / 1e8;
      const pct = totalSatoshi ? ((h.balance / totalSatoshi) * 100).toFixed(6) : '0';
      return `${i + 1},${h.address},${balMBC},${pct}`;
    }).join('\n');
    const csv = '﻿' + header + rows;
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mbc_holders_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('CSV 다운로드 실패: ' + e.message);
  }
}

const searchInputEl = document.getElementById('searchInput');
if (searchInputEl) {
  searchInputEl.addEventListener('keypress', e => {
    if (e.key === 'Enter') searchAddress();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);

  // legacy hash URL (#holders 등 구글 인덱스에 남아있을 수 있는 형식) → path로 정리
  if (location.hash && (location.pathname === '/' || location.pathname === '')) {
    const h = location.hash.substring(1);
    let target = '/holders';
    if (h.startsWith('detail/')) target = '/address/' + h.substring(7);
    else if (VALID_PAGES.includes(h)) target = '/' + h;
    history.replaceState({}, '', target);
  }

  const r = parseRoute();
  if (r.type === 'detail') {
    // 데이터 로드 후 detail 표시
    setTimeout(() => showDetail(r.address), 500);
  } else if (r.type === 'token') {
    setTimeout(() => showTokenDetail(r.ticker), 100);
  } else if (r.type === 'qna-detail') {
    setTimeout(() => showQnaDetail(r.id), 100);
  } else {
    navigate(r.page);
  }
});

loadData();
setInterval(loadData, 300000);

// ── 반감기 카운트다운 ─────────────────────────────────
// MBC 재론칭: 2019-10-09, 약 2년마다 30% 감소 (자연 감소)
const HALVING_GENESIS = new Date('2019-10-09T00:00:00Z');
const HALVING_EPOCH_MS = 2 * 365.25 * 24 * 60 * 60 * 1000; // 약 2년
const INITIAL_REWARD = 815;

function calcHalving() {
  const now = new Date();
  const elapsed = now - HALVING_GENESIS;
  const epochIndex = Math.floor(elapsed / HALVING_EPOCH_MS); // 0부터 시작 (epoch 1)
  const epochStart = new Date(HALVING_GENESIS.getTime() + epochIndex * HALVING_EPOCH_MS);
  const nextEpochStart = new Date(HALVING_GENESIS.getTime() + (epochIndex + 1) * HALVING_EPOCH_MS);
  const msUntilNext = nextEpochStart - now;

  const currentReward = INITIAL_REWARD * Math.pow(0.7, epochIndex);
  const nextReward = currentReward * 0.7;

  const days = Math.floor(msUntilNext / (1000 * 60 * 60 * 24));
  const hours = Math.floor((msUntilNext % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((msUntilNext % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((msUntilNext % (1000 * 60)) / 1000);

  return {
    epoch: epochIndex + 1, // 1부터 표시
    currentReward,
    nextReward,
    nextEpochStart,
    days, hours, mins, secs
  };
}

function updateHalvingDisplay() {
  const h = calcHalving();
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setText('cd-days', String(h.days).padStart(3, '0'));
  setText('cd-hours', String(h.hours).padStart(2, '0'));
  setText('cd-mins', String(h.mins).padStart(2, '0'));
  setText('cd-secs', String(h.secs).padStart(2, '0'));
  setText('currentEpoch', 'Epoch ' + h.epoch);
  setText('currentReward', h.currentReward.toFixed(2));
  setText('nextReward', h.nextReward.toFixed(2));
  setText('nextEpochDate', h.nextEpochStart.toISOString().slice(0, 10));
}

updateHalvingDisplay();
setInterval(updateHalvingDisplay, 1000);

// ── 수익성 계산기 ─────────────────────────────────────
let calcNetHashrate = 5880000;   // 기본값 (실측 약 5.88 MH/s)
let calcMbcKrwPrice = 0.5;       // 기본값 (실측 시도 후 갱신)
let calcBlockTimeSec = 60;        // 블록 시간

let calcLastUpdate = null;
let calcChange24h = null;
let calcDataSource = null;

async function fetchCalcData() {
  // 서버 프록시 API에서 MBC 시세 가져오기 (CMC 시총 기반)
  try {
    const r = await fetch('/api/price');
    if (r.ok) {
      const j = await r.json();
      if (j.mbc_krw) {
        calcMbcKrwPrice = j.mbc_krw;
        calcLastUpdate = j.last_cmc_update;
        calcChange24h = j.change_30d;  // 24h는 거의 0이라 30d 변동 표시
        calcDataSource = j;
      }
    }
  } catch (e) { console.warn('price API 실패', e); }

  // 네트워크 해시레이트 (MBC 풀노드 RPC 실시간)
  // 우선순위: 24h 평균 > 12h 평균 > 기본 120블록(2h)
  try {
    const r = await fetch('/api/mining-info');
    if (r.ok) {
      const j = await r.json();
      const hr = j.networkhashps_24h || j.networkhashps_12h || j.networkhashps;
      if (hr && hr > 0) calcNetHashrate = hr;
    }
  } catch (e) { console.warn('mining-info API 실패', e); }

  updateCalcInfo();
  calculateProfit();
}

function updateCalcInfo() {
  const el = document.getElementById('calcInfo');
  if (!el) return;
  const hashStr = calcNetHashrate >= 1e6 ? (calcNetHashrate/1e6).toFixed(2) + ' MH/s' :
                  calcNetHashrate >= 1e3 ? (calcNetHashrate/1e3).toFixed(2) + ' kH/s' :
                  calcNetHashrate.toFixed(0) + ' H/s';
  const epochIdx = Math.floor((Date.now() - HALVING_GENESIS.getTime()) / HALVING_EPOCH_MS);
  const reward = (INITIAL_REWARD * Math.pow(0.7, epochIdx)).toFixed(2);
  const priceStr = calcMbcKrwPrice ? calcMbcKrwPrice.toFixed(6) : '?';
  const lastUpd = calcLastUpdate ? new Date(calcLastUpdate).toLocaleDateString('ko-KR') : '?';

  el.innerHTML =
    `<div style="display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center;">` +
    `<span>📊 네트워크: <strong style="color:var(--mbc-navy);">${hashStr}</strong></span>` +
    `<span>💵 MBC 시세: <strong style="color:var(--mbc-navy);">${priceStr} 원</strong></span>` +
    `<span>⛏ 블록 보상: <strong style="color:var(--mbc-navy);">${reward} MBC</strong></span>` +
    `</div>` +
    (calcLastUpdate ? `<div style="font-size:10px; color:#999; margin-top:6px;">⚠️ MBC는 거래량이 낮아 가격이 부정확합니다. CMC 마지막 갱신: ${lastUpd} · 실거래는 <a href="https://www.lbank.com/trade/mbc_usdt" target="_blank" style="color:var(--mbc-accent); text-decoration:underline;">LBank</a>에서 확인</div>` : '');
}

function calculateProfit() {
  const myHs = parseFloat(document.getElementById('calcHashrate')?.value) || 0;
  const elecRate = parseFloat(document.getElementById('calcElec')?.value) || 0;
  const powerW = parseFloat(document.getElementById('calcPower')?.value) || 0;

  // 현재 블록 보상 계산 (반감기 반영)
  const epochIndex = Math.floor((Date.now() - HALVING_GENESIS.getTime()) / HALVING_EPOCH_MS);
  const blockReward = INITIAL_REWARD * Math.pow(0.7, epochIndex);

  // 일일 채굴량 = (내 해시 / 네트워크 해시) * (하루 초 / 블록 시간) * 블록 보상
  const blocksPerDay = 86400 / calcBlockTimeSec;
  const myShare = calcNetHashrate > 0 ? myHs / calcNetHashrate : 0;
  const dayMbc = myShare * blocksPerDay * blockReward;
  const monMbc = dayMbc * 30;

  const dayKrw = dayMbc * calcMbcKrwPrice;
  const monKrw = monMbc * calcMbcKrwPrice;

  // 전기료 (월 24시간 가동 기준)
  const kWhPerMonth = (powerW / 1000) * 24 * 30;
  const monElec = kWhPerMonth * elecRate;
  const netProfit = monKrw - monElec;

  const fmtN = (n, max) => Number(n).toLocaleString('ko-KR', {maximumFractionDigits: max || 2});
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setText('calcDayMbc', fmtN(dayMbc, 4) + ' MBC');
  setText('calcDayKrw', fmtN(dayKrw, 2) + ' 원');
  setText('calcMonthMbc', fmtN(monMbc, 2) + ' MBC');
  setText('calcMonthKrw', fmtN(monKrw, 2) + ' 원');
  setText('calcElecCost', fmtN(monElec, 0) + ' 원');
  setText('calcNetProfit', (netProfit >= 0 ? '+' : '') + fmtN(netProfit, 0) + ' 원');

  // 순수익 카드 색상 / 메시지
  const netCard = document.getElementById('calcNetCard');
  const netMsg = document.getElementById('calcNetMsg');
  if (netCard && netMsg) {
    if (netProfit >= 0) {
      netCard.style.background = '#E8F5E9';
      netCard.style.borderLeftColor = '#2E7D32';
      document.getElementById('calcNetProfit').style.color = '#2E7D32';
      netCard.querySelector('div').style.color = '#2E7D32';
      netMsg.textContent = '✓ 수익 발생';
      netMsg.style.color = '#2E7D32';
    } else {
      netCard.style.background = '#FFEBEE';
      netCard.style.borderLeftColor = '#C62828';
      document.getElementById('calcNetProfit').style.color = '#C62828';
      netCard.querySelector('div').style.color = '#C62828';
      netMsg.textContent = '✗ 전기료가 수익을 초과';
      netMsg.style.color = '#C62828';
    }
  }
}

// 페이지 로드 후 초기 데이터 로드
fetchCalcData();
