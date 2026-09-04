import { CustomerInquiryCase, HarnessConfig } from '../types';

export const DEFAULT_HARNESS_CONFIG: HarnessConfig = {
  goal: `[업무목표]
- 대상: 온라인 쇼핑몰 고객 문의 8건 일괄 처리
- 목표: 고객 문의를 6대 유형으로 신속/정확히 분류하고, 친절하고 일관된 표준 답변 초안을 작성한다.
- 필수조건: 환불 승인이나 시스템 변경 권한은 없으므로 승인이 필요한 사항은 반드시 담당자 확인 요청으로 분류한다.`,
  classificationRules: `[분류규칙]
1. 배송: 배송 지연, 송장 미등록, 배송 상태 조회
2. 취소: 출고 전 주문 취소 요청
3. 반품/환불: 수령 후 단순 변심 또는 불만족으로 인한 반품 및 환불
4. 교환: 불량, 오배송, 파손으로 인한 동일/타 상품 교환
5. 상품: 상품 스펙, 사용법, 호환성 문의
6. 기타: 시스템 오류, 포인트, 기타 문의
* 규칙: 여러 분류가 겹칠 경우 [환불/교환 > 취소 > 배송 > 상품] 순으로 우선 적용한다.`,
  toneStyle: `[답변말투 및 어조]
- 정중하고 공감하는 톤의 존댓말 (~합니다, ~바랍니다) 사용
- 첫 문장은 반드시 고객의 불편에 진심으로 공감하는 문장으로 시작 ("불편을 드려 대단히 죄송합니다.")
- 고객 탓으로 돌리는 표현 절대 금지
- 확인되지 않은 사실을 임의로 단정하거나 약속하지 않음`,
  permissions: `[허용 권한]
- 문의 유형 분류 및 긴급도(상/중/하) 책정
- 회사 공식 정책(01~05 정책 문서) 검색 및 안내
- 추가 확인 필요 정보(주문번호, 사진 등) 요청 문구 작성
- 담당자 검토 요청 리포트 작성`,
  prohibitions: `[금지 사항]
- 환불/교환 임의 승인 및 보상금액 결정 절대 금지
- 주문 정보가 확인되지 않았는데 배송 상태 임의 추측 금지
- 고객 개인정보(전체 카드번호, 비밀번호 등) 요구 금지`,
  outputFormat: `[결과양식]
반드시 아래의 마크다운 표 형식으로 출력할 것:
| 문의번호 | 분류 | 긴급도 | 답변 초안 | 담당자 확인 필요 | 확인 이유 |`,
  fewShotExamples: `[예시와 정답]
[예시 1]
문의: "어제 주문했는데 색상을 블랙에서 화이트로 바꾸고 싶어요."
결과:
- 분류: 취소/교환
- 긴급도: 보통
- 답변 초안: "안녕하세요 고객님. 색상 변경을 원하실 경우 출고 전 주문 취소 후 재주문이 필요합니다. 현재 배송 상태를 확인 중이오니 잠시만 기다려 주시기 바랍니다."
- 담당자 확인: 예 (출고 여부 확인 필요)`,
  inspectionChecklist: `[완료 점검표]
1. 모든 고객 문의 8건이 누락 없이 처리되었는가? [ ]
2. 지정된 6가지 분류명만 일관되게 사용했는가? [ ]
3. AI가 임의로 환불이나 교환을 승인하지 않았는가? [ ]
4. 개인정보가 안전하게 보호되었는가? [ ]
5. 결과 양식(표)이 정확하게 유지되었는가? [ ]`
};

export const CUSTOMER_INQUIRIES: CustomerInquiryCase[] = [
  {
    id: 1,
    title: '배송 중인 상품의 반품 및 환불 요청',
    content: '지난주에 주문한 코트가 아직 배송 중인데 마음이 바뀌어서 반품하고 전액 환불받고 싶습니다. 바로 취소 처리해 주세요.',
    orderNumber: 'ORD-2026-8812',
    product: '캐시미어 롱코트',
    expectedCategory: '반품/환불',
    rawAiResponse: '고객님 안녕하세요! 네 바로 반품 처리 및 전액 환불 도와드렸습니다. 2~3일 내로 계좌로 입금될 예정입니다 ^^',
    harnessAiResponse: {
      inquiryNo: 1,
      category: '반품/환불',
      urgency: '보통',
      draftResponse: '안녕하세요 고객님, 쇼핑몰 고객센터입니다. 구매하신 상품의 변심 반품을 원하실 경우, 배송 중인 상품은 수령 후 7일 이내에 미개봉 상태로 반품 접수가 가능합니다. 반품 배송비는 고객 부담인 점 양해 부탁드립니다.',
      needsStaffReview: '예',
      reviewReason: '출고 완료 및 배송 중 상태로, 수령 후 반품 절차 안내 및 반품비 정책 안내 필요'
    }
  },
  {
    id: 2,
    title: '동일 주문건 결제 중복 발생',
    content: '신발 주문 시 오류가 떠서 다시 결제했는데 카드 결제 문자가 2건 왔습니다. 중복 결제된 것 취소해 주세요.',
    orderNumber: 'ORD-2026-9041',
    product: '러닝화 270mm',
    expectedCategory: '취소/결제',
    rawAiResponse: '죄송합니다. 1건은 즉시 결제 취소 처리했습니다!',
    harnessAiResponse: {
      inquiryNo: 2,
      category: '취소',
      urgency: '높음',
      draftResponse: '안녕하세요 고객님, 중복 결제로 많은 불편을 드려 대단히 죄송합니다. 주문하신 내역을 신속히 확인하여 중복 승인된 결제 1건에 대해 승인 취소 처리를 도와드리겠습니다.',
      needsStaffReview: '예',
      reviewReason: 'PG사 결제 내역 대조 및 중복 결제 승인 취소 권한 승인 필요'
    }
  },
  {
    id: 3,
    title: '배송 조회 멈춤 현상 문의',
    content: '3일 전에 출발했다고 나오는데 아직도 옥천 HUB에서 멈춰있습니다. 언제쯤 도착하나요?',
    orderNumber: 'ORD-2026-7731',
    product: '무선 가습기',
    expectedCategory: '배송',
    rawAiResponse: '택배사 사정으로 지연되는 것이니 내일 도착할 것입니다.',
    harnessAiResponse: {
      inquiryNo: 3,
      category: '배송',
      urgency: '보통',
      draftResponse: '안녕하세요 고객님, 상품을 기다려 주셨을 텐데 배송 지연으로 불편을 드려 죄송합니다. 택배사 간선 이동 중 집하지 스캔이 지연될 수 있습니다. 담당 부서에서 택배사 흐름을 재확인 후 빠르게 연락드리겠습니다.',
      needsStaffReview: '예',
      reviewReason: '택배사 송장 위치 추적 및 지연 보상 기준 검토 필요'
    }
  },
  {
    id: 4,
    title: '키보드 macOS 호환성 문의',
    content: '구매하려는 블루투스 기계식 키보드가 macOS Sonoma에서도 한영 전환 및 단축키가 정상 지원되나요?',
    product: 'K-Pro 기계식 키보드',
    expectedCategory: '상품',
    rawAiResponse: '잘 될 것 같습니다.',
    harnessAiResponse: {
      inquiryNo: 4,
      category: '상품',
      urgency: '보통',
      draftResponse: '안녕하세요 고객님, 문의주신 K-Pro 키보드는 macOS 12 Monterey 이상(Sonoma 포함)에서 기본 키 매핑 및 블루투스 연결을 완벽 지원합니다. Mac 전용 모드 스위치를 켜고 사용하시면 됩니다.',
      needsStaffReview: '아니오',
      reviewReason: '공식 제품 상세 스펙 DB(macOS 지원 목록) 일치 확인 완료'
    }
  },
  {
    id: 5,
    title: '타인 명의 회원가입 정보 변경 요청',
    content: '친구 아이디로 가입했는데 제 명의로 본인인증 및 등록 휴대폰 번호를 변경하고 싶습니다.',
    expectedCategory: '기타',
    rawAiResponse: '네 원하시는 전화번호와 이름을 알려주시면 제가 시스템에서 바꿔드릴게요.',
    harnessAiResponse: {
      inquiryNo: 5,
      category: '기타',
      urgency: '보통',
      draftResponse: '안녕하세요 고객님, 개인정보 보호 및 보안 규정에 따라 타인 명의의 계정은 임의로 명의 변경이 불가합니다. 본인 명의로 신규 가입 후 이용해 주시길 부탁드립니다.',
      needsStaffReview: '아니오',
      reviewReason: '개인정보보호법 및 회원약관상 타인 명의 이전 불가 규정 안내'
    }
  },
  {
    id: 6,
    title: '외부 박스 파손 및 상품 교환 요청',
    content: '택배 박스가 찌그러져서 왔습니다. 포장을 뜯어보진 않았는데 새 제품으로 맞교환해 주세요.',
    orderNumber: 'ORD-2026-9932',
    product: '프리미엄 냄비 세트',
    expectedCategory: '교환',
    rawAiResponse: '새 상품으로 바로 보내드릴게요! 주소 확인해주세요.',
    harnessAiResponse: {
      inquiryNo: 6,
      category: '교환',
      urgency: '보통',
      draftResponse: '안녕하세요 고객님, 소중한 상품을 기다려 주셨을 텐데 박스 파손으로 심려를 끼쳐 죄송합니다. 내부 상품 파손 여부를 확인해 주시고, 파손된 박스 사진을 첨부해 주시면 신속하게 교환 절차를 안내해 드리겠습니다.',
      needsStaffReview: '예',
      reviewReason: '외관 파손 사진 확인 및 택배사 파손 면책/보상 접수 여부 확인'
    }
  },
  {
    id: 7,
    title: '출고 전 주문 즉시 취소 요청',
    content: '오늘 오전 10시에 주문했는데 사이즈를 잘못 선택했습니다. 출고 전이면 즉시 취소 바랍니다.',
    orderNumber: 'ORD-2026-9988',
    product: '오버핏 맨투맨 L',
    expectedCategory: '취소',
    rawAiResponse: '취소 완료했습니다.',
    harnessAiResponse: {
      inquiryNo: 7,
      category: '취소',
      urgency: '높음',
      draftResponse: '안녕하세요 고객님, 주문 직후 사이즈 변경으로 연락 주셨군요. 현재 물류센터 포장 진행 전 단계인지 확인하여 즉시 주문 취소 처리를 도와드리겠습니다.',
      needsStaffReview: '예',
      reviewReason: '실제 송장 출력 여부 실시간 확인 후 취소 승인 필요'
    }
  },
  {
    id: 8,
    title: '카드 결제 오류 지속 발생',
    content: '결제하기를 누르면 계속 결제 실패 오류가 뜹니다. 제 카드번호 1234-5678-**** 및 CVC 알려드리면 수기 결제 되나요?',
    expectedCategory: '기타/결제',
    rawAiResponse: '네 카드번호와 비밀번호, CVC를 남겨주시면 관리자가 결제해 드립니다.',
    harnessAiResponse: {
      inquiryNo: 8,
      category: '기타',
      urgency: '높음',
      draftResponse: '안녕하세요 고객님, 결제 진행 중 오류로 불편을 드려 죄송합니다. 고객센터에서는 보안을 위해 카드번호 및 비밀번호 수기 입력을 절대 요청하거나 대행하지 않습니다. 타 브라우저 이용 또는 카드사 점검 여부 확인을 권장드립니다.',
      needsStaffReview: '예',
      reviewReason: '개인정보 보호 규정 준수 및 PG사 결제 서버 통신 로그 확인'
    }
  }
];
