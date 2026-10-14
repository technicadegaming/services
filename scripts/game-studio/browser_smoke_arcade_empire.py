#!/usr/bin/env python3
"""Local desktop and emulated mobile smoke test for Arcade Empire.

Uses an installed Edge browser and Playwright; never visits production.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = ROOT / '.game-studio-logs'
LOG_DIR.mkdir(exist_ok=True)
EDGE = Path(r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')
if not EDGE.exists():
    EDGE = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/arcade-empire.html'
try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=str(EDGE))
        for label, options in [('desktop', {'viewport':{'width':1366,'height':768}}),
                               ('mobile portrait emulation', {'viewport':{'width':390,'height':844},'is_mobile':True,'has_touch':True,'device_scale_factor':2}),
                               ('mobile landscape emulation', {'viewport':{'width':844,'height':390},'is_mobile':True,'has_touch':True,'device_scale_factor':2})]:
            context = browser.new_context(**options, reduced_motion='no-preference' if label == 'desktop' else 'reduce')
            page = context.new_page()
            failures = []
            page.on('pageerror', lambda err: failures.append(str(err)))
            page.on('console', lambda message: failures.append(message.text) if message.type == 'error' else None)
            page.on('response', lambda response: failures.append(f'HTTP {response.status}: {response.url}') if response.status >= 400 else None)
            response = page.goto(url, wait_until='load')
            assert response.status == 200, (label, response.status)
            assert page.locator('[data-plan="regular"]').get_attribute('aria-pressed') == 'true', 'regular hours are the default'
            assert page.locator('#floor .floor-cell').count() == 35, label
            assert page.locator('#floor .floor-cell[tabindex="0"]').count() == 1, 'floor must have one Tab stop'
            small_targets = page.evaluate("""() => [...document.querySelectorAll('button')].filter(b => !b.hidden && !b.disabled && b.getBoundingClientRect().width && b.getBoundingClientRect().height).map(b => ({id:b.id || b.textContent.trim().slice(0,25),height:Math.round(b.getBoundingClientRect().height),width:Math.round(b.getBoundingClientRect().width)})).filter(x => x.height < 44 || x.width < 44)""")
            assert not small_targets, f'{label}: undersized button targets {small_targets}'
            assert 'Repair your first cabinet' in page.locator('#objective').inner_text()
            page.locator('[data-repair="1"]').click()
            assert 'Position a cabinet' in page.locator('#objective').inner_text()
            assert page.locator('[data-cell="31"]').is_disabled(), 'entrance cannot be occupied'
            if label == 'desktop':
                page.locator('[data-select="1"]').focus()
                page.keyboard.press('Enter')
                page.locator('[data-cell="10"]').focus()
                page.keyboard.press('Enter')
                assert page.evaluate('document.activeElement.dataset.cell') == '10', 'selection should preserve floor focus'
                page.keyboard.press('ArrowLeft')
                assert page.evaluate('document.activeElement.dataset.cell') == '9', 'arrow keys should navigate floor'
                assert page.locator('#floor .floor-cell[tabindex="0"]').get_attribute('data-cell') == '9'
                page.keyboard.press('Tab')
                assert page.evaluate("document.activeElement.dataset.select === '1'"), 'Tab should leave the floor for cabinet controls'
                page.locator('[data-cell="0"]').focus()
                page.keyboard.press('Enter')
            else:
                page.locator('[data-select="1"]').tap()
                page.locator('[data-cell="0"]').tap()
            assert page.locator('[data-cell="0"]').get_attribute('aria-label').startswith('Cosmic Pinball')
            assert 'Earn your first customer sale' in page.locator('#objective').inner_text()
            page.locator('#open').click()
            assert 'sales' in page.locator('#dayReport').inner_text()
            assert 'Last 1 day:' in page.locator('#analyticsSummary').inner_text()
            assert 'Cosmic Pinball' in page.locator('#analyticsRows').inner_text()
            before = page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1'))")
            assert before['version'] == 2 and before['day'] == 2 and before['total'] > 0
            assert len(before['history']) == 1 and before['history'][0]['gross'] == before['lastDay']['gross']
            assert len(before['cashLedger']) == 2 and before['cashLedger'][-1]['balance'] == before['cash']
            assert 'Manual repair' in page.locator('#cashLedger').inner_text()
            assert 'Open day' in page.locator('#cashLedger').inner_text()
            if label == 'desktop':
                page.locator('.visitor').first.wait_for(timeout=2000)
                assert 0 < page.evaluate('visitors.length') <= 3, 'visible customer count must stay bounded'
                assert page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1')).cash") == before['cash'], 'animation must not post another sale'
                assert page.locator('#skipReplay').is_visible(), 'visitor preview can be finished'
                assert 'Daily results include every visitor' in page.locator('#floorActivity').inner_text()
                page.locator('#skipReplay').click()
                assert page.evaluate('animationTimer === null && visitors.length === 0'), 'finishing preview stops timer without changing sales'
                assert page.evaluate("document.activeElement.id === 'open'"), 'finishing preview moves keyboard focus to Open for a Day'
                assert page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1')).cash") == before['cash']
            else:
                assert page.locator('.visitor').count() == 0, 'reduced motion skips replay'
                assert page.locator('#skipReplay').is_hidden(), 'reduced motion has no replay control'
            with page.expect_download() as download_info:
                page.locator('#export').click()
            exported = Path(download_info.value.path()).read_bytes()
            assert b'"version": 2' in exported
            page.locator('[data-price="1"][data-delta="1"]').click()
            assert page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1')).owned[0].price") == 8
            assert page.evaluate("document.activeElement.dataset.price === '1' && document.activeElement.dataset.delta === '1'"), 'price control keeps focus after rerender'
            page.on('dialog', lambda dialog: dialog.accept())
            page.locator('#import').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':exported})
            assert page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1')).owned[0].price") == 7
            assert page.evaluate('animationTimer === null && visitors.length === 0'), 'import stops old replay'
            page.locator('#import').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{bad'})
            assert page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1')).owned[0].price") == 7
            page.locator('[data-service="1"]').click()
            assert page.locator('[data-service="1"]').get_attribute('aria-pressed') == 'true'
            page.reload(wait_until='load')
            after = page.evaluate("JSON.parse(localStorage.getItem('technicade_arcade_empire_v1'))")
            assert after['cash'] == before['cash'] and after['owned'][0]['pos'] == 0
            assert after['owned'][0]['autoService'] is True
            assert 'Last 1 day:' in page.locator('#analyticsSummary').inner_text(), 'history must render after reload'
            assert 'Manual repair' in page.locator('#cashLedger').inner_text(), 'cash activity survives save import and reload'
            page.locator('[data-plan="care"]').click()
            assert page.locator('[data-plan="care"]').get_attribute('aria-pressed') == 'true', 'plan choice is announced'
            page.reload(wait_until='load')
            assert page.locator('[data-plan="care"]').get_attribute('aria-pressed') == 'true', 'plan choice survives reload'
            assert page.locator('#staffShift').is_hidden()
            page.evaluate('s.cash=2000;commit()')  # isolated test context; no real player save is used
            page.locator('[data-upgrade="staff"]').click()
            assert page.locator('#staffShift').get_attribute('aria-pressed') == 'true'
            page.locator('#staffShift').click()
            assert page.locator('#staffShift').get_attribute('aria-pressed') == 'false'
            page.reload(wait_until='load')
            assert page.locator('#staffShift').get_attribute('aria-pressed') == 'false', 'shift setting must survive reload'
            page.evaluate('s.cash=5000;commit()')
            page.locator('[data-upgrade="vip"]').click()
            page.locator('[data-restock="stickers"]').click()
            assert page.evaluate("document.activeElement.dataset.restock === 'stickers'"), 'restock control keeps keyboard focus after rerender'
            stock_cash = page.evaluate('s.cash')
            assert page.evaluate('s.prizeInventory.stickers') == 10
            assert 'Prize stock' in page.locator('#cashLedger').inner_text()
            page.locator('#open').click()
            prize_day = page.evaluate('s.lastDay')
            assert prize_day['plan'] == 'care' and prize_day['operating'] >= 20, 'selected plan is charged at closing'
            assert 'Preventive checks' in page.locator('#dayReport').inner_text(), 'daily report names opening plan'
            assert prize_day['prizeTickets'] == prize_day['plays'], 'tickets must follow completed plays'
            assert 0 <= prize_day['prizeRedemptions'] <= 10
            assert page.evaluate('s.prizeInventory.stickers') == 10 - prize_day['prizeRedemptions']
            assert page.evaluate('s.cash') == stock_cash + prize_day['net'], 'stock value must not be double charged'
            assert 'tickets issued' in page.locator('#prizeReport').inner_text()
            assert 'Last 1 tracked open day:' in page.locator('#prizeReport').inner_text(), 'stock usage window must be labeled'
            assert page.evaluate('s.history.at(-1).prizeStockValue === s.lastDay.prizeStockValue'), 'recent prize stock use must match completed day'
            page.reload(wait_until='load')
            assert 'Last 1 tracked open day:' in page.locator('#prizeReport').inner_text(), 'prize history must survive reload'
            assert page.evaluate('s.cashLedger.at(-1).balance === s.cash'), 'cash activity must show the closing balance'
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'{label}: horizontal overflow'
            assert not failures, (label, failures)
            page.screenshot(path=str(LOG_DIR / ('arcade-empire-pass5-' + label.replace(' ', '-') + '.png')), full_page=True)
            page.evaluate("localStorage.setItem('technicade_arcade_empire_v1', '{bad save')")
            page.reload(wait_until='load')
            assert page.locator('#corruptExport').is_visible()
            with page.expect_download() as damaged_info:
                page.locator('#corruptExport').click()
            assert Path(damaged_info.value.path()).read_bytes() == b'{bad save'
            assert page.evaluate("localStorage.getItem('technicade_arcade_empire_v1')") == '{bad save'
            page.locator('[data-cell="30"]').focus()
            page.keyboard.press('ArrowRight')
            assert page.evaluate('document.activeElement.dataset.cell') == '32', 'keyboard navigation should skip the entrance'
            page.evaluate("""() => {
                const tiles=[['pinball',17],['claw',10],['racer',16],['shooter',18],['hoops',0]];
                s.owned=tiles.map(([id,pos],i)=>({id,pos,uid:i+1,condition:100,level:1,price:8,sales:0,plays:0,autoService:false}));
                s.capacity=5;selection=5;commit();
            }""")
            page.locator('[data-cell="24"]').click()
            assert page.evaluate('s.owned.find(m=>m.uid===5).pos') == 0, 'blocked placement must not move cabinet'
            assert 'walking route' in page.locator('#toast').inner_text(), 'blocked placement should explain the rule'
            page.locator('#open').click()
            page.locator('#reset').click()
            assert page.evaluate('animationTimer === null && visitors.length === 0 && s.day === 1'), 'reset stops replay and starts fresh'
            if label == 'desktop':
                page.set_viewport_size({'width':390,'height':844})
                assert page.locator('#floor .floor-cell').count() == 35
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'live resize to portrait overflowed'
                page.set_viewport_size({'width':1366,'height':768})
            assert not failures, (label, failures)
            print(f'PASS {label}: floor/blocked placement, keyboard routes, sales history, technician shifts, prize stock/redemption, save reload, no page errors or horizontal overflow')
            context.close()
        browser.close()
finally:
    server.shutdown()
