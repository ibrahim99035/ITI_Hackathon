import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS, ArabesqueHeader, StatusStamp, MemberAvatar, WaxSealButton, FineMeter, GlassModal, StarDivider } from '../components/nebras/index';

const BORROWS = [
  { id:1, memberAr:'عمر الهاشمي',   memberEn:'Omar Al-Hashimi',   bookAr:'مقدمة ابن خلدون', dueDate:'2026-05-30', borrowedDate:'2026-05-16', overdueDays:10, fine:25,   status:'overdue'  as const },
  { id:2, memberAr:'خديجة السيد',   memberEn:'Khadija Al-Sayed',  bookAr:'كليلة ودمنة',     dueDate:'2026-06-01', borrowedDate:'2026-05-18', overdueDays:8,  fine:20,   status:'overdue'  as const },
  { id:3, memberAr:'أحمد القرشي',   memberEn:'Ahmed Al-Qurashi',  bookAr:'ألف ليلة وليلة',  dueDate:'2026-06-15', borrowedDate:'2026-06-01', overdueDays:0,  fine:0,    status:'active'   as const },
  { id:4, memberAr:'فاطمة الزهراء', memberEn:'Fatima Al-Zahra',   bookAr:'نهج البلاغة',     dueDate:'2026-06-20', borrowedDate:'2026-06-06', overdueDays:0,  fine:0,    status:'active'   as const },
  { id:5, memberAr:'يوسف إبراهيم',  memberEn:'Yusuf Ibrahim',     bookAr:'ديوان المتنبي',   dueDate:'2026-06-12', borrowedDate:'2026-05-29', overdueDays:0,  fine:0,    status:'active'   as const },
  { id:6, memberAr:'سارة النجار',   memberEn:'Sara Al-Najjar',    bookAr:'الفتوحات المكية', dueDate:'2026-06-05', borrowedDate:'2026-05-22', overdueDays:4,  fine:10,   status:'overdue'  as const },
];

export function ActiveBorrowsScreen() {
  const [expanded,setExpanded]     = useState<number|null>(null);
  const [fineModal,setFineModal]   = useState<typeof BORROWS[0]|null>(null);
  const [returned,setReturned]     = useState<number[]>([]);
  const [filter,setFilter]         = useState<'all'|'overdue'|'active'>('all');

  const visible = BORROWS.filter(b => {
    if (returned.includes(b.id)) return false;
    if (filter==='overdue') return b.status==='overdue';
    if (filter==='active')  return b.status==='active';
    return true;
  });

  const handleReturn = (b: typeof BORROWS[0]) => {
    if (b.fine > 0) { setFineModal(b); return; }
    setReturned(r=>[...r,b.id]);
    setExpanded(null);
  };

  const handleFinePaid = () => {
    if (fineModal) { setReturned(r=>[...r,fineModal.id]); setFineModal(null); setExpanded(null); }
  };

  const totalOverdue = visible.filter(b=>b.status==='overdue').length;
  const totalFines   = visible.reduce((s,b)=>s+b.fine,0);

  return (
    <div style={{ animation:'fade-in-up 0.4s ease' }}>
      <ArabesqueHeader titleAr="الإعارات النشطة" titleEn="Active Borrows"/>

      {/* Summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'24px' }}>
        {[
          { label:'إجمالي الإعارات', labelEn:'Total Active',  val:visible.length,   color:COLORS.lapis    },
          { label:'متأخرة',          labelEn:'Overdue',       val:totalOverdue,      color:COLORS.bloodRed },
          { label:'غرامات معلقة',    labelEn:'Pending Fines', val:`${totalFines} ر.س`, color:COLORS.terracotta },
        ].map((s,i)=>(
          <div key={i} style={{ background:'white', border:`1px solid ${COLORS.goldLight}`, borderRadius:'10px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'22px', color:s.color, fontWeight:600 }}>{s.val}</div>
            <div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis }}>{s.label}</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', color:'#717182' }}>{s.labelEn}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {(['all','overdue','active'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:'7px 16px', borderRadius:'20px', border:`1.5px solid ${filter===f?(f==='overdue'?COLORS.bloodRed:COLORS.gold):COLORS.goldLight}`, background:filter===f?(f==='overdue'?COLORS.bloodRed:COLORS.gold):'transparent', color:filter===f?'white':COLORS.darkLapis, fontFamily:'Amiri,serif', fontSize:'13px', cursor:'pointer', transition:'all 0.2s ease' }}>
            {f==='all'?'الكل':f==='overdue'?'المتأخرة ⚠️':'النشطة'}
          </button>
        ))}
      </div>

      {/* Borrows table with expandable rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
        {visible.map((b,i)=>{
          const isOverdue = b.status==='overdue';
          const isExp     = expanded===b.id;
          const borrowedDays = Math.round((new Date().getTime()-new Date(b.borrowedDate).getTime())/(1000*60*60*24));
          return (
            <motion.div key={b.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
              {/* Row */}
              <div
                onClick={()=>setExpanded(isExp?null:b.id)}
                style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 16px', background:isOverdue?`${COLORS.bloodRed}08`:'white', border:`1px solid ${isOverdue?COLORS.bloodRed+'40':COLORS.goldLight}`, borderRadius:isExp?'12px 12px 0 0':'12px', cursor:'pointer', transition:'all 0.2s ease', borderLeft:`4px solid ${isOverdue?COLORS.bloodRed:COLORS.lapis}` }}>
                <MemberAvatar nameAr={b.memberAr} size={40} color={isOverdue?COLORS.bloodRed:COLORS.gold}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{b.memberAr}</span>
                    {isOverdue && <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:COLORS.bloodRed, background:`${COLORS.bloodRed}15`, border:`1px solid ${COLORS.bloodRed}30`, borderRadius:'4px', padding:'1px 6px' }}>+{b.overdueDays}d</span>}
                  </div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{b.memberEn}</div>
                </div>
                <div style={{ flex:1, minWidth:0, textAlign:'center' }}>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis }}>{b.bookAr}</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:'#717182' }}>موعد</div>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:isOverdue?COLORS.bloodRed:COLORS.darkLapis, fontWeight:600 }}>{b.dueDate}</div>
                </div>
                <StatusStamp status={b.status} size={42}/>
                <div style={{ color:COLORS.goldLight }}>
                  {isExp ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </div>
              </div>

              {/* Expanded fine preview */}
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.25}}
                    style={{ background:isOverdue?`${COLORS.bloodRed}05`:`${COLORS.lapis}05`, border:`1px solid ${isOverdue?COLORS.bloodRed+'30':COLORS.goldLight}`, borderTop:'none', borderRadius:'0 0 12px 12px', overflow:'hidden' }}>
                    <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'24px', flexWrap:'wrap' }}>
                      {isOverdue && <>
                        <div>
                          <div style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:'#717182', marginBottom:'6px' }}>معاينة الغرامة</div>
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                            {Array.from({length:Math.min(b.overdueDays,14)},(_,i)=>(
                              <div key={i} style={{ width:'26px', height:'26px', borderRadius:'50%', background:`linear-gradient(135deg,${COLORS.gold},#B8960A)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}>ر</div>
                            ))}
                            {b.overdueDays>14 && <span style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.terracotta }}>+{b.overdueDays-14}</span>}
                          </div>
                        </div>
                        <div style={{ fontFamily:'JetBrains Mono,monospace' }}>
                          <div style={{ fontSize:'11px', color:'#717182' }}>Fine Total</div>
                          <div style={{ fontSize:'24px', color:COLORS.bloodRed, fontWeight:600 }}>{b.fine} ر.س</div>
                        </div>
                      </>}
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>
                        Borrowed: <strong>{b.borrowedDate}</strong> · Days out: <strong style={{ fontFamily:'JetBrains Mono,monospace' }}>{borrowedDays}</strong>
                      </div>
                      <div style={{ marginLeft:'auto' }}>
                        <WaxSealButton onClick={()=>handleReturn(b)} variant={isOverdue?'red':'lapis'}>
                          {isOverdue ? 'إعادة مع غرامة' : 'تأكيد الإعادة'}
                        </WaxSealButton>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {visible.length===0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:COLORS.goldLight, fontFamily:'Amiri,serif', fontSize:'18px' }}>
          لا توجد إعارات مطابقة · No matching borrows
        </div>
      )}

      {/* Fine Modal */}
      <GlassModal open={!!fineModal} onClose={()=>setFineModal(null)} title="Confirm Return & Pay Fine" titleAr="تأكيد الإعادة ودفع الغرامة" width={480}>
        {fineModal && (
          <div style={{ color:'white', display:'flex', flexDirection:'column', alignItems:'center', gap:'24px' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.goldLight, marginBottom:'4px' }}>{fineModal.memberAr}</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:`${COLORS.gold}80` }}>{fineModal.bookAr}</div>
            </div>
            <FineMeter borrowedDays={Math.round((new Date().getTime()-new Date(fineModal.borrowedDate).getTime())/(1000*60*60*24))} overdueDays={fineModal.overdueDays} fineAmount={fineModal.fine}/>
            <StarDivider/>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={()=>setFineModal(null)} style={{ background:'rgba(255,255,255,0.07)', border:`1px solid ${COLORS.gold}30`, borderRadius:'8px', padding:'10px 20px', color:COLORS.goldLight, fontFamily:'Amiri,serif', fontSize:'15px', cursor:'pointer' }}>
                إلغاء
              </button>
              <WaxSealButton onClick={handleFinePaid} variant="gold">
                تأكيد الدفع والإعادة
              </WaxSealButton>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}
