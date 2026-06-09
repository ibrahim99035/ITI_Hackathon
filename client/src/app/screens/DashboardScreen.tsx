import { useState } from 'react';
import { motion } from 'motion/react';
import { COLORS, StatCard, BookSpine, ArabesqueHeader, StarDivider, MemberAvatar, waxSealPath } from '../components/nebras/index';

const SHELF_BOOKS = [
  { titleAr:'مقدمة ابن خلدون', category:'تاريخ', color:'#8B4513', count:23 },
  { titleAr:'ألف ليلة وليلة',  category:'أدب',   color:'#1B3A6B', count:19 },
  { titleAr:'كليلة ودمنة',     category:'أدب',   color:'#2D5A1B', count:15 },
  { titleAr:'نهج البلاغة',     category:'فقه',   color:'#9A7A1A', count:14 },
  { titleAr:'ديوان المتنبي',   category:'شعر',   color:'#B8421A', count:12 },
  { titleAr:'رسالة الغفران',   category:'أدب',   color:'#5B2C8A', count:11 },
  { titleAr:'الكامل في التاريخ',category:'تاريخ', color:'#8B4513', count:10 },
  { titleAr:'دلائل الإعجاز',   category:'لغة',   color:'#1B5B6B', count:8  },
  { titleAr:'قصص الأنبياء',    category:'فقه',   color:'#9A7A1A', count:7  },
  { titleAr:'الفتوحات المكية', category:'فلسفة', color:'#5B2C8A', count:6  },
];

const ACTIVITIES = [
  { time:'14:32', nameAr:'عمر الهاشمي',    icon:'borrow',   msg:'اقترض "مقدمة ابن خلدون"',           tag:'borrow',  color:COLORS.lapis     },
  { time:'12:15', nameAr:'فاطمة الزهراء',  icon:'return',   msg:'أعادت "ألف ليلة وليلة"',            tag:'return',  color:COLORS.sealGreen },
  { time:'11:00', nameAr:'النظام',          icon:'add',      msg:'أُضيف كتاب: "تاريخ الطبري"',       tag:'add',     color:COLORS.gold      },
  { time:'أمس',   nameAr:'خديجة السيد',    icon:'overdue',  msg:'متأخرة في إعادة "كليلة ودمنة"',     tag:'overdue', color:COLORS.bloodRed  },
  { time:'أمس',   nameAr:'سارة النجار',    icon:'fine',     msg:'دفعت غرامة 22 ر.س',                tag:'fine',    color:COLORS.terracotta},
];

function ActivityIcon({ tag, color }: { tag:string; color:string }) {
  const icons: Record<string,string> = {
    borrow:'📖', return:'✅', add:'➕', overdue:'⚠️', fine:'💰'
  };
  return (
    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:`${color}18`, border:`1.5px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0, animation:'ink-drop 0.4s ease' }}>
      {icons[tag]}
    </div>
  );
}

export function DashboardScreen() {
  const [hovStat,setHovStat] = useState<number|null>(null);

  return (
    <div style={{ animation:'fade-in-up 0.4s ease' }}>
      <ArabesqueHeader titleAr="لوحة التحكم" titleEn="Dashboard Overview"/>

      {/* ── KPI Astrolabe Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'16px', marginBottom:'32px' }}>
        {[
          { labelAr:'إجمالي الكتب',    labelEn:'Total Books',      value:342, max:500, color:COLORS.gold      },
          { labelAr:'الأعضاء',         labelEn:'Members',          value:87,  max:200, color:COLORS.lapis     },
          { labelAr:'إعارات نشطة',     labelEn:'Active Borrows',   value:43,  max:100, color:'#2D5A1B'       },
          { labelAr:'متأخرة',          labelEn:'Overdue',          value:7,   max:50,  color:COLORS.bloodRed  },
          { labelAr:'غرامات محصّلة',   labelEn:'Fines Collected',  value:1250,max:5000,color:COLORS.terracotta,unit:'ر.س' },
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,duration:0.5}}>
            <StatCard {...s}/>
          </motion.div>
        ))}
      </div>

      {/* ── Book Shelf + Activity ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'24px', marginBottom:'24px' }}>
        {/* Book Shelf */}
        <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}`, overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${COLORS.gold},${COLORS.goldLight},transparent)` }}/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'18px', color:COLORS.darkLapis, fontWeight:700 }}>الكتب الأكثر إعارة</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>Most Borrowed Books</div>
            </div>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:COLORS.goldLight }}>هذا الشهر</span>
          </div>
          {/* Shelf unit */}
          <div style={{ position:'relative', paddingBottom:'12px' }}>
            {/* Shelf board */}
            <div style={{ position:'absolute', bottom:0, left:'-8px', right:'-8px', height:'10px', background:`linear-gradient(180deg,${COLORS.terracotta}90,${COLORS.terracotta}60)`, borderRadius:'2px', boxShadow:'0 3px 8px rgba(0,0,0,0.2)' }}/>
            <div style={{ position:'absolute', bottom:'10px', left:'-8px', right:'-8px', height:'4px', background:`linear-gradient(180deg,${COLORS.gold}30,transparent)` }}/>
            {/* Books */}
            <div style={{ display:'flex', gap:'4px', alignItems:'flex-end', paddingBottom:'12px', overflowX:'auto', paddingTop:'4px' }}>
              {SHELF_BOOKS.map((b,i)=>(
                <motion.div key={i} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.06}}>
                  <BookSpine {...b} borrowCount={b.count}/>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Category legend */}
          <div style={{ marginTop:'16px', display:'flex', flexWrap:'wrap', gap:'8px' }}>
            {[['تاريخ','#8B4513'],['أدب','#1B3A6B'],['شعر','#B8421A'],['فقه','#9A7A1A'],['فلسفة','#5B2C8A'],['لغة','#1B5B6B'],['علوم','#2D5A1B']].map(([cat,col])=>(
              <span key={cat} style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontFamily:'Amiri,serif', fontSize:'11px', color:'#717182' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'2px', background:col, display:'inline-block' }}/>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${COLORS.gold},transparent)` }}/>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'18px', color:COLORS.darkLapis, fontWeight:700, marginBottom:'4px' }}>سجل النشاط</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182', marginBottom:'20px' }}>Recent Activity</div>
          <div style={{ position:'relative' }}>
            {/* Gold dashed vertical line */}
            <div style={{ position:'absolute', left:'15px', top:0, bottom:0, width:'1.5px', background:`repeating-linear-gradient(180deg,${COLORS.gold} 0px,${COLORS.gold} 5px,transparent 5px,transparent 10px)` }}/>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              {ACTIVITIES.map((a,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*0.1}}
                  style={{ display:'flex', gap:'12px', alignItems:'flex-start', paddingLeft:'0' }}>
                  <div style={{ position:'relative', zIndex:1, marginLeft:'-1px' }}>
                    <ActivityIcon tag={a.tag} color={a.color}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                      <span style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis, fontWeight:700 }}>{a.nameAr}</span>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#AAABB8' }}>{a.time}</span>
                    </div>
                    <div style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:'#717182', lineHeight:1.5 }}>{a.msg}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <StarDivider label="إحصاءات سريعة"/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
        {[
          { labelAr:'كتب مضافة اليوم', val:'3',  unit:'كتب',  color:COLORS.gold      },
          { labelAr:'إعارات جديدة',    val:'8',  unit:'اليوم', color:COLORS.lapis    },
          { labelAr:'متوسط أيام الإعارة',val:'14', unit:'يوم', color:'#5B2C8A'       },
          { labelAr:'معدل الإعادة',    val:'94', unit:'%',    color:COLORS.sealGreen },
        ].map((s,i)=>(
          <div key={i} style={{ background:'white', border:`1px solid ${COLORS.goldLight}`, borderRadius:'10px', padding:'16px', textAlign:'center' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'28px', color:s.color, fontWeight:600, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontFamily:'Amiri,serif', fontSize:'11px', color:COLORS.goldLight, margin:'2px 0' }}>{s.unit}</div>
            <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.darkLapis }}>{s.labelAr}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
