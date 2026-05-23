import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="6d174f35-a72a-44ad-aaac-8b38ef3bf450",
    name="Web || shantanuw || TC-41207",
    tc_id="TC-41207",
    network=True,
    variables={"page_displays_athletic_shoes": "true", "product_cards_show_shoe_names_and_prices_visible": "true", "__cp_final": "true"},
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Open https://kaneai-playground.lambdatest.io/'):
        await page.goto("https://kaneai-playground.lambdatest.io/")
    
    async with testmu.step('Clicking Athletic category in the top navigation'):
        _loc_1 = page.locator("internal:role=banner >> internal:role=link[name=\"Athletic\"i]")
        
        await _loc_1.click()
    
    async with testmu.step("Is the page currently showing athletic shoes listed in product cards (e.g., cards like 'Nike Free Run 5.0' and 'Adidas Ultraboost 22' under the Athletic category)? Answer true or false."):
        set_var('page_displays_athletic_shoes', await testmu.vision_query(page, "Is the page currently showing athletic shoes listed in product cards (e.g., cards like 'Nike Free Run 5.0' and 'Adidas Ultraboost 22' under the Athletic category)? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Page displays athletic shoes (athletic shoes are shown/listed on the page)', 'passed': True, 'operator': 'equals', 'transforms': ['strip', 'lowercase'], 'expected': 'true', 'extracted_value': '{{page_displays_athletic_shoes}}', 'store_key': 'page_displays_athletic_shoes', 'variable_refs': {'{{page_displays_athletic_shoes}}': 'true'}}], 'sub_checks': [{'description': 'Page displays athletic shoes (athletic shoes are shown/listed on the page)', 'store_key': 'page_displays_athletic_shoes', 'expected_value': 'true', 'stored_value': '{{page_displays_athletic_shoes}}', 'operator': 'equals', 'transforms': ['strip', 'lowercase']}], 'composite_operator': 'and', 'claim': 'Assert that the page displays athletic shoes.'})
    
    async with testmu.step('Are product cards visible on the Athletic category page that clearly show BOTH (1) a shoe name (e.g., "Nike Free Run 5.0" or "Adidas Ultraboost 22") and (2) a price (e.g., "$99.99" or "$189.99")? Answer true or false.'):
        set_var('product_cards_show_shoe_names_and_prices_visible', await testmu.vision_query(page, "Are product cards visible on the Athletic category page that clearly show BOTH (1) a shoe name (e.g., \"Nike Free Run 5.0\" or \"Adidas Ultraboost 22\") and (2) a price (e.g., \"$99.99\" or \"$189.99\")? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Product cards are visible and include shoe names and prices', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{product_cards_show_shoe_names_and_prices_visible}}', 'store_key': 'product_cards_show_shoe_names_and_prices_visible', 'variable_refs': {'{{product_cards_show_shoe_names_and_prices_visible}}': 'true'}}], 'sub_checks': [{'description': 'Product cards are visible and include shoe names and prices', 'store_key': 'product_cards_show_shoe_names_and_prices_visible', 'expected_value': 'true', 'stored_value': '{{product_cards_show_shoe_names_and_prices_visible}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that product cards with shoe names and prices are visible.'})
    
    async with testmu.step('Is the objective fully satisfied on screen right now: the page is the SoleStyle Athletic category page showing athletic shoes, and visible product cards display both shoe names and prices? Answer true or false.'):
        set_var('__cp_final', await testmu.vision_query(page, "Is the objective fully satisfied on screen right now: the page is the SoleStyle Athletic category page showing athletic shoes, and visible product cards display both shoe names and prices? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Final verification — confirm the objective is fully achieved', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{__cp_final}}', 'store_key': '__cp_final', 'variable_refs': {'{{__cp_final}}': 'true'}}], 'sub_checks': [{'description': 'Final verification — confirm the objective is fully achieved', 'store_key': '__cp_final', 'expected_value': 'true', 'stored_value': '{{__cp_final}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Go to http://localhost:5000/category/athletic'})


if __name__ == "__main__":
    testmu.run(test)