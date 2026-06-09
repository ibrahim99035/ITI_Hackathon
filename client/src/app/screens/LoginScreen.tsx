import { useState } from 'react';
import { motion } from 'motion/react';
import { COLORS, ArabesquePattern, GoldInput, starPath, waxSealPath } from '../components/nebras/index';

function RoseWindow() {
  const sp = (cx:number, cy:number, r:number) => starPath(cx,cy,r,r*0.4);
  const radialLines = Array.from({length:16},(_,i)=>{
    const a = (i*Math.PI*2)/16 - Math.PI/2;
    return { x1:300+380*Math.cos(a), y1:400+380*Math.sin(a), x2:300-380*Math.cos(a), y2:400-380*Math.sin(a) };
  });
  const secondaryStarAngles = Array.from({length:8},(_,i)=>(i*Math.PI*2)/8 - Math.PI/2);

  return (
    <svg viewBox="0 0 600 800" style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.16 }} aria-hidden>
      {/* Concentric rings */}
      {[60,130,200,270,340].map((r,i)=>(
        <circle key={r} cx="300" cy="400" r={r} fill="none" stroke={COLORS.gold} strokeWidth={0.6+i*0.1} opacity={0.9-i*0.12}/>
      ))}
      <circle cx="300" cy="400" r="400" fill="none" stroke={COLORS.gold} strokeWidth="0.4" opacity="0.3"/>
      {/* Radial spoke lines */}
      {radialLines.map((l,i)=>(
        <line key={i} x1={l.x1.toFixed(1)} y1={l.y1.toFixed(1)} x2={l.x2.toFixed(1)} y2={l.y2.toFixed(1)} stroke={COLORS.gold} strokeWidth="0.4" opacity="0.25"/>
      ))}
      {/* Nested 8-point stars */}
      {[55,120,195,270].map((r,i)=>(
        <path key={r} d={sp(300,400,r)} fill="none" stroke={COLORS.gold} strokeWidth={0.8-i*0.1} opacity={0.85-i*0.1}/>
      ))}
      {/* 8 secondary stars on the 200-ring */}
      {secondaryStarAngles.map((a,i)=>{
        const cx=300+200*Math.cos(a), cy=400+200*Math.sin(a);
        return <path key={i} d={sp(cx,cy,38)} fill="none" stroke={COLORS.gold} strokeWidth="0.6" opacity="0.65"/>;
      })}
      {/* 8 tertiary stars on 340-ring */}
      {secondaryStarAngles.map((a,i)=>{
        const cx=300+340*Math.cos(a), cy=400+340*Math.sin(a);
        return <path key={`t${i}`} d={sp(cx,cy,55)} fill="none" stroke={COLORS.gold} strokeWidth="0.5" opacity="0.45"/>;
      })}
      {/* Center jewel */}
      <path d={starPath(300,400,48,20,12)} fill="none" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.9"/>
      <circle cx="300" cy="400" r="15" fill="none" stroke={COLORS.gold} strokeWidth="1" opacity="0.8"/>
    </svg>
  );
}

export function LoginScreen({ onLogin }: { onLogin:()=>void }) {
  const [email,setEmail]       = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading]   = useState(false);
  const [error,setError]       = useState('');

  const handleSubmit = () => {
    if (!email || !password) { setError('يرجى تعبئة جميع الحقول'); return; }
    setLoading(true);
    setError('');
    setTimeout(()=>{ setLoading(false); onLogin(); }, 900);
  };

  const sealPath = waxSealPath(20,20,18);

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'Inter,sans-serif', overflow:'hidden' }}>
      {/* ── Left panel (60%) ── */}
      <div style={{ flex:'0 0 60%', background:COLORS.darkLapis, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <ArabesquePattern id="login-main-arb" opacity={0.07}/>
        <RoseWindow/>
        {/* Gradient fade at right edge */}
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'80px', background:`linear-gradient(90deg,transparent,${COLORS.darkLapis})` }}/>
        {/* Logo */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.8}}
          style={{ position:'relative', textAlign:'center', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', marginBottom:'20px' }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <path d={waxSealPath(22,22,20)} fill={COLORS.gold} opacity="0.9"/>
              <circle cx="22" cy="22" r="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
              <path d={starPath(22,22,9,3.5)} fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
          <h1 style={{ fontFamily:'Amiri,serif', fontSize:'72px', color:COLORS.gold, fontWeight:700, margin:0, lineHeight:0.9, letterSpacing:'2px' }}>
            نبراس
          </h1>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'15px', color:COLORS.goldLight, marginTop:'12px', letterSpacing:'6px' }}>
            N E B R A S
          </p>
          <div style={{ marginTop:'10px', fontFamily:'Amiri,serif', fontSize:'14px', color:`${COLORS.gold}90`, letterSpacing:'1px' }}>
            نظام إدارة المكتبة
          </div>
          <div style={{ fontSize:'12px', color:`${COLORS.goldLight}70`, marginTop:'4px', letterSpacing:'2px' }}>
            Library Management System
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7,duration:1}}
          style={{ position:'absolute', bottom:'40px', left:0, right:0, textAlign:'center' }}>
          <div style={{ fontFamily:'Amiri,serif', fontSize:'16px', color:`${COLORS.gold}60` }}>
            ﴿ اقرأ باسم ربك الذي خلق ﴾
          </div>
        </motion.div>
      </div>

      {/* ── Right panel (40%) ── */}
      <div style={{ flex:'0 0 40%', background:COLORS.parchment, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', position:'relative', overflow:'hidden' }}>
        {/* Subtle parchment arabesque */}
        <ArabesquePattern id="login-parch-arb" color={COLORS.lapis} opacity={0.025}/>
        <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:0.4,duration:0.7}}
          style={{ width:'100%', maxWidth:'380px', position:'relative' }}>
          {/* Card top accent */}
          <div style={{ height:'3px', background:`linear-gradient(90deg,${COLORS.gold},${COLORS.goldLight},transparent)`, borderRadius:'2px 2px 0 0', marginBottom:'0' }}/>
          <div style={{ background:'white', borderRadius:'0 0 16px 16px', padding:'36px 36px 32px', boxShadow:'0 8px 40px rgba(27,58,107,0.12)', border:`1px solid ${COLORS.goldLight}`, borderTop:'none' }}>
            <div style={{ marginBottom:'28px' }}>
              <h2 style={{ fontFamily:'Amiri,serif', fontSize:'28px', color:COLORS.darkLapis, fontWeight:700, margin:0 }}>
                أهلاً وسهلاً
              </h2>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'14px', color:'#717182', margin:'6px 0 0' }}>
                Welcome back · Sign in to continue
              </p>
            </div>

            {/* Form */}
            <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
              <GoldInput label="Email address" labelAr="البريد الإلكتروني" type="email" value={email} onChange={setEmail} placeholder="librarian@nebras.sa"/>
              <GoldInput label="Password" labelAr="كلمة المرور" type="password" value={password} onChange={setPassword} placeholder="••••••••"/>

              {error && (
                <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.bloodRed, padding:'8px 12px', background:'#8B000012', border:'1px solid #8B000030', borderRadius:'6px' }}>
                  {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                style={{ background:loading?`${COLORS.gold}80`:`linear-gradient(135deg,${COLORS.gold},#B8960A)`, border:'none', borderRadius:'10px', padding:'14px', color:'white', fontFamily:'Amiri,serif', fontSize:'17px', cursor:loading?'not-allowed':'pointer', position:'relative', overflow:'hidden', boxShadow:`0 4px 20px ${COLORS.goldGlow}`, transition:'all 0.3s ease', animation:loading?'':'stamp-press 0s' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', backgroundSize:'200% 100%', animation:'shimmer 2.5s infinite' }}/>
                <span style={{ position:'relative' }}>
                  {loading ? 'جارٍ الدخول...' : 'الدخول إلى المكتبة'}
                </span>
              </button>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'13px', color:'#717182' }}>
                  <input type="checkbox" style={{ accentColor:COLORS.gold }}/>
                  Remember me
                </label>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'13px', color:COLORS.lapis, cursor:'pointer', textDecoration:'underline', textDecorationColor:COLORS.goldLight }}>
                  Forgot password?
                </span>
              </div>
            </div>
          </div>

          {/* Version badge */}
          <div style={{ textAlign:'center', marginTop:'20px', fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:`${COLORS.lapis}60` }}>
            Maktaba Design System v1.0 · LMS-VIS-001
          </div>
        </motion.div>
      </div>
    </div>
  );
}
