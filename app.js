const categories=[
 ["학생 체험","학생을 위한 체험 프로그램","#009B45","★"],
 ["수련원 예약","수련원·야영장","#F5A000","⌂"],
 ["교육 신청","학부모·교직원 교육","#D90070","◎"],
 ["시설/공간 대여","교육시설 공간 예약","#0756A5","□"],
 ["방학 캠프/행사","방학 특별 프로그램","#F5A000","✦"],
 ["진로 체험 / 교직원 연수","진로·직무 역량","#D90070","↗"]
];
const programs=[
 {id:1,cat:"학생 체험",target:"학생",title:"별빛 우주과학 체험교실",agency:"울산과학관",date:"2026-08-12",end:"2026-08-12",capacity:30,booked:18,special:false,desc:"천체관측과 우주과학 실험을 통해 과학적 호기심을 키우는 체험 프로그램입니다.",color:"#0756A5"},
 {id:2,cat:"수련원 예약",target:"학생",title:"여름 바다 생태 수련활동",agency:"울산학생교육원",date:"2026-08-15",end:"2026-08-17",capacity:40,booked:32,special:false,desc:"해양 생태 탐방과 공동체 활동으로 자연과 함께 배우는 수련 프로그램입니다.",color:"#F5A000"},
 {id:3,cat:"교육 신청",target:"학부모",title:"디지털 시대 학부모 교육",agency:"울산학부모지원센터",date:"2026-08-20",end:"2026-08-20",capacity:100,booked:54,special:true,desc:"자녀의 디지털 생활을 이해하고 가정에서 실천할 수 있는 교육 방법을 안내합니다.",color:"#D90070"},
 {id:4,cat:"시설/공간 대여",target:"일반",title:"교육문화회관 다목적홀",agency:"울산교육문화회관",date:"2026-08-22",end:"2026-08-22",capacity:20,booked:20,special:false,desc:"교육·문화 행사에 활용할 수 있는 쾌적한 다목적 공간입니다.",color:"#0756A5"},
 {id:5,cat:"방학 캠프/행사",target:"학생",title:"AI 창의융합 여름캠프",agency:"울산교육연구정보원",date:"2026-08-25",end:"2026-08-27",capacity:24,booked:16,special:true,desc:"AI와 메이커 활동을 결합한 프로젝트형 창의융합 캠프입니다.",color:"#009B45"},
 {id:6,cat:"진로 체험 / 교직원 연수",target:"교직원",title:"교원 미래교육 역량 연수",agency:"울산광역시교육청",date:"2026-08-28",end:"2026-08-28",capacity:60,booked:43,special:false,desc:"미래교육 정책과 수업 혁신 사례를 공유하는 교원 대상 연수입니다.",color:"#D90070"},
 {id:7,cat:"학생 체험",target:"학생",title:"우리 고장 역사 탐방",agency:"울산교육박물관",date:"2026-09-03",end:"2026-09-03",capacity:25,booked:7,special:false,desc:"울산의 역사와 문화를 현장에서 살펴보는 교육형 탐방입니다.",color:"#009B45"},
 {id:8,cat:"수련원 예약",target:"학생",title:"숲속 마음성장 캠프",agency:"울산수련원",date:"2026-09-06",end:"2026-09-08",capacity:35,booked:28,special:false,desc:"숲 체험과 협동 활동을 통해 학생의 자기성장과 공동체성을 돕습니다.",color:"#F5A000"}
];
let bookings=[
 {id:"R-1001",programId:1,qty:2,status:"예약완료"},
 {id:"R-1002",programId:3,qty:1,status:"승인대기"}
];
let currentProgram=null,currentQty=1,calendarDate=new Date(2026,7,1),selectedDate=null,currentStatus="all",myFilter="전체";
const $=s=>document.querySelector(s);
function statusOf(p){const r=p.booked/p.capacity;if(r>=1)return ["마감","closed"];if(r>=.7)return ["마감 임박","closing"];return ["예약 가능","available"]}
function iconSVG(text,color){return `<svg viewBox="0 0 400 150" aria-hidden="true"><path d="M-20 120 C90 15 180 170 270 60 S420 45 430 130 L430 170 L-20 170Z" fill="${color}" opacity=".13"/><circle cx="320" cy="35" r="38" fill="${color}" opacity=".12"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="48" fill="${color}" font-weight="800">${text}</text></svg>`}
function renderCategories(){ $("#categories").innerHTML=categories.map(c=>`<button class="cat" data-cat="${c[0]}"><div class="cat-icon" style="background:${c[2]}18;color:${c[2]}"><b style="font-size:25px">${c[3]}</b></div><strong>${c[0]}</strong><span>${c[1]}</span></button>`).join("")}
function renderCalendar(){
 const y=calendarDate.getFullYear(),m=calendarDate.getMonth(); $("#monthTitle").textContent=`${y}년 ${m+1}월`;
 const first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate(),prevLast=new Date(y,m,0).getDate();let html="";
 for(let i=0;i<42;i++){let d=i-first+1,actual=d,mm=m,yy=y,muted=false;if(d<1){actual=prevLast+d;mm=m-1;muted=true}else if(d>last){actual=d-last;mm=m+1;muted=true}const key=`${yy}-${String(mm+1).padStart(2,"0")}-${String(actual).padStart(2,"0")}`;const matches=programs.filter(p=>p.date===key);html+=`<button class="day ${muted?"muted":""} ${selectedDate===key?"selected":""}" data-date="${key}"><div class="day-num">${actual}</div>${matches.length?`<span class="count">${matches.length}건</span>`:""}</button>`}
 $("#calendarDays").innerHTML=html;
 document.querySelectorAll(".day").forEach(b=>b.onclick=()=>{selectedDate=b.dataset.date;$("#selectedDateText").textContent=`${selectedDate} 기준 프로그램`;renderCalendar();renderPrograms()})
}
function renderPrograms(){
 let list=[...programs],kw=$("#keyword").value.trim().toLowerCase(),cat=$("#category").value,target=$("#target").value,date=$("#dateFilter").value;
 if(kw)list=list.filter(p=>(p.title+p.agency+p.desc).toLowerCase().includes(kw));
 if(cat)list=list.filter(p=>p.cat===cat);if(target)list=list.filter(p=>p.target===target);if(date)list=list.filter(p=>p.date<=date&&p.end>=date);
 if(selectedDate)list=list.filter(p=>p.date===selectedDate);
 if(currentStatus==="closing")list=list.filter(p=>statusOf(p)[1]==="closing");
 if(currentStatus==="popular")list=list.sort((a,b)=>(b.booked/b.capacity)-(a.booked/a.capacity));
 $("#resultText").textContent=`총 ${list.length}개의 프로그램`;
 $("#programGrid").innerHTML=list.length?list.map(cardHTML).join(""):`<div class="empty">조건에 맞는 예약 프로그램이 없습니다.</div>`;
 document.querySelectorAll(".detail-btn,.book-btn").forEach(b=>b.onclick=()=>openModal(+b.dataset.id))
 updateSummary()
}
function cardHTML(p){
 const [st,cls]=statusOf(p),left=Math.max(0,p.capacity-p.booked),pct=Math.min(100,Math.round(p.booked/p.capacity*100));
 const bar=cls==="closing"?"#F5A000":cls==="closed"?"#8b969f":p.color;
 return `<article class="card"><div class="thumb">${iconSVG(p.cat,p.color)}<span class="badge" style="color:${bar}">${p.special?"특별 접수 · ":""}${st}</span></div><div class="card-body"><div class="meta"><span class="tag">${p.cat}</span><span class="tag">${p.target}</span></div><h3>${p.title}</h3><div class="agency">${p.agency}</div><div class="date">운영일 ${p.date} ~ ${p.end}</div><div class="progress-row"><span>${left?left+"자리 남음":"모집 마감"}</span><span>${p.booked}명 / ${p.capacity}명</span></div><div class="progress"><span style="width:${pct}%;background:${bar}"></span></div><div class="card-actions"><button class="detail-btn" data-id="${p.id}">상세보기</button><button class="book-btn" data-id="${p.id}" ${left===0?"disabled":""}>예약하기</button></div></div></article>`
}
function updateSummary(){
 const counts={available:0,closing:0,closed:0,special:0};programs.forEach(p=>{counts[statusOf(p)[1]]++;if(p.special)counts.special++});
 $("#availableCount").textContent=counts.available;$("#closingCount").textContent=counts.closing;$("#closedCount").textContent=counts.closed;$("#specialCount").textContent=counts.special;
 $("#myAll").textContent=bookings.length;$("#myPending").textContent=bookings.filter(x=>x.status==="승인대기").length;$("#myDone").textContent=bookings.filter(x=>x.status==="예약완료").length;$("#myUsed").textContent=bookings.filter(x=>x.status==="이용완료").length;
 renderReservations();
}
function renderReservations(){
 let list=myFilter==="전체"?bookings:bookings.filter(x=>x.status===myFilter);
 $("#reservationList").innerHTML=list.length?list.map(b=>{const p=programs.find(x=>x.id===b.programId);return `<div class="reservation"><div class="reservation-info"><strong>${p.title}</strong><span>${p.agency} · ${p.date} · ${b.qty}명 · 예약번호 ${b.id}</span><div style="margin-top:5px;color:${b.status==="예약완료"?"#0756A5":b.status==="취소"?"#8b969f":"#D90070"};font-weight:800">${b.status}</div></div>${b.status!=="취소"&&b.status!=="이용완료"?`<button class="cancel" data-rid="${b.id}">예약 취소</button>`:""}</div>`}).join(""):`<div class="empty">해당 상태의 예약이 없습니다.</div>`;
 document.querySelectorAll(".cancel").forEach(btn=>btn.onclick=()=>cancelBooking(btn.dataset.rid))
}
function openModal(id){
 currentProgram=programs.find(p=>p.id===id);currentQty=1;$("#qty").textContent=currentQty;$("#modalTitle").textContent=currentProgram.title;$("#modal").classList.add("show");renderModalTab("detail");updateCapacity()
}
function closeModal(){$("#modal").classList.remove("show");currentProgram=null}
function renderModalTab(tab){
 document.querySelectorAll(".modal-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.mtab===tab));
 const p=currentProgram;if(!p)return;
 if(tab==="detail")$("#modalContent").innerHTML=`<p><span class="tag">${p.cat}</span></p><p>${p.desc}</p><p><strong>운영기관</strong> ${p.agency}<br><strong>운영일</strong> ${p.date} ~ ${p.end}<br><strong>대상</strong> ${p.target}</p>`;
 if(tab==="status"){const [s]=statusOf(p);$("#modalContent").innerHTML=`<div class="panel" style="padding:15px;background:#f8fafc"><strong>현재 ${s}</strong><p style="margin:6px 0">신청 ${p.booked}명 / 정원 ${p.capacity}명</p><div class="progress"><span style="width:${p.booked/p.capacity*100}%;background:${statusOf(p)[1]==="closing"?"#F5A000":"#0756A5"}"></span></div></div>`}
 if(tab==="notice")$("#modalContent").innerHTML=`<p><strong>공지</strong><br>예약자는 운영일과 집결 장소를 신청 후 안내받을 수 있습니다.</p><div style="height:150px;border-radius:12px;background:#eef2f5;display:grid;place-items:center;color:#7a858f">지도/시설 위치 안내 영역</div>`;
}
function updateCapacity(){const left=currentProgram?currentProgram.capacity-currentProgram.booked:0;$("#capacityHint").textContent=`현재 ${left}석 신청 가능`;$("#submitBooking").disabled=left<currentQty}
function toast(msg){$("#toast").textContent=msg;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2600)}
function cancelBooking(rid){const b=bookings.find(x=>x.id===rid);if(!b)return;const p=programs.find(x=>x.id===b.programId);p.booked=Math.max(0,p.booked-b.qty);b.status="취소";toast("예약이 취소되었습니다.");renderPrograms()}
$("#searchForm").onsubmit=e=>{e.preventDefault();selectedDate=null;renderCalendar();renderPrograms();document.querySelector("#programs").scrollIntoView({behavior:"smooth"})};
$("#prevMonth").onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar()};$("#nextMonth").onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar()};
document.querySelectorAll("#statusTabs .tab").forEach(b=>b.onclick=()=>{document.querySelectorAll("#statusTabs .tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentStatus=b.dataset.status;renderPrograms()});
document.querySelectorAll("#myTabs .tab").forEach(b=>b.onclick=()=>{document.querySelectorAll("#myTabs .tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");myFilter=b.dataset.my;renderReservations()});
document.querySelectorAll(".modal-tabs button").forEach(b=>b.onclick=()=>renderModalTab(b.dataset.mtab));
$("#closeModal").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#minus").onclick=()=>{if(currentQty>1){currentQty--;$("#qty").textContent=currentQty;updateCapacity()}};$("#plus").onclick=()=>{if(currentProgram&&currentQty<currentProgram.capacity-currentProgram.booked){currentQty++;$("#qty").textContent=currentQty;updateCapacity()}};
$("#submitBooking").onclick=()=>{if(!currentProgram)return;const left=currentProgram.capacity-currentProgram.booked;if(currentQty>left){toast("신청 가능한 좌석이 부족합니다.");return}currentProgram.booked+=currentQty;bookings.push({id:"R-"+Math.floor(1000+Math.random()*9000),programId:currentProgram.id,qty:currentQty,status:"예약완료"});toast("예약 신청이 완료되었습니다.");closeModal();renderPrograms();document.querySelector("#my").scrollIntoView({behavior:"smooth"})};
document.querySelectorAll("[data-scroll]").forEach(b=>b.onclick=()=>{document.getElementById(b.dataset.scroll).scrollIntoView({behavior:"smooth"});$("#mobileNav").classList.remove("show")});
$("#menuBtn").onclick=()=>$("#mobileNav").classList.toggle("show");
document.getElementById("categories").addEventListener("click",e=>{const b=e.target.closest(".cat");if(!b)return;$("#category").value=b.dataset.cat;selectedDate=null;renderCalendar();renderPrograms();document.querySelector("#programs").scrollIntoView({behavior:"smooth"})});
renderCategories();renderCalendar();renderPrograms();
