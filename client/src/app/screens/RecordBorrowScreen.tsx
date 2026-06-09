import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, StepIndicator, MemberAvatar, BookSpine, ArabesqueHeader, GoldButton, GhostButton, SearchInput, WaxSealButton, starPath } from '../components/nebras/index';

const MEMBERS_LIST = [
  { id:1, nameAr:'أحمد القرشي',   nameEn:'Ahmed Al-Qurashi',  borrows:3, quota:5 },
  { id:2, nameAr:'فاطمة الزهراء', nameEn:'Fatima Al-Zahra',   borrows:2, quota:5 },
  { id:3, nameAr:'عمر الهاشمي',   nameEn:'Omar Al-Hashimi',   borrows:5, quota:5 },
  { id:4, nameAr:'خديجة السيد',   nameEn:'Khadija Al-Sayed',  borrows:1, quota:5 },
  { id:5, nameAr:'يوسف إبراهيم',  nameEn:'Yusuf Ibrahim',     borrows:4, quota:5 },
];

const BOOKS_LIST = [
  { id:1, titleAr:'مقدمة ابن خلدون', category:'تاريخ', color:'#8B4513', available:2, total:5 },
  { id:2, titleAr:'ألف ليلة وليلة',  category:'أدب',   color:'#1B3A6B', available:2, total:8 },
  { id:3, titleAr:'نهج البلاغة',     category:'فقه',   color:'#9A7A1A', available:5, total:6 },
  { id:4, titleAr:'ديوان المتنبي',   category:'شعر',   color:'#B8421A', available:1, total:3 },
  { id:5, titleAr:'دلائل الإعجاز',   category:'لغة',   color:'#1B5B6B', available:4, total:4 },
];

const STEPS = [
  { labelAr:'اختيار العضو', labelEn:'Select Member' },
  { labelAr:'اختيار الكتاب', labelEn:'Select Book'   },
  { labelAr:'تحديد الموعد',  labelEn:'Set Due Date'  },
];

function MiniCalendar({ selectedDate, onSelect }: { selectedDate:string|null; onSelect:(d:string)=>void }) {
  const today = new Date();
  const [month,setMonth] = useState(today.getMonth());
  const [year,setYear]   = useState(today.getFullYear());
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const days = Array.from({length:firstDay},()=>null).concat(Array.from({length:daysInMonth},(_,i)=>i+1));
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  const isToday = (d:number) => d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
  const isPast  = (d:number) => new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const makeDate= (d:number) => `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const sealPath = (cx:number,cy:number,r:number) => {
    const pts:string[]=[];
    for(let i=0;i<24;i++){const j=1+0.06*Math.sin(i*2.9+0.7);const a=(i*2*Math.PI)/24;pts.push(`${(cx+r*j*Math.cos(a)).toFixed(1)},${(cy+r*j*Math.sin(a)).toFixed(1)}`);}
    return `M${pts.join(' L')} Z`;
  };

  return (
    <div style={{ background:'white', border:`1.5px solid ${COLORS.goldLight}`, borderRadius:'14px', overflow:'hidden', boxShadow:'0 4px 16px rgba(27,58,107,0.1)' }}>
      {/* Month nav */}
      <div style={{ background:`linear-gradient(135deg,${COLORS.darkLapis},${COLORS.lapis})`, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}} style={{ background:'transparent', border:'none', color:COLORS.gold, cursor:'pointer', fontSize:'18px' }}>‹</button>
        <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.gold, fontWeight:700 }}>
          {months[month]} {year}
        </div>
        <button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}} style={{ background:'transparent', border:'none', color:COLORS.gold, cursor:'pointer', fontSize:'18px' }}>›</button>
      </div>
      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'8px 8px 0' }}>
        {['أح','إث','ث','أر','خ','ج','س'].map(d=>(
          <div key={d} style={{ textAlign:'center', fontFamily:'Amiri,serif', fontSize:'11px', color:COLORS.goldLight, padding:'4px' }}>{d}</div>
        ))}
      </div>
      {/* Days */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'4px 8px 12px', gap:'2px' }}>
        {days.map((d,i)=>{
          if(!d) return <div key={`e${i}`}/>;
          const dateStr = makeDate(d);
          const isSel   = dateStr===selectedDate;
          const past    = isPast(d);
          return (
            <button key={i} onClick={()=>!past&&onSelect(dateStr)} disabled={past}
              style={{ position:'relative', padding:'6px 2px', borderRadius:'8px', border:'none', cursor:past?'not-allowed':'pointer', background:'transparent', opacity:past?0.35:1, transition:'all 0.15s ease' }}>
              {isSel ? <>
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 36 36">
                  <path d={sealPath(18,18,15)} fill={COLORS.gold}/>
                </svg>
                <span style={{ position:'relative', fontFamily:'Amiri,serif', fontSize:'13px', color:'white', fontWeight:700 }}>{d}</span>
              </> : <>
                {isToday(d) && <div style={{ position:'absolute', bottom:'3px', left:'50%', transform:'translateX(-50%)', width:'4px', height:'4px', borderRadius:'50%', background:COLORS.gold }}/>}
                <span style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis }}>{d}</span>
              </>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RecordBorrowScreen() {
  const [step,setStep]     = useState(0);
  const [member,setMember] = useState<typeof MEMBERS_LIST[0]|null>(null);
  const [book,setBook]     = useState<typeof BOOKS_LIST[0]|null>(null);
  const [dueDate,setDue]   = useState<string|null>(null);
  const [search,setSearch] = useState('');
  const [done,setDone]     = useState(false);

  const memberFiltered = MEMBERS_LIST.filter(m=>m.nameAr.includes(search)||m.nameEn.toLowerCase().includes(search.toLowerCase()));
  const bookFiltered   = BOOKS_LIST.filter(b=>b.titleAr.includes(search)||b.category.includes(search));

  const handleConfirm = () => { setDone(true); setTimeout(()=>{setStep(0);setMember(null);setBook(null);setDue(null);setDone(false);},2000); };

  if (done) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:'20px', animation:'fade-in-up 0.4s ease' }}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',damping:12,stiffness:200}}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {(() => {const pts:string[]=[];for(let i=0;i<28;i++){const j=1+0.055*Math.sin(i*2.9+0.7)+0.03*Math.cos(i*7.1+1.3);const a=(i*2*Math.PI)/28;pts.push(`${(50+46*j*Math.cos(a)).toFixed(1)},${(50+46*j*Math.sin(a)).toFixed(1)}`);} return <path d={`M${pts.join(' L')} Z`} fill={COLORS.sealGreen}/>;})()}
          <path d="M30,50 L43,63 L70,38" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
      <div style={{ fontFamily:'Amiri,serif', fontSize:'28px', color:COLORS.sealGreen, fontWeight:700 }}>تمت العملية بنجاح!</div>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'14px', color:'#717182' }}>Borrow recorded successfully</div>
    </div>
  );

  return (
    <div style={{ animation:'fade-in-up 0.4s ease', maxWidth:'800px' }}>
      <ArabesqueHeader titleAr="تسجيل إعارة" titleEn="Record New Borrow"/>
      <StepIndicator steps={STEPS} current={step}/>

      {/* ── Step 1: Member Selection ── */}
      {step===0 && (
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.darkLapis, marginBottom:'16px' }}>اختر العضو · Select Member</div>
          <div style={{ marginBottom:'16px' }}>
            <SearchInput placeholder="ابحث باسم العضو…" value={search} onChange={setSearch}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'12px' }}>
            {memberFiltered.map(m=>(
              <div key={m.id} onClick={()=>{setMember(m);setSearch('');setStep(1);}}
                style={{ background:'white', border:`1.5px solid ${member?.id===m.id?COLORS.gold:COLORS.goldLight}`, borderRadius:'12px', padding:'16px', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px', boxShadow:member?.id===m.id?`0 4px 16px ${COLORS.goldGlow}`:'none', transition:'all 0.2s ease' }}>
                <MemberAvatar nameAr={m.nameAr} size={44}/>
                <div>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{m.nameAr}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{m.nameEn}</div>
                  <div style={{ marginTop:'4px', display:'flex', gap:'6px' }}>
                    <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:COLORS.lapis }}>{m.borrows}/{m.quota}</span>
                    <span style={{ fontSize:'10px', color:'#717182', fontFamily:'Inter,sans-serif' }}>borrows</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Step 2: Book Selection ── */}
      {step===1 && (
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
            <MemberAvatar nameAr={member!.nameAr} size={36}/>
            <div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{member!.nameAr}</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{member!.nameEn}</div>
            </div>
            <button onClick={()=>{setStep(0);setMember(null);}} style={{ marginLeft:'auto', background:'transparent', border:`1px solid ${COLORS.goldLight}`, borderRadius:'6px', padding:'4px 10px', fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.lapis, cursor:'pointer' }}>تغيير</button>
          </div>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.darkLapis, marginBottom:'16px' }}>اختر الكتاب · Select Book</div>
          <div style={{ marginBottom:'16px' }}>
            <SearchInput placeholder="ابحث في الكتب…" value={search} onChange={setSearch}/>
          </div>
          {/* Spine view */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', padding:'20px', background:'white', border:`1px solid ${COLORS.goldLight}`, borderRadius:'12px', position:'relative' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'8px', background:`linear-gradient(180deg,${COLORS.terracotta}70,${COLORS.terracotta}50)`, borderRadius:'0 0 12px 12px' }}/>
            {bookFiltered.map(b=>(
              <div key={b.id} onClick={()=>{setBook(b);setSearch('');setStep(2);}}
                style={{ outline: book?.id===b.id?`2px solid ${COLORS.gold}`:'2px solid transparent', borderRadius:'4px', cursor:'pointer', transition:'all 0.15s ease', opacity:b.available===0?0.45:1 }}>
                <BookSpine titleAr={b.titleAr} category={b.category} color={b.color}/>
                <div style={{ textAlign:'center', marginTop:'4px', fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:b.available>0?COLORS.sealGreen:COLORS.bloodRed }}>
                  {b.available}/{b.total}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Step 3: Date + Summary ── */}
      {step===2 && (
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
            <div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.darkLapis, marginBottom:'16px' }}>تحديد موعد الإعادة</div>
              <MiniCalendar selectedDate={dueDate} onSelect={setDue}/>
            </div>
            {/* Summary */}
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div style={{ background:COLORS.parchment, border:`1px solid ${COLORS.goldLight}`, borderRadius:'12px', padding:'20px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${COLORS.gold},transparent)` }}/>
                <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.darkLapis, fontWeight:700, marginBottom:'14px' }}>ملخص الإعارة</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <MemberAvatar nameAr={member!.nameAr} size={36}/>
                    <div>
                      <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis, fontWeight:700 }}>{member!.nameAr}</div>
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{member!.nameEn}</div>
                    </div>
                  </div>
                  <div style={{ height:'1px', background:COLORS.goldLight }}/>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <BookSpine titleAr={book!.titleAr} category={book!.category} color={book!.color}/>
                    <div>
                      <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis, fontWeight:700 }}>{book!.titleAr}</div>
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{book!.category}</div>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:COLORS.sealGreen, marginTop:'4px' }}>
                        {book!.available} → {book!.available-1} متاح
                      </div>
                    </div>
                  </div>
                  {dueDate && <>
                    <div style={{ height:'1px', background:COLORS.goldLight }}/>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:'#717182' }}>موعد الإعادة</span>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'13px', color:COLORS.darkLapis, fontWeight:600 }}>{dueDate}</span>
                    </div>
                  </>}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <WaxSealButton onClick={dueDate?handleConfirm:undefined} variant="lapis">
                  تأكيد الإعارة
                </WaxSealButton>
                <button onClick={()=>setStep(1)} style={{ background:'transparent', border:`1px solid ${COLORS.goldLight}`, borderRadius:'8px', padding:'10px', fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, cursor:'pointer' }}>
                  ← تغيير الكتاب
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
