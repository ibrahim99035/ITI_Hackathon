import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { COLORS, ArabesqueHeader, SearchInput, MemberAvatar, RoleBadge, StatusStamp, StarDivider, GoldButton } from '../components/nebras/index';

const MEMBERS = [
  { id:1, nameAr:'أحمد القرشي',    nameEn:'Ahmed Al-Qurashi',   role:'admin'     as const, borrows:3, returned:12, fine:0,    joinDate:'2023-01-15', activeBooks:['مقدمة ابن خلدون','ألف ليلة وليلة','كليلة ودمنة'] },
  { id:2, nameAr:'فاطمة الزهراء',  nameEn:'Fatima Al-Zahra',    role:'librarian' as const, borrows:2, returned:8,  fine:15.5, joinDate:'2023-03-22', activeBooks:['نهج البلاغة','رسالة الغفران'] },
  { id:3, nameAr:'عمر الهاشمي',    nameEn:'Omar Al-Hashimi',    role:'librarian' as const, borrows:5, returned:20, fine:0,    joinDate:'2022-11-08', activeBooks:['ديوان المتنبي','دلائل الإعجاز','قصص الأنبياء','تاريخ الطبري','الكامل'] },
  { id:4, nameAr:'خديجة السيد',    nameEn:'Khadija Al-Sayed',   role:'guest'     as const, borrows:1, returned:3,  fine:7.5,  joinDate:'2024-02-10', activeBooks:['كليلة ودمنة'] },
  { id:5, nameAr:'يوسف إبراهيم',   nameEn:'Yusuf Ibrahim',      role:'guest'     as const, borrows:4, returned:9,  fine:0,    joinDate:'2023-07-19', activeBooks:['الفتوحات المكية','ابن بطوطة رحلة','ألف ليلة','مقامات الحريري'] },
  { id:6, nameAr:'سارة النجار',    nameEn:'Sara Al-Najjar',     role:'guest'     as const, borrows:2, returned:5,  fine:22,   joinDate:'2024-05-03', activeBooks:['نهج البلاغة','شعر العرب'] },
];

const HISTORY_ITEMS = [
  { book:'مقدمة ابن خلدون', borrowed:'2026-05-01', returned:'2026-05-20', days:19, fine:0 },
  { book:'ألف ليلة وليلة',  borrowed:'2026-04-10', returned:'2026-04-28', days:18, fine:0 },
  { book:'كليلة ودمنة',     borrowed:'2026-03-05', returned:'2026-04-02', days:28, fine:18 },
];

function MemberPanel({ member, onClose }: { member:typeof MEMBERS[0]; onClose:()=>void }) {
  const [tab,setTab] = useState<'history'|'fines'>('history');
  return (
    <motion.div initial={{x:360,opacity:0}} animate={{x:0,opacity:1}} exit={{x:360,opacity:0}} transition={{type:'spring',damping:28,stiffness:280}}
      style={{ position:'fixed', right:0, top:60, bottom:0, width:'360px', background:'white', borderLeft:`2px solid ${COLORS.goldLight}`, boxShadow:'-8px 0 32px rgba(27,58,107,0.12)', zIndex:500, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'20px 20px 0', background:COLORS.parchment, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${COLORS.gold},${COLORS.goldLight},transparent)` }}/>
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'16px' }}>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#717182', display:'flex', alignItems:'center', gap:'4px', fontFamily:'Inter,sans-serif', fontSize:'13px' }}>
            <X size={16}/> إغلاق
          </button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', paddingBottom:'20px' }}>
          <MemberAvatar nameAr={member.nameAr} size={64}/>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Amiri,serif', fontSize:'20px', color:COLORS.darkLapis, fontWeight:700 }}>{member.nameAr}</div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>{member.nameEn}</div>
            <div style={{ marginTop:'6px' }}><RoleBadge role={member.role}/></div>
          </div>
          <div style={{ display:'flex', gap:'16px', marginTop:'8px' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'20px', color:COLORS.lapis, fontWeight:600 }}>{member.borrows}</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'11px', color:'#717182' }}>نشط</div>
            </div>
            <div style={{ width:'1px', background:COLORS.goldLight }}/>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'20px', color:COLORS.sealGreen, fontWeight:600 }}>{member.returned}</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'11px', color:'#717182' }}>مُعاد</div>
            </div>
            <div style={{ width:'1px', background:COLORS.goldLight }}/>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'20px', color:member.fine>0?COLORS.bloodRed:COLORS.sealGreen, fontWeight:600 }}>{member.fine}</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'11px', color:'#717182' }}>غرامة</div>
            </div>
          </div>
        </div>
        {/* Geometric tab strip */}
        <div style={{ display:'flex', borderTop:`1px solid ${COLORS.goldLight}` }}>
          {(['history','fines'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ flex:1, padding:'12px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Amiri,serif', fontSize:'14px', color:tab===t?COLORS.gold:COLORS.darkLapis, borderBottom:tab===t?`2.5px solid ${COLORS.gold}`:'2.5px solid transparent', transition:'all 0.2s ease' }}>
              {t==='history'?'سجل الإعارة':'الغرامات'}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
        {tab==='history' && <>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182', marginBottom:'12px' }}>Borrow History</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {HISTORY_ITEMS.map((h,i)=>(
              <div key={i} style={{ background:COLORS.parchment, border:`1px solid ${COLORS.goldLight}`, borderRadius:'10px', padding:'12px 14px' }}>
                <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{h.book}</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px' }}>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#717182' }}>{h.borrowed} → {h.returned}</span>
                  {h.fine>0 && <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:COLORS.bloodRed }}>{h.fine} ر.س</span>}
                </div>
              </div>
            ))}
            {/* Active borrows */}
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182', marginTop:'8px', marginBottom:'6px' }}>Active Borrows</div>
            {member.activeBooks.map((b,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', background:'white', border:`1px solid ${COLORS.goldLight}`, borderRadius:'8px', borderLeft:`3px solid ${COLORS.lapis}` }}>
                <StatusStamp status="active" size={28}/>
                <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis }}>{b}</div>
              </div>
            ))}
          </div>
        </>}

        {tab==='fines' && <>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182', marginBottom:'12px' }}>Fine History</div>
          {member.fine>0 ? <>
            <div style={{ background:`${COLORS.bloodRed}12`, border:`1px solid ${COLORS.bloodRed}30`, borderRadius:'10px', padding:'16px', textAlign:'center', marginBottom:'16px' }}>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'32px', color:COLORS.bloodRed, fontWeight:600 }}>{member.fine}</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.terracotta }}>ريال سعودي — مستحق</div>
            </div>
            {/* Coin icons */}
            <div style={{ display:'flex', justifyContent:'center', gap:'6px', flexWrap:'wrap', marginBottom:'16px' }}>
              {Array.from({length:Math.min(Math.floor(member.fine),10)},(_,i)=>(
                <div key={i} style={{ width:'28px', height:'28px', borderRadius:'50%', background:`linear-gradient(135deg,${COLORS.gold},#B8960A)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}>ر</div>
              ))}
            </div>
            <GoldButton onClick={()=>{}} small>تسجيل الدفع</GoldButton>
          </> : <>
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <div style={{ fontSize:'36px', marginBottom:'12px' }}>✅</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'18px', color:COLORS.sealGreen }}>لا توجد غرامات</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>No outstanding fines</div>
            </div>
          </>}
        </>}
      </div>
    </motion.div>
  );
}

export function MembersScreen() {
  const [search,setSearch]           = useState('');
  const [selectedMember,setSelected] = useState<typeof MEMBERS[0]|null>(null);

  const filtered = MEMBERS.filter(m =>
    m.nameAr.includes(search)||m.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation:'fade-in-up 0.4s ease' }}>
      <ArabesqueHeader titleAr="الأعضاء" titleEn="Members Management"/>

      <div style={{ display:'flex', gap:'12px', marginBottom:'20px' }}>
        <div style={{ flex:1 }}>
          <SearchInput placeholder="ابحث في الأعضاء… Search members…" value={search} onChange={setSearch}/>
        </div>
        <GoldButton><span>+ إضافة عضو</span></GoldButton>
      </div>

      {/* Members Table */}
      <div style={{ background:'white', borderRadius:'14px', border:`1px solid ${COLORS.goldLight}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:COLORS.sage }}>
              {['العضو · Member','الدور','إعارات نشطة','إعارات مُعادة','الغرامات','الانضمام',''].map((h,i)=>(
                <th key={i} style={{ padding:'13px 16px', textAlign:'right', fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.darkLapis, fontWeight:700, borderBottom:`1px solid ${COLORS.goldLight}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m,i)=>(
              <motion.tr key={m.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                onClick={()=>setSelected(m===selectedMember?null:m)}
                style={{ borderBottom:`1px solid ${COLORS.goldLight}25`, background:selectedMember?.id===m.id?`${COLORS.gold}10`:i%2===0?'white':`${COLORS.parchment}50`, cursor:'pointer', transition:'background 0.15s ease' }}
                onMouseEnter={e=>{if(selectedMember?.id!==m.id)(e.currentTarget as HTMLElement).style.background=`${COLORS.gold}08`}}
                onMouseLeave={e=>{if(selectedMember?.id!==m.id)(e.currentTarget as HTMLElement).style.background=i%2===0?'white':`${COLORS.parchment}50`}}>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <MemberAvatar nameAr={m.nameAr} size={40}/>
                    <div>
                      <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{m.nameAr}</div>
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{m.nameEn}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'14px 16px' }}><RoleBadge role={m.role}/></td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:`${COLORS.lapis}15`, border:`1px solid ${COLORS.lapis}30`, borderRadius:'20px', padding:'3px 10px', fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:COLORS.lapis, fontWeight:600 }}>
                    {m.borrows}
                  </span>
                </td>
                <td style={{ padding:'14px 16px', fontFamily:'JetBrains Mono,monospace', fontSize:'13px', color:COLORS.sealGreen, fontWeight:500 }}>{m.returned}</td>
                <td style={{ padding:'14px 16px' }}>
                  {m.fine>0 ? (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:`${COLORS.terracotta}15`, border:`1px solid ${COLORS.terracotta}40`, borderRadius:'20px', padding:'3px 10px', fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:COLORS.terracotta, fontWeight:600 }}>
                      {m.fine} ر.س
                    </span>
                  ) : <span style={{ color:COLORS.sealGreen, fontFamily:'Amiri,serif', fontSize:'13px' }}>لا شيء</span>}
                </td>
                <td style={{ padding:'14px 16px', fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:'#AAABB8' }}>{m.joinDate}</td>
                <td style={{ padding:'14px 16px' }}>
                  <ChevronRight size={16} color={selectedMember?.id===m.id?COLORS.gold:COLORS.goldLight} style={{ transition:'color 0.2s ease', transform:selectedMember?.id===m.id?'rotate(90deg)':'none' }}/>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-in member detail panel */}
      <AnimatePresence>
        {selectedMember && <MemberPanel member={selectedMember} onClose={()=>setSelected(null)}/>}
      </AnimatePresence>
    </div>
  );
}
