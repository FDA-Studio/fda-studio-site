from playwright.sync_api import sync_playwright
B='http://localhost:4321'
out=[]
def ok(name,cond,info=''): out.append(('OK ' if cond else 'ÉCHEC ')+name+(' — '+str(info) if info else ''))
with sync_playwright() as p:
  b=p.chromium.launch()
  # desktop: gate + Expertises
  pg=b.new_page(viewport={'width':1440,'height':900}); pg.goto(B+'/',wait_until='load')
  pg.get_by_role('button',name='Entrer sans le son').wait_for(state='visible',timeout=60000)
  pg.wait_for_function("()=>!document.querySelector('.gate button').disabled",timeout=90000)
  pg.get_by_role('button',name='Entrer sans le son').click(); pg.wait_for_timeout(1500)
  y0=pg.evaluate('scrollY'); pg.get_by_role('navigation',name='Navigation principale').get_by_role('link',name='Expertises').click(); pg.wait_for_timeout(3000)
  y1=pg.evaluate('scrollY'); ok('Expertises fait défiler jusqu’à la scène des sites (bureau)',y1>y0+300,f'{y0}→{y1}')
  pg.get_by_role('navigation',name='Navigation principale').get_by_role('link',name='Démos IA').click(); pg.wait_for_timeout(2500)
  top=pg.evaluate("document.getElementById('creations').getBoundingClientRect().top"); ok('Démos IA amène à la section démos',abs(top)<150,top)
  pg.get_by_role('link',name='Démarrer un projet').first.click(); pg.wait_for_timeout(2500)
  top=pg.evaluate("document.getElementById('contact').getBoundingClientRect().top"); ok('Démarrer un projet amène au formulaire',abs(top)<200,top)
  # form validation without sending
  sent=[]; pg.on('request',lambda r: sent.append(r.url) if 'api/public/leads' in r.url else None)
  btn=pg.locator('#contact button[type=submit]'); btn.click(); pg.wait_for_timeout(800)
  errs=pg.locator('#contact [role=alert], #contact .text-red-400, #contact [aria-invalid=true]').count()
  ok('Formulaire vide : erreurs affichées, rien envoyé',errs>0 and not sent,f'{errs} erreurs, envois={len(sent)}')
  # keyboard focus visible
  pg.goto(B+'/a-propos/'); pg.keyboard.press('Tab'); f=pg.evaluate("document.activeElement.innerText"); ok('Tab : lien « Aller au contenu » en premier',f.strip()=='Aller au contenu',f)
  vis=pg.evaluate("(()=>{const r=document.activeElement.getBoundingClientRect();return r.width>40&&r.top>=0})()"); ok('« Aller au contenu » visible au focus',vis)
  pg.keyboard.press('Tab'); oc=pg.evaluate("getComputedStyle(document.activeElement).outlineStyle+' '+getComputedStyle(document.activeElement).outlineWidth"); ok('Focus visible sur le lien suivant',not oc.startswith('none'),oc)
  pg.close()
  # from another page: /#expertises
  pg=b.new_page(viewport={'width':1440,'height':900}); pg.goto(B+'/gaming/'); pg.get_by_role('navigation',name='Navigation principale').get_by_role('link',name='Expertises').click(); pg.wait_for_load_state('load')
  ok('Expertises depuis /gaming/ ramène à l’accueil',pg.url.endswith('/#expertises'),pg.url)
  pg.wait_for_function("()=>!document.querySelector('.gate button').disabled",timeout=90000)
  pg.get_by_role('button',name='Entrer sans le son').click(); pg.wait_for_timeout(3500); ok('…puis vole jusqu’à la scène des sites après l’entrée',pg.evaluate('scrollY')>300,pg.evaluate('scrollY'))
  pg.close()
  # mobile menu
  ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); pg=ctx.new_page(); pg.goto(B+'/a-propos/')
  pg.get_by_role('button',name='Ouvrir le menu').tap(); pg.wait_for_timeout(600)
  ok('Menu mobile s’ouvre',pg.locator('#menu-mobile').is_visible())
  pg.keyboard.press('Escape'); pg.wait_for_timeout(600); ok('Échap ferme le menu',not pg.locator('#menu-mobile').is_visible())
  pg.get_by_role('button',name='Ouvrir le menu').tap(); pg.wait_for_timeout(600)
  pg.get_by_role('navigation',name='Navigation mobile').get_by_role('link',name='Gaming').tap(); pg.wait_for_load_state('load'); pg.wait_for_timeout(800)
  ok('Menu mobile → Gaming',pg.url.endswith('/gaming/'),pg.url)
  pg.get_by_role('link',name='FDA Studio, accueil').tap(); pg.wait_for_load_state('load'); ok('Logo → accueil',pg.url.rstrip('/')==B,pg.url)
  # footer details
  pg.goto(B+'/a-propos/'); pg.locator('footer summary').tap(); pg.wait_for_timeout(300)
  ok('Pied de page « Toutes les pages » s’ouvre',pg.evaluate("document.querySelector('footer details').open"))
  h=pg.evaluate("Math.round(document.querySelector('footer details a').getBoundingClientRect().height)"); ok('Liens du pied de page ≥ 24 px',h>=24,h)
  h=pg.evaluate("Math.round(document.querySelector('nav[aria-label=\"Fil d’Ariane\"] a').getBoundingClientRect().height)"); ok('Fil d’Ariane ≥ 24 px',h>=24,h)
  b.close()
print('\n'.join(out))
