import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, List, Plus, AlertTriangle } from 'lucide-react';
import { COLORS, BookCard, ArabesqueHeader, SearchInput, GoldButton, GhostButton, GlassModal, StatusStamp, StarDivider, CATEGORY_COLORS, GoldInput } from '../components/nebras/index';

const BOOKS = [
  { id:1, titleAr:'مقدمة ابن خلدون', titleEn:'Muqaddimah', author:'Ibn Khaldun', category:'تاريخ', copies:5, borrowed:3 },
  { id:2, titleAr:'ألف ليلة وليلة',  titleEn:'One Thousand and One Nights', author:'Anonymous', category:'أدب', copies:8, borrowed:6 },
  { id:3, titleAr:'كليلة ودمنة',     titleEn:'Kalila and Dimna', author:'Ibn al-Muqaffa', category:'أدب', copies:4, borrowed:4 },
  { id:4, titleAr:'نهج البلاغة',     titleEn:'Peak of Eloquence', author:'Ali ibn Abi Talib', category:'فقه', copies:6, borrowed:1 },
  { id:5, titleAr:'ديوان المتنبي',   titleEn:'Diwan al-Mutanabbi', author:'Al-Mutanabbi', category:'شعر', copies:3, borrowed:2 },
  { id:6, titleAr:'رسالة الغفران',   titleEn:'Epistle of Forgiveness', author:'Abu al-Ala al-Maarri', category:'أدب', copies:2, borrowed:1 },
  { id:7, titleAr:'دلائل الإعجاز',   titleEn:'Signs of Inimitability', author:'Abd al-Qahir al-Jurjani', category:'لغة', copies:4, borrowed:0 },
  { id:8, titleAr:'قصص الأنبياء',    titleEn:'Stories of the Prophets', author:'Ibn Kathir', category:'فقه', copies:7, borrowed:2 },
];

interface BookForm { titleAr:string; titleEn:string; author:string; category:string; copies:number; isbn:string }
const EMPTY_FORM: BookForm = { titleAr:'', titleEn:'', author:'', category:'تاريخ', copies:1, isbn:'' };

export function BookCatalogScreen() {
  const [view,setView]           = useState<'grid'|'table'>('grid');
  const [search,setSearch]       = useState('');
  const [filterCat,setFilterCat] = useState('all');
  const [books,setBooks]         = useState(BOOKS);
  const [editBook,setEditBook]   = useState<typeof BOOKS[0]|null>(null);
  const [showAdd,setShowAdd]     = useState(false);
  const [form,setForm]           = useState<BookForm>(EMPTY_FORM);
  const [avFilter,setAvFilter]   = useState<'all'|'available'|'unavailable'>('all');

  const cats = ['all','تاريخ','أدب','علوم','فلسفة','شعر','فقه','لغة'];
  const filtered = books.filter(b => {
    const matchQ = b.titleAr.includes(search)||b.titleEn.toLowerCase().includes(search.toLowerCase())||b.author.toLowerCase().includes(search.toLowerCase());
    const matchC = filterCat==='all'||b.category===filterCat;
    const avail  = b.copies-b.borrowed;
    const matchA = avFilter==='all'||(avFilter==='available'&&avail>0)||(avFilter==='unavailable'&&avail===0);
    return matchQ&&matchC&&matchA;
  });

  const openEdit = (b: typeof BOOKS[0]) => {
    setEditBook(b);
    setForm({ titleAr:b.titleAr, titleEn:b.titleEn, author:b.author, category:b.category, copies:b.copies, isbn:'' });
    setShowAdd(true);
  };
  const openAdd = () => { setEditBook(null); setForm(EMPTY_FORM); setShowAdd(true); };

  const CATEGORIES = ['تاريخ','أدب','علوم','فلسفة','شعر','فقه','لغة'];

  return (
    <div style={{ animation:'fade-in-up 0.4s ease' }}>
      <ArabesqueHeader titleAr="كتالوج الكتب" titleEn="Book Catalog"
        action={<GoldButton onClick={openAdd}><Plus size={15}/> إضافة كتاب</GoldButton>}/>

      {/* ── Controls ── */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:'220px' }}>
          <SearchInput placeholder="ابحث في الكتالوج…  Search catalog…" value={search} onChange={setSearch}/>
        </div>

        {/* Category filter pills */}
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilterCat(c)}
              style={{ padding:'6px 12px', borderRadius:'20px', border:`1.5px solid ${filterCat===c?COLORS.gold:COLORS.goldLight}`, background:filterCat===c?COLORS.gold:'transparent', color:filterCat===c?'white':COLORS.darkLapis, fontFamily:'Amiri,serif', fontSize:'12px', cursor:'pointer', transition:'all 0.2s ease' }}>
              {c==='all'?'الكل':c}
            </button>
          ))}
        </div>

        {/* Availability pill toggle */}
        <div style={{ display:'flex', background:COLORS.sage, borderRadius:'8px', padding:'3px' }}>
          {(['all','available','unavailable'] as const).map(a=>(
            <button key={a} onClick={()=>setAvFilter(a)}
              style={{ padding:'5px 12px', borderRadius:'6px', border:'none', background:avFilter===a?'white':'transparent', color:avFilter===a?COLORS.darkLapis:'#717182', fontFamily:'Inter,sans-serif', fontSize:'11px', cursor:'pointer', transition:'all 0.2s ease', boxShadow:avFilter===a?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>
              {a==='all'?'All':a==='available'?'Available':'Unavailable'}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display:'flex', gap:'4px', border:`1px solid ${COLORS.goldLight}`, borderRadius:'8px', padding:'3px', background:'white' }}>
          <button onClick={()=>setView('grid')} style={{ padding:'6px 10px', borderRadius:'6px', border:'none', background:view==='grid'?COLORS.gold:'transparent', color:view==='grid'?'white':COLORS.goldLight, cursor:'pointer', display:'flex', alignItems:'center', transition:'all 0.2s' }}><LayoutGrid size={15}/></button>
          <button onClick={()=>setView('table')} style={{ padding:'6px 10px', borderRadius:'6px', border:'none', background:view==='table'?COLORS.gold:'transparent', color:view==='table'?'white':COLORS.goldLight, cursor:'pointer', display:'flex', alignItems:'center', transition:'all 0.2s' }}><List size={15}/></button>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.goldLight, marginBottom:'16px' }}>
        {filtered.length} كتاب · {filtered.length} books
      </div>

      <AnimatePresence mode="wait">
        {/* ── Grid View ── */}
        {view==='grid' && (
          <motion.div key="grid" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
            {filtered.map((b,i)=>(
              <motion.div key={b.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                <BookCard
                  titleAr={b.titleAr} titleEn={b.titleEn} author={b.author}
                  category={b.category} categoryColor={CATEGORY_COLORS[b.category]||COLORS.gold}
                  copies={b.copies} borrowed={b.borrowed}
                  onEdit={()=>openEdit(b)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Table View ── */}
        {view==='table' && (
          <motion.div key="table" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ background:'white', borderRadius:'14px', border:`1px solid ${COLORS.goldLight}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:COLORS.sage }}>
                  {['#','العنوان · Title','المؤلف','الفئة','النسخ','المتاح','الحالة',''].map((h,i)=>(
                    <th key={i} style={{ padding:'12px 16px', textAlign:'right', fontFamily:'Amiri,serif', fontSize:'12px', color:COLORS.darkLapis, fontWeight:700, borderBottom:`1px solid ${COLORS.goldLight}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b,i)=>{
                  const avail=b.copies-b.borrowed;
                  const catColor=CATEGORY_COLORS[b.category]||COLORS.gold;
                  const status = avail===0?'overdue':avail/b.copies<0.4?'active':'returned';
                  return (
                    <motion.tr key={b.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                      style={{ borderBottom:`1px solid ${COLORS.goldLight}30`, borderLeft:`3px solid ${catColor}`, background:i%2===0?'white':COLORS.parchment+'50', transition:'background 0.15s ease' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=`${COLORS.gold}08`}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?'white':`${COLORS.parchment}50`}>
                      <td style={{ padding:'12px 16px', fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:COLORS.goldLight }}>{i+1}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ fontFamily:'Amiri,serif', fontSize:'14px', color:COLORS.darkLapis, fontWeight:700 }}>{b.titleAr}</div>
                        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#717182' }}>{b.titleEn}</div>
                      </td>
                      <td style={{ padding:'12px 16px', fontFamily:'Inter,sans-serif', fontSize:'12px', color:COLORS.terracotta }}>{b.author}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-block', background:`${catColor}20`, border:`1px solid ${catColor}50`, borderRadius:'4px', padding:'2px 8px', fontFamily:'Amiri,serif', fontSize:'11px', color:catColor }}>
                          {b.category}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px', fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:COLORS.darkLapis, textAlign:'center' }}>{b.copies}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'JetBrains Mono,monospace', fontSize:'12px', color:avail>0?COLORS.sealGreen:COLORS.bloodRed, textAlign:'center' }}>{avail}</td>
                      <td style={{ padding:'12px 16px' }}><StatusStamp status={status} size={36}/></td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={()=>openEdit(b)} style={{ background:'transparent', border:`1px solid ${COLORS.goldLight}`, borderRadius:'6px', padding:'4px 12px', fontFamily:'Inter,sans-serif', fontSize:'11px', color:COLORS.lapis, cursor:'pointer' }}>
                          تعديل
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add/Edit Book Modal ── */}
      <GlassModal open={showAdd} onClose={()=>setShowAdd(false)} title={editBook?'Edit Book':'Add New Book'} titleAr={editBook?'تعديل الكتاب':'إضافة كتاب جديد'} width={580}>
        <div style={{ color:'white' }}>
          {/* 2-col form */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 24px', marginBottom:'20px' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <GoldInput dark label="Title (Arabic)" labelAr="العنوان عربي" value={form.titleAr} onChange={v=>setForm(f=>({...f,titleAr:v}))}/>
            </div>
            <GoldInput dark label="Title (English)" labelAr="العنوان إنجليزي" value={form.titleEn} onChange={v=>setForm(f=>({...f,titleEn:v}))}/>
            <GoldInput dark label="Author" labelAr="المؤلف" value={form.author} onChange={v=>setForm(f=>({...f,author:v}))}/>
            <GoldInput dark label="ISBN" labelAr="الرقم الدولي" value={form.isbn} onChange={v=>setForm(f=>({...f,isbn:v}))} placeholder="978-..."/>
            <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
              <label style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:COLORS.goldLight }}>
                <span style={{ fontFamily:'Amiri,serif' }}>الفئة</span> · Category
              </label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                style={{ border:'none', borderBottom:`1.8px solid ${COLORS.gold}50`, background:'transparent', padding:'8px 2px', fontFamily:'Amiri,serif', fontSize:'14px', color:'white', outline:'none', width:'100%' }}>
                {CATEGORIES.map(c=><option key={c} value={c} style={{ background:COLORS.darkLapis }}>{c}</option>)}
              </select>
            </div>
          </div>

          <StarDivider label="عدد النسخ"/>

          {/* Copy count stepper */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'16px 0' }}>
            <div style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:COLORS.goldLight }}>عدد النسخ المتاحة · Number of Copies</div>
            <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
              <button onClick={()=>setForm(f=>({...f,copies:Math.max(0,f.copies-1)}))}
                style={{ width:'38px', height:'38px', borderRadius:'50%', background:'transparent', border:`1.5px solid ${COLORS.gold}`, color:COLORS.gold, cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease' }}>
                −
              </button>
              <span style={{ fontFamily:'Amiri,serif', fontSize:'52px', color:'white', minWidth:'64px', textAlign:'center', lineHeight:1 }}>
                {form.copies}
              </span>
              <button onClick={()=>setForm(f=>({...f,copies:f.copies+1}))}
                style={{ width:'38px', height:'38px', borderRadius:'50%', background:COLORS.gold, border:'none', color:'white', cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease' }}>
                +
              </button>
            </div>
            {form.copies < (editBook?.borrowed||0) && (
              <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(201,130,0,0.15)', border:'1px solid rgba(201,130,0,0.4)', borderRadius:'8px', padding:'8px 14px' }}>
                <AlertTriangle size={14} color="#C98200"/>
                <span style={{ fontFamily:'Amiri,serif', fontSize:'13px', color:'#C98200' }}>عدد النسخ أقل من المُعارة</span>
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'8px' }}>
            <GhostButton onClick={()=>setShowAdd(false)}>إلغاء</GhostButton>
            <GoldButton onClick={()=>setShowAdd(false)}>
              {editBook ? '💾 حفظ التعديلات' : '✚ إضافة الكتاب'}
            </GoldButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
