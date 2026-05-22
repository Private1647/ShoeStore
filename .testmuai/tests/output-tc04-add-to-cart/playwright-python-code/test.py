import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="8d68fd66-673a-4575-891c-1c2e2b70ce2f",
    name="Web || shantanuw || TC-41205",
    tc_id="TC-41205",
    network=True,
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Open https://kaneai-playground.lambdatest.io/'):
        await page.goto("https://kaneai-playground.lambdatest.io/")
    
    async with testmu.step('Scrolling down to the product details section'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 520)')
    
    async with testmu.step('Scrolling down to the size selector and Add to Cart'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 500)')
    
    async with testmu.step('Scrolling left to reveal size 10 button'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')
    
    async with testmu.step('Scrolling right to reveal size 10 button'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')
    
    async with testmu.step('Scrolling left in the size selector row'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')
    
    async with testmu.step('Scrolling right to find size 10 option'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')
    
    async with testmu.step('Scrolling right to reveal more size options'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')
    
    async with testmu.step('Scrolling left to find size 10 option'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')
    
    async with testmu.step('Scrolling right to reveal size 10 option'):
        await page.wait_for_load_state('domcontentloaded', timeout=5000)
        await page.evaluate('window.scrollBy(0, 0)')


if __name__ == "__main__":
    testmu.run(test)