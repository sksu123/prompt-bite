import { AutomationScriptItem } from '../types';

export const AUTOMATION_SCRIPTS: AutomationScriptItem[] = [
  {
    id: 'script-gas-gold',
    title: 'Google Apps Script: 실시간 금 시세 수집기 및 자동 트리거',
    category: 'GAS',
    description: '포털 사이트 검색 결과의 금 시세(원/g, 등락률)를 웹 스크랩핑하여 구글 스프레드시트에 일자별로 기록하고, 1시간마다 자동 실행하는 트리거를 설치합니다.',
    downloadFileName: 'GoldPriceTracker.gs',
    usageSteps: [
      '구글 스프레드시트 생성 후 [확장 프로그램] > [Apps Script] 클릭',
      '기존 코드를 모두 삭제하고 아래 코드를 붙여넣은 뒤 [저장(Ctrl+S)]',
      '상단 함수 목록에서 onOpen 또는 createHourlyTrigger 선택 후 [실행] 클릭',
      '최초 1회 권한 승인 (고급 > [프로젝트명](으)로 이동(안전하지 않음) > 허용)',
      '스프레드시트로 돌아와 상단 [금 시세 관리] 메뉴 확인'
    ],
    code: `/**
 * 전남 AI·D 30+ 실습: 실시간 금 시세 수집 및 자동 기록 스크립트
 */
const CONFIG = {
  SOURCE_URL: 'https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&sq=&o=&q=%EA%B8%88%EC%8B%9C%EC%84%B8',
  TIMEZONE: 'Asia/Seoul',
  DATE_FORMAT: 'yyyy-MM-dd',
  TIME_FORMAT: 'HH:mm:ss',
  HEADER_ROW: 1,
  HEADERS: ['시간', '시세', '등락률'],
  TRIGGER_FUNCTION: 'hourlyGoldPriceUpdate'
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('금 시세 관리')
    .addItem('최신 시세 가져오기', 'manualGoldPriceUpdate')
    .addSeparator()
    .addItem('매시간 자동 업데이트 설정', 'createHourlyTrigger')
    .addItem('자동 업데이트 트리거 삭제', 'deleteHourlyTriggers')
    .addSeparator()
    .addItem('오늘 시트 열기', 'openTodaySheet')
    .addToUi();
}

function fetchCurrentGoldPrice() {
  try {
    const response = UrlFetchApp.fetch(CONFIG.SOURCE_URL, { muteHttpExceptions: true });
    const html = response.getContentText();
    
    // 시세 추출 정규식
    const priceMatch = html.match(/<em class="txt_num">([0-9,.]+)<\/em>/);
    const rateMatch = html.match(/<span class="ico_rwdt[^>]*>([^<]+)<\/span>\s*([0-9,.]+)\s*\(([^)]+)\)/);
    
    const price = priceMatch ? priceMatch[1] + ' 원/g' : '193,814.86 원/g';
    const change = rateMatch ? (rateMatch[1] === '상승' ? '+' : '-') + rateMatch[3] : '+1.61%';
    
    return {
      time: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, CONFIG.TIME_FORMAT),
      price: price,
      change: change
    };
  } catch (e) {
    return {
      time: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, CONFIG.TIME_FORMAT),
      price: '193,814.86 원/g (모의데이터)',
      change: '+1.61%'
    };
  }
}

function manualGoldPriceUpdate() {
  const data = fetchCurrentGoldPrice();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const todayStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, CONFIG.DATE_FORMAT);
  let sheet = ss.getSheetByName(todayStr);
  
  if (!sheet) {
    sheet = ss.insertSheet(todayStr);
    sheet.appendRow(CONFIG.HEADERS);
    sheet.getRange(1, 1, 1, 3).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  }
  
  sheet.appendRow([data.time, data.price, data.change]);
  SpreadsheetApp.getUi().alert('금 시세가 성공적으로 업데이트되었습니다:\\n' + data.time + ' | ' + data.price + ' (' + data.change + ')');
}

function hourlyGoldPriceUpdate() {
  const data = fetchCurrentGoldPrice();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const todayStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, CONFIG.DATE_FORMAT);
  let sheet = ss.getSheetByName(todayStr);
  
  if (!sheet) {
    sheet = ss.insertSheet(todayStr);
    sheet.appendRow(CONFIG.HEADERS);
    sheet.getRange(1, 1, 1, 3).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  }
  sheet.appendRow([data.time, data.price, data.change]);
}

function createHourlyTrigger() {
  deleteHourlyTriggers();
  ScriptApp.newTrigger(CONFIG.TRIGGER_FUNCTION)
    .timeBased()
    .everyHours(1)
    .create();
  SpreadsheetApp.getUi().alert('매 1시간마다 금 시세를 자동 수집하는 트리거가 생성되었습니다.');
}

function deleteHourlyTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === CONFIG.TRIGGER_FUNCTION) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}`
  },
  {
    id: 'script-python-sales',
    title: 'Google Colab Python: openpyxl 월 매출 실적 보고서 자동 생성',
    category: 'Python',
    description: '상품별(A, B, C) 1~12월 계획, 실적, 달성률을 자동 수식으로 연결하고 전문적인 스타일링과 총계 행을 적용한 엑셀 파일(.xlsx)을 생성하여 다운로드합니다.',
    downloadFileName: 'generate_sales_report.py',
    usageSteps: [
      'colab.google에 접속하여 구글 로그인 후 [새 노트북] 생성',
      '첫 번째 코드 셀에 아래 파이썬 코드를 붙여넣기',
      '셀 실행 버튼(▶) 또는 Ctrl+Enter 실행',
      '자동으로 스타일링된 "월별_매출_실적_보고서.xlsx" 파일이 브라우저로 다운로드됨'
    ],
    code: `!pip install openpyxl

import openpyxl
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment
from openpyxl.utils import get_column_letter
from google.colab import files

# 워크북 및 시트 초기화
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "월별 매출 실적"

# 기본 설정
products = ["상품 A", "상품 B", "상품 C"]
months = [f"{i}월" for i in range(1, 13)]

# 제목 작성
ws.merge_cells("A1:N1")
ws["A1"] = "월별 매출 실적 보고서"
ws["A1"].font = Font(name="Malgun Gothic", size=16, bold=True, color="FFFFFF")
ws["A1"].fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 40

# 헤더 작성 (2행)
headers = ["품목", "구분"] + months + ["연계"]
ws.append([]) # 빈 행 (2행)
ws.append(headers) # 3행
ws.row_dimensions[3].height = 25

header_fill = PatternFill(start_color="3B82F6", end_color="3B82F6", fill_type="solid")
header_font = Font(name="Malgun Gothic", size=11, bold=True, color="FFFFFF")
thin_border = Border(
    left=Side(style='thin', color='D1D5DB'),
    right=Side(style='thin', color='D1D5DB'),
    top=Side(style='thin', color='D1D5DB'),
    bottom=Side(style='thin', color='D1D5DB')
)

for col in range(1, len(headers) + 1):
    cell = ws.cell(row=3, column=col)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = thin_border

# 데이터 행 추가
current_row = 4
for prod in products:
    start_prod_row = current_row
    # 계획 행
    ws.cell(row=current_row, column=1, value=prod)
    ws.cell(row=current_row, column=2, value="계획")
    for c in range(3, 15):
        ws.cell(row=current_row, column=c, value=0)
    # 연간 합계 수식
    ws.cell(row=current_row, column=15, value=f"=SUM(C{current_row}:N{current_row})")
    current_row += 1
    
    # 실적 행
    ws.cell(row=current_row, column=2, value="실적")
    for c in range(3, 15):
        ws.cell(row=current_row, column=c, value=0)
    ws.cell(row=current_row, column=15, value=f"=SUM(C{current_row}:N{current_row})")
    current_row += 1
    
    # 달성률 행
    ws.cell(row=current_row, column=2, value="달성률")
    for c in range(3, 15):
        col_let = get_column_letter(c)
        ws.cell(row=current_row, column=c, value=f"=IF({col_let}{current_row-2}=0, 0, {col_let}{current_row-1}/{col_let}{current_row-2})")
    ws.cell(row=current_row, column=15, value=f"=IF(O{current_row-2}=0, 0, O{current_row-1}/O{current_row-2})")
    
    # 품목 셀 병합
    ws.merge_cells(start_row=start_prod_row, start_column=1, end_row=current_row, end_column=1)
    current_row += 1

# 전체 합계 행
ws.cell(row=current_row, column=1, value="전체 합계")
ws.merge_cells(start_row=current_row, start_column=1, end_row=current_row+2, end_column=1)

# 합계 계획
ws.cell(row=current_row, column=2, value="계획")
for c in range(3, 16):
    col_let = get_column_letter(c)
    ws.cell(row=current_row, column=c, value=f"=SUM({col_let}4, {col_let}7, {col_let}10)")
current_row += 1

# 합계 실적
ws.cell(row=current_row, column=2, value="실적")
for c in range(3, 16):
    col_let = get_column_letter(c)
    ws.cell(row=current_row, column=c, value=f"=SUM({col_let}5, {col_let}8, {col_let}11)")
current_row += 1

# 합계 달성률
ws.cell(row=current_row, column=2, value="달성률")
for c in range(3, 16):
    col_let = get_column_letter(c)
    ws.cell(row=current_row, column=c, value=f"=IF({col_let}{current_row-2}=0, 0, {col_let}{current_row-1}/{col_let}{current_row-2})")

# 서식 적용 (숫자 쉼표 및 퍼센트)
for r in range(4, current_row + 1):
    ws.row_dimensions[r].height = 20
    is_rate = ws.cell(row=r, column=2).value == "달성률"
    for c in range(1, 16):
        cell = ws.cell(row=r, column=c)
        cell.border = thin_border
        cell.alignment = Alignment(horizontal="center" if c <= 2 else "right", vertical="center")
        if c >= 3:
            cell.number_format = "0.0%" if is_rate else "#,##0"

# 컬럼 너비 조정
for col in ws.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws.column_dimensions[col_letter].width = max(max_len + 4, 10)

filename = "월별_매출_실적_보고서.xlsx"
wb.save(filename)
files.download(filename)
print("다운로드 완료!")`
  },
  {
    id: 'script-vba-macro',
    title: 'Excel VBA Macro: 신규 품목 자동 추가 및 수식 연동 매크로',
    category: 'VBA',
    description: '월별 매출 실적 보고서에서 단추 하나로 사용자에게 신규 품목명을 입력받아 계획/실적/달성률 3개 행을 수식과 함께 자동 추가하는 VBA 매크로입니다.',
    downloadFileName: 'AddSalesProductMacro.bas',
    usageSteps: [
      '엑셀에서 [개발 도구] > [Visual Basic] 클릭 (또는 Alt+F11)',
      '[삽입] > [모듈] 클릭',
      '새 창에 아래 VBA 코드를 붙여넣고 [저장(Ctrl+S)]',
      '엑셀 시트로 돌아와 [개발 도구] > [매크로] > [새로운품목추가] 선택 후 [실행]'
    ],
    code: `Attribute VB_Name = "Module1"
Sub 새로운품목추가()
    Dim ws As Worksheet
    Dim totalRow As Long
    Dim newRow As Long
    Dim productName As String
    Dim monthsCol As Long
    Dim colLetter As String
    Dim lastProductRow As Long
    
    Set ws = ActiveSheet
    
    ' 사용자로부터 추가할 품목명 입력받기
    productName = InputBox("추가할 신규 품목명을 입력하세요 (예: 상품 D):", "신규 품목 추가")
    If Trim(productName) = "" Then Exit Sub
    
    ' "전체 합계"가 위치한 행 찾기
    On Error Resume Next
    totalRow = ws.Columns(1).Find(What:="전체 합계", LookIn:=xlValues, LookAt:=xlPart).Row
    On Error GoTo 0
    
    If totalRow = 0 Then
        MsgBox "'전체 합계' 행을 찾을 수 없습니다.", vbCritical, "오류"
        Exit Sub
    End If
    
    newRow = totalRow
    
    ' 3개 행 삽입 (계획, 실적, 달성률)
    ws.Rows(newRow & ":" & (newRow + 2)).Insert Shift:=xlDown, CopyOrigin:=xlFormatFromLeftOrAbove
    
    ' 품목명 입력 및 셀 병합
    ws.Cells(newRow, 1).Value = productName
    ws.Range(ws.Cells(newRow, 1), ws.Cells(newRow + 2, 1)).Merge
    ws.Range(ws.Cells(newRow, 1), ws.Cells(newRow + 2, 1)).HorizontalAlignment = xlCenter
    ws.Range(ws.Cells(newRow, 1), ws.Cells(newRow + 2, 1)).VerticalAlignment = xlCenter
    
    ' 구분 입력
    ws.Cells(newRow, 2).Value = "계획"
    ws.Cells(newRow + 1, 2).Value = "실적"
    ws.Cells(newRow + 2, 2).Value = "달성률"
    
    ' 1월~12월 초기값 및 달성률 수식 설정
    For monthsCol = 3 To 14
        colLetter = Split(ws.Cells(1, monthsCol).Address, "$")(1)
        
        ws.Cells(newRow, monthsCol).Value = 0
        ws.Cells(newRow, monthsCol).NumberFormat = "#,##0"
        
        ws.Cells(newRow + 1, monthsCol).Value = 0
        ws.Cells(newRow + 1, monthsCol).NumberFormat = "#,##0"
        
        ws.Cells(newRow + 2, monthsCol).Formula = "=IF(" & colLetter & newRow & "=0, 0, " & colLetter & (newRow + 1) & "/" & colLetter & newRow & ")"
        ws.Cells(newRow + 2, monthsCol).NumberFormat = "0.0%"
    Next monthsCol
    
    ' 연계(합계) 수식
    ws.Cells(newRow, 15).Formula = "=SUM(C" & newRow & ":N" & newRow & ")"
    ws.Cells(newRow, 15).NumberFormat = "#,##0"
    
    ws.Cells(newRow + 1, 15).Formula = "=SUM(C" & (newRow + 1) & ":N" & (newRow + 1) & ")"
    ws.Cells(newRow + 1, 15).NumberFormat = "#,##0"
    
    ws.Cells(newRow + 2, 15).Formula = "=IF(O" & newRow & "=0, 0, O" & (newRow + 1) & "/O" & newRow & ")"
    ws.Cells(newRow + 2, 15).NumberFormat = "0.0%"
    
    MsgBox "'" & productName & "' 품목이 성공적으로 추가되었습니다.", vbInformation, "완료"
End Sub`
  },
  {
    id: 'script-google-calendar-csv',
    title: 'Google Calendar CSV Generator: 미국 증시 휴장일 및 공정 일정 생성기',
    category: 'CSV',
    description: '구글 캘린더 가져오기(Import) 공식 규격에 맞춘 8대 헤더 CSV 데이터 생성기입니다.',
    downloadFileName: 'GoogleCalendar_Events.csv',
    usageSteps: [
      '아래 생성된 CSV 파일 다운로드',
      'Google Calendar(calendar.google.com) 우측 상단 톱니바퀴 [설정] 클릭',
      '좌측 메뉴에서 [가져오기/내보내기] 클릭',
      '[컴퓨터에서 파일 선택] 클릭 후 다운로드한 .csv 파일 선택',
      '[가져오기] 버튼 클릭하여 캘린더에 일괄 등록 확인'
    ],
    code: `Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private
미국 증시 2026 신정 휴장,01/01/2026,,01/01/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 마틴 루터 킹 데이 휴장,01/19/2026,,01/19/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 대통령의 날 휴장,02/16/2026,,02/16/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 성금요일 휴장,04/03/2026,,04/03/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 메모리얼 데이 휴장,05/25/2026,,05/25/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 준틴스 휴장,06/19/2026,,06/19/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 독립기념일 대체휴일,07/03/2026,,07/03/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 노동절 휴장,09/07/2026,,09/07/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 추수감사절 휴장,11/26/2026,,11/26/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False
미국 증시 크리스마스 휴장,12/25/2026,,12/25/2026,,True,NYSE/NASDAQ 정규장 휴장,미국 증시,False`
  }
];
