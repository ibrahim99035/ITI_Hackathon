import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, Users, BookMarked,
  ClipboardList, BarChart3, Settings, LogOut, Languages
} from 'lucide-react';
import { COLORS, ArabesquePattern, starPath, waxSealPath } from './components/nebras/index';
import { LoginScreen }         from './screens/LoginScreen';
import { DashboardScreen }     from './screens/DashboardScreen';
import { BookCatalogScreen }   from './screens/BookCatalogScreen';
import { MembersScreen }       from './screens/MembersScreen';
import { RecordBorrowScreen }  from './screens/RecordBorrowScreen';
import { ActiveBorrowsScreen } from './screens/ActiveBorrowsScreen';
import { ReportsScreen }       from './screens/ReportsScreen';
import { SettingsScreen }      from './screens/SettingsScreen';

type Screen = 'dashboard'|'catalog'|'members'|'record'|'borrows'|'reports'|'settings';

const NAV_ITEMS: { screen:Screen; labelAr:string; labelEn:string; Icon:React.FC<{size?:number;color?:string}> }[] = [
  { screen:'dashboard', labelAr:'لوحة التحكم',  labelEn:'Dashboard',     Icon:LayoutDashboard },
  { screen:'catalog',   labelAr:'كتالوج الكتب', labelEn:'Book Catalog',  Icon:BookOpen        },
  { screen:'members',   labelAr:'الأعضاء',       labelEn:'Members',       Icon:Users           },
  { screen:'record',    labelAr:'تسجيل إعارة',   labelEn:'Record Borrow', Icon:BookMarked      },
  { screen:'borrows',   labelAr:'الإعارات',       labelEn:'Active Borrows',Icon:ClipboardList   },
  { screen:'reports',   labelAr:'التقارير',       labelEn:'Reports',       Icon:BarChart3       },
  { screen:'settings',  labelAr:'الإعدادات',      labelEn:'Settings',      Icon:Settings        },
];

function NebrasLogo() {
  const seal = waxSealPath(22,22,19);
  const star  = starPath(22,22,9,3.5);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'20px 20px 16px' }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <path d={seal} fill={COLORS.gold} opacity="0.9"/>
        <circle cx="22" cy="22" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7"/>
        <path d={star} fill="rgba(255,255,255,0.9)"/>
      </svg>
      <div>
        <div style={{ fontFamily:'Amiri,serif', fontSize:'26px', color:COLORS.gold, fontWeight:700, lineHeight:0.9 }}>نبراس</div>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', color:`${COLORS.goldLight}90`, letterSpacing:'3px', marginTop:'4px' }}>NEBRAS LMS</div>
      </div>
    </div>
  );
}

function Sidebar({ current, onChange, isRTL, onLogout }: {
  current:Screen; onChange:(s:Screen)=>void; isRTL:boolean; onLogout:()=>void;
}) {
  return (
    <div style={{
      width:'240px', flexShrink:0,
      background:COLORS.darkLapis,
      display:'flex', flexDirection:'column',
      position:'relative', overflow:'hidden',
      [isRTL?'borderLeft':'borderRight']: `1px solid ${COLORS.gold}18`,
    }}>
      {/* Arabesque overlay */}
      <ArabesquePattern id="sidebar-arb" opacity={0.06}/>

      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,${COLORS.gold},${COLORS.goldLight},transparent)`, zIndex:1 }}/>

      {/* Logo */}
      <div style={{ position:'relative', zIndex:1, borderBottom:`1px solid ${COLORS.gold}18` }}>
        <NebrasLogo/>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'12px 0', position:'relative', zIndex:1, overflowY:'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = current===item.screen;
          return (
            <div key={item.screen}
              onClick={()=>onChange(item.screen)}
              style={{
                display:'flex', alignItems:'center', gap:'12px',
                padding:'13px 20px',
                cursor:'pointer',
                position:'relative',
                color: active ? COLORS.gold : 'rgba(255,255,255,0.65)',
                background: active ? `rgba(201,168,76,0.1)` : 'transparent',
                [isRTL?'borderRight':'borderLeft']: `3px solid ${active?COLORS.gold:'transparent'}`,
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.9)';(e.currentTarget as HTMLElement).style.background=`rgba(255,255,255,0.05)`;}}
              onMouseLeave={e=>{if(!active){(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.65)';(e.currentTarget as HTMLElement).style.background='transparent';}}}>
              {/* Active indicator glow */}
              {active && <div style={{ position:'absolute', [isRTL?'right':'left']:0, top:'20%', bottom:'20%', width:'3px', background:COLORS.gold, boxShadow:`0 0 8px ${COLORS.gold}` }}/>}
              <item.Icon size={18} color={active?COLORS.gold:'rgba(255,255,255,0.65)'}/>
              <div>
                <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', fontWeight:active?700:400 }}>{item.labelAr}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', opacity:0.6 }}>{item.labelEn}</div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div style={{ position:'relative', zIndex:1, borderTop:`1px solid ${COLORS.gold}18`, padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:`linear-gradient(135deg,${COLORS.gold},#B8960A)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:'white', fontWeight:700 }}>أ</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.gold, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>أحمد القرشي</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'9px', color:`${COLORS.goldLight}70` }}>Administrator</div>
        </div>
        <button onClick={onLogout}
          style={{ background:'transparent', border:'none', cursor:'pointer', color:`${COLORS.goldLight}70`, padding:'4px', display:'flex', alignItems:'center' }}
          title="Logout">
          <LogOut size={15}/>
        </button>
      </div>
    </div>
  );
}

function TopBar({ screen, isRTL, onToggleRTL }: { screen:Screen; isRTL:boolean; onToggleRTL:()=>void }) {
  const item = NAV_ITEMS.find(n=>n.screen===screen)!;
  const today = new Date().toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  return (
    <div style={{
      height:'60px', flexShrink:0,
      background:'white',
      borderBottom:`1px solid ${COLORS.goldLight}`,
      display:'flex', alignItems:'center',
      padding:'0 24px', gap:'16px',
      boxShadow:'0 1px 8px rgba(27,58,107,0.06)',
    }}>
      {/* Page title */}
      <div style={{ flex:1, display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'2px', height:'28px', background:`linear-gradient(180deg,${COLORS.gold},transparent)`, borderRadius:'2px' }}/>
        <div>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'20px', color:COLORS.darkLapis, fontWeight:700, lineHeight:1 }}>{item.labelAr}</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{item.labelEn}</div>
        </div>
      </div>

      {/* Date */}
      <div style={{ fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.goldLight, display:'none', ['@media (min-width:1200px)' as any]:{ display:'block' } }}>
        {today}
      </div>

      {/* AR / EN toggle */}
      <button onClick={onToggleRTL}
        style={{
          display:'flex', alignItems:'center', gap:'6px',
          background:isRTL?COLORS.darkLapis:`${COLORS.gold}15`,
          border:`1.5px solid ${isRTL?COLORS.gold:COLORS.goldLight}`,
          borderRadius:'20px', padding:'6px 14px', cursor:'pointer',
          transition:'all 0.25s ease',
        }}>
        <Languages size={14} color={isRTL?COLORS.gold:COLORS.lapis}/>
        <span style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:isRTL?COLORS.gold:COLORS.lapis, fontWeight:600 }}>
          {isRTL?'AR · EN':'EN · AR'}
        </span>
      </button>

      {/* Notification bell */}
      <div style={{ position:'relative', cursor:'pointer' }}>
        <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:COLORS.parchment, border:`1px solid ${COLORS.goldLight}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>
          🔔
        </div>
        <div style={{ position:'absolute', top:'-2px', right:'-2px', width:'10px', height:'10px', borderRadius:'50%', background:COLORS.bloodRed, border:'2px solid white' }}/>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [screen,setScreen]     = useState<Screen>('dashboard');
  const [isRTL,setIsRTL]       = useState(true);

  if (!loggedIn) return <LoginScreen onLogin={()=>setLoggedIn(true)}/>;

  const SCREEN_MAP: Record<Screen,React.ReactNode> = {
    dashboard: <DashboardScreen/>,
    catalog:   <BookCatalogScreen/>,
    members:   <MembersScreen/>,
    record:    <RecordBorrowScreen/>,
    borrows:   <ActiveBorrowsScreen/>,
    reports:   <ReportsScreen/>,
    settings:  <SettingsScreen/>,
  };

  return (
    <div
      dir={isRTL?'rtl':'ltr'}
      style={{
        display:'flex', height:'100vh', overflow:'hidden',
        fontFamily:'Inter,sans-serif',
        background:COLORS.parchment,
        direction:isRTL?'rtl':'ltr',
        flexDirection: isRTL ? 'row-reverse' : 'row',
      }}>
      <Sidebar current={screen} onChange={setScreen} isRTL={isRTL} onLogout={()=>setLoggedIn(false)}/>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <TopBar screen={screen} isRTL={isRTL} onToggleRTL={()=>setIsRTL(r=>!r)}/>

        {/* Scroll area */}
        <div style={{ flex:1, overflowY:'auto', padding:'28px', background:COLORS.parchment, position:'relative' }}>
          {/* Subtle parchment arabesque bg */}
          <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
            <ArabesquePattern id="content-arb" color={COLORS.lapis} opacity={0.018}/>
          </div>

          {/* Screen content */}
          <div style={{ position:'relative', zIndex:1, maxWidth:'1280px', margin:'0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div key={screen}
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.28, ease:'easeOut' }}>
                {SCREEN_MAP[screen]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
