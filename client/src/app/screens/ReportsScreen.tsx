import { COLORS, StatCard, ArabesqueHeader, StarDivider, MemberAvatar, waxSealPath, starPath } from '../components/nebras/index';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORY_DATA = [
  { name:'تاريخ',  nameEn:'History',     value:89, color:'#8B4513' },
  { name:'أدب',    nameEn:'Literature',  value:67, color:'#1B3A6B' },
  { name:'علوم',   nameEn:'Science',     value:45, color:'#2D5A1B' },
  { name:'فلسفة',  nameEn:'Philosophy',  value:38, color:'#5B2C8A' },
  { name:'شعر',    nameEn:'Poetry',      value:31, color:'#B8421A' },
  { name:'فقه',    nameEn:'Jurisprudence',value:27,color:'#9A7A1A' },
  { name:'لغة',    nameEn:'Language',    value:22, color:'#1B5B6B' },
];

const TOP_BORROWERS = [
  { nameAr:'عمر الهاشمي',   nameEn:'Omar Al-Hashimi',   count:25, rank:1 },
  { nameAr:'أحمد القرشي',   nameEn:'Ahmed Al-Qurashi',  count:18, rank:2 },
  { nameAr:'يوسف إبراهيم',  nameEn:'Yusuf Ibrahim',     count:13, rank:3 },
  { nameAr:'فاطمة الزهراء', nameEn:'Fatima Al-Zahra',   count:10, rank:4 },
  { nameAr:'سارة النجار',   nameEn:'Sara Al-Najjar',    count:7,  rank:5 },
];

function CoinStack({ amount }: { amount: number }) {
  const coins = Math.min(8, Math.ceil(amount/200));
  return (
    <div style={{ position:'relative', width:'60px', height:`${20+coins*10}px` }}>
      {Array.from({length:coins},(_,i)=>(
        <div key={i} style={{ position:'absolute', bottom:`${i*10}px`, left:0, right:0 }}>
          <svg width="60" height="20" viewBox="0 0 60 20">
            <ellipse cx="30" cy="10" rx="28" ry="9" fill={`hsl(${45+i*3},65%,${45+i*3}%)`}/>
            <ellipse cx="30" cy="7" rx="28" ry="9" fill={`hsl(${42+i*3},70%,${50+i*2}%)`}/>
            <ellipse cx="30" cy="4" rx="26" ry="7" fill={`hsl(${45+i*3},72%,${55+i*2}%)`} opacity="0.7"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

function LaurelIcon({ rank }: { rank:number }) {
  if (rank !== 1) return null;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <path d={waxSealPath(16,16,14)} fill={COLORS.gold} opacity="0.9"/>
      <text x="16" y="21" textAnchor="middle" fontSize="14" fill="white" fontFamily="Amiri,serif" fontWeight="700">١</text>
    </svg>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active||!payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:COLORS.darkLapis, border:`1px solid ${COLORS.gold}50`, borderRadius:'8px', padding:'10px 14px' }}>
      <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.gold }}>{d.name}</div>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:COLORS.goldLight }}>{d.nameEn}</div>
      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'14px', color:'white', marginTop:'4px' }}>{d.value} borrows</div>
    </div>
  );
}

export function ReportsScreen() {
  return (
    <div style={{ animation:'fade-in-up 0.4s ease' }}>
      <ArabesqueHeader titleAr="التقارير والإحصاءات" titleEn="Reports & Analytics"
        action={
          <button style={{ display:'flex', alignItems:'center', gap:'8px', background:'transparent', border:`1.5px solid ${COLORS.goldLight}`, borderRadius:'8px', padding:'9px 16px', fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.lapis, cursor:'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="10" width="14" height="4" rx="1" fill={COLORS.goldLight}/><path d="M4,1 L4,8 M8,3 L8,8 M12,5 L12,8" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"/></svg>
            تصدير CSV
          </button>
        }/>

      {/* ── KPI Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'32px' }}>
        <StatCard labelAr="إجمالي الإعارات" labelEn="Total Borrows"      value={319} max={500} color={COLORS.gold}/>
        <StatCard labelAr="الإعارات النشطة"  labelEn="Active Borrows"    value={43}  max={100} color={COLORS.lapis}/>
        <StatCard labelAr="معدل الإعادة"     labelEn="Return Rate"       value={94}  max={100} unit="%" color={COLORS.sealGreen}/>
        <StatCard labelAr="غرامات الشهر"     labelEn="Monthly Fines"     value={1250}max={5000} unit="ر.س" color={COLORS.terracotta}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
        {/* ── Donut Chart ── */}
        <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}`, boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'18px', color:COLORS.darkLapis, fontWeight:700 }}>الإعارات حسب الفئة</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182', marginBottom:'16px' }}>Borrows by Category</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry,i)=>(
                  <Cell key={i} fill={entry.color} stroke={COLORS.goldLight} strokeWidth={1}/>
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px' }}>
            {CATEGORY_DATA.map(d=>(
              <span key={d.name} style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontFamily:'Amiri,serif', fontSize:'11px', color:'#717182' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'2px', background:d.color, display:'inline-block', flexShrink:0 }}/>
                {d.name}
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:COLORS.darkLapis }}>{d.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Top Borrowers Leaderboard ── */}
        <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}`, boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'18px', color:COLORS.darkLapis, fontWeight:700 }}>أكثر الأعضاء إعارة</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182', marginBottom:'16px' }}>Top Borrowers</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {TOP_BORROWERS.map((m,i)=>(
              <div key={m.rank} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', background:m.rank===1?`${COLORS.gold}10`:COLORS.parchment, border:`1px solid ${m.rank===1?COLORS.gold:COLORS.goldLight}`, borderRadius:'10px', position:'relative', overflow:'hidden' }}>
                {m.rank===1 && <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,${COLORS.gold},transparent)` }}/>}
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'13px', color:m.rank===1?COLORS.gold:m.rank===2?COLORS.goldLight:'#AAABB8', fontWeight:600, minWidth:'20px' }}>
                  {m.rank===1?'🏆':m.rank===2?'🥈':m.rank===3?'🥉':m.rank}
                </div>
                <MemberAvatar nameAr={m.nameAr} size={36} color={m.rank===1?COLORS.gold:m.rank===2?COLORS.goldLight:COLORS.lapis}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:m.rank===1?700:400 }}>{m.nameAr}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{m.nameEn}</div>
                </div>
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'18px', color:m.rank===1?COLORS.gold:COLORS.darkLapis, fontWeight:600 }}>{m.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StarDivider label="المالية"/>

      {/* ── Fine Summary ── */}
      <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:`1px solid ${COLORS.goldLight}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <div style={{ fontFamily:'Amiri,serif', fontSize:'18px', color:COLORS.darkLapis, fontWeight:700 }}>إجمالي الغرامات المحصّلة</div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#717182' }}>Total Fines Collected — June 2026</div>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'24px' }}>
            <CoinStack amount={1250}/>
            <div>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'40px', color:COLORS.gold, fontWeight:600, lineHeight:1 }}>1,250</div>
              <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:COLORS.goldLight }}>ريال سعودي</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 24px' }}>
            {[
              { label:'هذا الأسبوع',  labelEn:'This Week',  val:'320', color:COLORS.lapis     },
              { label:'الشهر الماضي', labelEn:'Last Month', val:'980', color:COLORS.terracotta },
              { label:'حالة الدفع',  labelEn:'Pending',    val:'75',  color:COLORS.bloodRed   },
              { label:'معدل التحصيل',labelEn:'Collection', val:'94%', color:COLORS.sealGreen  },
            ].map(s=>(
              <div key={s.label}>
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'18px', color:s.color, fontWeight:600 }}>{s.val}</div>
                <div style={{ fontFamily:'Amiri,serif', fontSize:'11px', color:COLORS.darkLapis }}>{s.label}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', color:'#717182' }}>{s.labelEn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
