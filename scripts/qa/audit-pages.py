import json, os, sys, re
from playwright.sync_api import sync_playwright
BASE='http://localhost:4321'
pages=[l.strip() for l in open(os.environ.get('PAGES','/tmp/pages.txt')) if l.strip() and l.strip() not in ('/404/','/_not-found/')]
VPS={'mobile':dict(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True),
     'tablette':dict(viewport={'width':820,'height':1180},device_scale_factor=2,is_mobile=True,has_touch=True),
     'desktop':dict(viewport={'width':1440,'height':900})}
proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
res={}
JS=r"""()=>{
 const q=(s)=>[...document.querySelectorAll(s)];
 const vis=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none'};
 const over=q('body *').filter(e=>{const r=e.getBoundingClientRect();return vis(e)&&r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'}).slice(0,8).map(e=>e.tagName+'.'+(e.className&&e.className.baseVal===undefined?String(e.className).slice(0,60):'')+' '+Math.round(e.getBoundingClientRect().right));
 const links=q('a[href]').map(a=>({href:a.getAttribute('href'),text:(a.innerText||a.getAttribute('aria-label')||a.title||'').trim().slice(0,60),target:a.target,rel:a.rel,vis:vis(a)}));
 const btns=q('button,[role=button]').filter(vis).map(b=>({name:(b.innerText||b.getAttribute('aria-label')||b.title||'').trim().slice(0,50),type:b.type||'',disabled:b.disabled}));
 const small=q('a[href],button').filter(vis).filter(e=>{const r=e.getBoundingClientRect();return (r.width<24||r.height<24)}).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,30)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)).slice(0,10);
 const m=n=>document.querySelector(`meta[name="${n}"]`)?.content||null; const p=n=>document.querySelector(`meta[property="${n}"]`)?.content||null;
 return {sw:document.documentElement.scrollWidth,iw:innerWidth,over,links,btns,small,
  title:document.title,desc:m('description'),robots:m('robots'),canon:document.querySelector('link[rel=canonical]')?.href||null,ogimg:p('og:image'),
  h1:q('h1').map(h=>h.innerText.replace(/\s+/g,' ').trim()),h2:q('h2').length,
  imgNoAlt:q('img').filter(i=>!i.hasAttribute('alt')).map(i=>i.src.slice(-60)),
  ids:q('[id]').map(e=>e.id), lang:document.documentElement.lang,
  inputsNoLabel:q('input,select,textarea').filter(i=>i.type!=='hidden'&&!i.labels?.length&&!i.getAttribute('aria-label')&&!i.getAttribute('aria-labelledby')).map(i=>i.name||i.id||i.type),
  jsonld:q('script[type="application/ld+json"]').map(s=>{try{JSON.parse(s.textContent);return 'ok'}catch(e){return 'INVALID'}})}
}"""
with sync_playwright() as pw:
  b=pw.chromium.launch(proxy={'server':proxy,'bypass':'localhost,127.0.0.1'} if proxy else None)
  for vp,opts in VPS.items():
    ctx=b.new_context(**opts)
    for path in pages:
      pg=ctx.new_page(); errs=[]; fails=[]
      pg.on('console',lambda m: errs.append(m.text[:200]) if m.type=='error' else None)
      pg.on('pageerror',lambda e: errs.append('PAGEERROR '+str(e)[:200]))
      pg.on('requestfailed',lambda r: fails.append(r.url[:120]+' '+(r.failure or '')))
      pg.on('response',lambda r: fails.append(f'{r.status} {r.url[:120]}') if r.status>=400 else None)
      try:
        resp=pg.goto(BASE+path,wait_until='load',timeout=45000); pg.wait_for_timeout(1500)
        # scroll to bottom to trigger lazy stuff
        pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(800)
        d=pg.evaluate(JS); d['status']=resp.status if resp else None
      except Exception as e:
        d={'error':str(e)[:200]}
      d['console']=errs[:10]; d['fails']=fails[:10]
      res.setdefault(path,{})[vp]=d
      pg.close()
    ctx.close()
  b.close()
json.dump(res,open('audit.json','w'),ensure_ascii=False,indent=1)
print('ok',len(res))
