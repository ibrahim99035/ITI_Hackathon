import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Plus, X } from 'lucide-react';
import { COLORS, ArabesqueHeader, StarDivider, GoldButton, MemberAvatar, RoleBadge, starPath } from '../components/nebras/index';

const INITIAL_CATS = ['تاريخ','أدب','علوم','فلسفة','شعر','فقه','لغة','رياضيات','طب','اقتصاد'];
const CAT_COLORS: Record<string,string> = {
  'تاريخ':'#8B4513','أدب':'#1B3A6B','علوم':'#2D5A1B','فلسفة':'#5B2C8A','شعر':'#B8421A',
  'فقه':'#9A7A1A','لغة':'#1B5B6B','رياضيات':'#1B5B3A','طب':'#5B1B3A','اقتصاد':'#1B3A5B',
};

const USERS_LIST = [
  { id:1, nameAr:'أحمد القرشي',  nameEn:'Ahmed Al-Qurashi',  role:'admin'     as const, email:'ahmed@nebras.sa'   },
  { id:2, nameAr:'فاطمة الزهراء',nameEn:'Fatima Al-Zahra',   role:'librarian' as const, email:'fatima@nebras.sa'  },
  { id:3, nameAr:'عمر الهاشمي',  nameEn:'Omar Al-Hashimi',   role:'librarian' as const, email:'omar@nebras.sa'    },
  { id:4, nameAr:'خديجة السيد',  nameEn:'Khadija Al-Sayed',  role:'guest'     as const, email:'khadija@nebras.sa' },
  { id:5, nameAr:'يوسف إبراهيم', nameEn:'Yusuf Ibrahim',     role:'guest'     as const, email:'yusuf@nebras.sa'   },
  { id:6, nameAr:'سارة النجار',  nameEn:'Sara Al-Najjar',    role:'guest'     as const, email:'sara@nebras.sa'    },
];

function HexChip({ label, color, onDelete }: { label:string; color:string; onDelete:()=>void }) {
  const [hov,setHov] = useState(false);
  // Hexagon SVG clip
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:`${color}18`, border:`1.5px solid ${hov?color:`${color}60`}`, borderRadius:'8px', padding:'6px 12px', fontFamily:'Amiri,serif', fontSize:'13px', color:color, cursor:'default', transition:'all 0.2s ease', position:'relative' }}>
      <span style={{ width:'8px', height:'8px', borderRadius:'2px', background:color, flexShrink:0, display:'inline-block' }}/>
      {label}
      <button onClick={onDelete} style={{ background:'transparent', border:'none', cursor:'pointer', color:`${color}80`, padding:0, display:'flex', alignItems:'center', marginLeft:'2px' }}>
        <Flame size={12}/>
      </button>
    </div>
  );
}

export function SettingsScreen() {
  const [dailyRate,setDailyRate]   = useState(2.5);
  const [graceDays,setGraceDays]   = useState(3);
  const [maxDays,setMaxDays]       = useState(21);
  const [previewDays,setPreview]   = useState(5);
  const [cats,setCats]             = useState(INITIAL_CATS);
  const [newCat,setNewCat]         = useState('');
  const [addingCat,setAddingCat]   = useState(false);
  const [activeTab,setActiveTab]   = useState<'fines'|'categories'|'users'>('fines');

  const previewFine = Math.max(0,(previewDays-graceDays)*dailyRate);
  const star = starPath(12,12,8,3.5);

  return (
    <div style={{ animation:'fade-in-up 0.4s ease' }}>
      <ArabesqueHeader titleAr="الإعدادات" titleEn="System Settings"/>

      {/* Tab strip with geometric dividers */}
      <div style={{ display:'flex', background:'white', borderRadius:'12px', padding:'4px', border:`1px solid ${COLORS.goldLight}`, marginBottom:'24px', gap:'4px' }}>
        {([['fines','قواعد الغرامات','Fine Rules'],['categories','الفئات','Categories'],['users','المستخدمون','Users']] as const).map(([t,ar,en])=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{ flex:1, padding:'11px 16px', borderRadius:'9px', border:'none', background:activeTab===t?COLORS.darkLapis:'transparent', cursor:'pointer', transition:'all 0.2s ease', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
            <span style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:activeTab===t?COLORS.gold:COLORS.darkLapis, fontWeight:activeTab===t?700:400 }}>{ar}</span>
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', color:activeTab===t?COLORS.goldLight:'#717182' }}>{en}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Fine Rules ── */}
        {activeTab==='fines' && (
          <motion.div key="fines" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
              {/* Fine rules form */}
              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                {/* Daily rate */}
                <div style={{ background:'white', border:`1.5px solid ${COLORS.goldLight}`, borderRadius:'12px', padding:'20px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${COLORS.gold},transparent)` }}/>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700, marginBottom:'16px' }}>معدل الغرامة اليومية · Daily Rate</div>
                  {/* Gold-framed rate display */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', padding:'16px', background:COLORS.parchment, border:`1.5px solid ${COLORS.gold}`, borderRadius:'10px', marginBottom:'16px' }}>
                    <button onClick={()=>setDailyRate(r=>Math.max(0.5,+(r-0.5).toFixed(1)))}
                      style={{ width:'36px', height:'36px', borderRadius:'50%', background:'transparent', border:`1.5px solid ${COLORS.gold}`, color:COLORS.gold, cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'32px', color:COLORS.darkLapis, fontWeight:600, lineHeight:1 }}>{dailyRate}</div>
                      <div style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.goldLight }}>ريال / يوم</div>
                    </div>
                    <button onClick={()=>setDailyRate(r=>+(r+0.5).toFixed(1))}
                      style={{ width:'36px', height:'36px', borderRadius:'50%', background:COLORS.gold, border:'none', color:'white', cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                </div>

                {/* Grace period */}
                <div style={{ background:'white', border:`1.5px solid ${COLORS.goldLight}`, borderRadius:'12px', padding:'20px' }}>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700, marginBottom:'12px' }}>فترة السماح · Grace Period</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    {[0,1,2,3,5,7].map(d=>(
                      <button key={d} onClick={()=>setGraceDays(d)}
                        style={{ padding:'6px 14px', borderRadius:'8px', border:`1.5px solid ${graceDays===d?COLORS.gold:COLORS.goldLight}`, background:graceDays===d?COLORS.gold:'transparent', color:graceDays===d?'white':COLORS.darkLapis, fontFamily:'JetBrains Mono,monospace', fontSize:'13px', cursor:'pointer', transition:'all 0.2s ease' }}>
                        {d}
                      </button>
                    ))}
                    <span style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:'#717182' }}>أيام</span>
                  </div>
                </div>

                {/* Max borrow days */}
                <div style={{ background:'white', border:`1.5px solid ${COLORS.goldLight}`, borderRadius:'12px', padding:'20px' }}>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700, marginBottom:'12px' }}>أقصى مدة إعارة · Max Borrow Days</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    {[7,14,21,30].map(d=>(
                      <button key={d} onClick={()=>setMaxDays(d)}
                        style={{ padding:'6px 14px', borderRadius:'8px', border:`1.5px solid ${maxDays===d?COLORS.lapis:COLORS.goldLight}`, background:maxDays===d?COLORS.lapis:'transparent', color:maxDays===d?'white':COLORS.darkLapis, fontFamily:'JetBrains Mono,monospace', fontSize:'13px', cursor:'pointer', transition:'all 0.2s ease' }}>
                        {d}
                      </button>
                    ))}
                    <span style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:'#717182' }}>يوم</span>
                  </div>
                </div>
              </div>

              {/* Live preview */}
              <div style={{ background:COLORS.darkLapis, borderRadius:'14px', padding:'24px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, opacity:0.04 }}>
                  <svg style={{ width:'100%', height:'100%' }}>
                    <defs>
                      <pattern id="settings-arb" width="80" height="80" patternUnits="userSpaceOnUse">
                        {[[0,0],[40,0],[80,0],[0,40],[40,40],[80,40],[0,80],[40,80],[80,80]].map(([cx,cy],i)=><path key={i} d={starPath(cx,cy,17,7)} fill="none" stroke={COLORS.gold} strokeWidth="0.8"/>)}
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#settings-arb)"/>
                  </svg>
                </div>
                <div style={{ position:'relative' }}>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.gold, fontWeight:700, marginBottom:'4px' }}>معاينة حية</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:COLORS.goldLight, marginBottom:'20px' }}>Live Fine Preview</div>

                  <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'20px' }}>
                    <label style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:COLORS.goldLight }}>Simulate days overdue</label>
                    <input type="range" min="0" max="30" value={previewDays} onChange={e=>setPreview(+e.target.value)}
                      style={{ accentColor:COLORS.gold, width:'100%' }}/>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:COLORS.goldLight }}>{previewDays} days</span>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:COLORS.goldLight }}>{previewDays-graceDays>0?previewDays-graceDays:0} billed</span>
                    </div>
                  </div>

                  <div style={{ textAlign:'center', padding:'20px', background:'rgba(0,0,0,0.2)', borderRadius:'10px', border:`1px solid ${COLORS.gold}30` }}>
                    <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'48px', color:previewFine>0?COLORS.bloodRed:COLORS.gold, fontWeight:600, lineHeight:1 }}>
                      {previewFine.toFixed(1)}
                    </div>
                    <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.goldLight, marginTop:'8px' }}>
                      {previewFine===0?'في الوقت المحدد ✓':'ريال سعودي — مستحق'}
                    </div>
                  </div>

                  <div style={{ marginTop:'20px', display:'flex', flexDirection:'column', gap:'8px' }}>
                    {[['معدل الغرامة',`${dailyRate} ر.س/يوم`],['فترة السماح',`${graceDays} أيام`],['أقصى مدة',`${maxDays} يوم`]].map(([k,v])=>(
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${COLORS.gold}15`, paddingBottom:'6px' }}>
                        <span style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.goldLight }}>{k}</span>
                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:COLORS.gold }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop:'20px' }}>
                    <GoldButton small>حفظ الإعدادات</GoldButton>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Categories ── */}
        {activeTab==='categories' && (
          <motion.div key="cats" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}` }}>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.darkLapis, fontWeight:700, marginBottom:'8px' }}>فئات الكتب · Book Categories</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182', marginBottom:'20px' }}>Click the flame icon to remove a category</div>
              {/* Hexagon chip cloud */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'20px' }}>
                <AnimatePresence>
                  {cats.map(c=>(
                    <motion.div key={c} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}} layout>
                      <HexChip label={c} color={CAT_COLORS[c]||COLORS.lapis} onDelete={()=>setCats(cs=>cs.filter(x=>x!==c))}/>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add new category */}
                {addingCat ? (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', border:`1.5px solid ${COLORS.gold}`, borderRadius:'8px', padding:'4px 8px', background:`${COLORS.gold}10` }}>
                    <input autoFocus value={newCat} onChange={e=>setNewCat(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter'&&newCat.trim()){setCats(cs=>[...cs,newCat.trim()]);setNewCat('');setAddingCat(false);}if(e.key==='Escape'){setNewCat('');setAddingCat(false);}}}
                      placeholder="اسم الفئة…" maxLength={20}
                      style={{ border:'none', outline:'none', background:'transparent', fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis, width:'120px' }}/>
                    <button onClick={()=>{if(newCat.trim()){setCats(cs=>[...cs,newCat.trim()]);setNewCat('');setAddingCat(false);}}} style={{ background:COLORS.gold, border:'none', borderRadius:'4px', padding:'3px 8px', color:'white', cursor:'pointer', fontFamily:'Amiri,serif', fontSize:'12px' }}>+</button>
                    <button onClick={()=>{setNewCat('');setAddingCat(false);}} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#717182' }}><X size={14}/></button>
                  </div>
                ) : (
                  <button onClick={()=>setAddingCat(true)} style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'transparent', border:`1.5px dashed ${COLORS.goldLight}`, borderRadius:'8px', padding:'6px 12px', color:COLORS.goldLight, cursor:'pointer', fontFamily:'Amiri,serif', fontSize:'13px', transition:'all 0.2s ease' }}>
                    <Plus size={14}/> إضافة فئة
                  </button>
                )}
              </div>
              <StarDivider/>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>
                {cats.length} categories · Click + to add, 🔥 to remove
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Users ── */}
        {activeTab==='users' && (
          <motion.div key="users" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <div>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.darkLapis, fontWeight:700 }}>المستخدمون · System Users</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>{USERS_LIST.length} users registered</div>
                </div>
                <GoldButton small><Plus size={13}/> إضافة مستخدم</GoldButton>
              </div>
              {/* Avatar grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'12px' }}>
                {USERS_LIST.map(u=>(
                  <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:COLORS.parchment, border:`1px solid ${COLORS.goldLight}`, borderRadius:'10px', position:'relative', overflow:'hidden' }}>
                    {u.role==='admin' && <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,${COLORS.gold},transparent)` }}/>}
                    <MemberAvatar nameAr={u.nameAr} size={42} color={u.role==='admin'?COLORS.gold:u.role==='librarian'?COLORS.lapis:COLORS.goldLight}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{u.nameAr}</div>
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', color:'#717182', marginBottom:'4px' }}>{u.email}</div>
                      <RoleBadge role={u.role}/>
                    </div>
                    <button style={{ background:'transparent', border:`1px solid ${COLORS.goldLight}`, borderRadius:'6px', padding:'4px 8px', fontFamily:'Inter,sans-serif', fontSize:'11px', color:COLORS.lapis, cursor:'pointer' }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
