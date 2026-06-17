import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="ad7c48ef-eebf-40a7-a996-09ff071bb565",
    name="Web || shantanuw || TC-41202",
    tc_id="TC-41202",
    network=True,
    variables={"product_cards_shoes_with_names_and_prices_displayed": "true", "header_nav_links_men_women_athletic_casual_dress_sale_visible": "true", "search_input_field_visible": "true", "header_shopping_cart_icon_visible": "false"},
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Open https://kaneai-playground.lambdatest.io/'):
        await page.goto("https://kaneai-playground.lambdatest.io/")
    
    async with testmu.step('Is at least one product card for shoes visible that shows a shoe product name and a price on the card? Answer true or false.'):
        set_var('product_cards_shoes_with_names_and_prices_displayed', await testmu.vision_query(page, "Is at least one product card for shoes visible that shows a shoe product name and a price on the card? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Product cards are displayed showing shoe products with visible names and prices', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{product_cards_shoes_with_names_and_prices_displayed}}', 'store_key': 'product_cards_shoes_with_names_and_prices_displayed', 'variable_refs': {'{{product_cards_shoes_with_names_and_prices_displayed}}': 'true'}}], 'sub_checks': [{'description': 'Product cards are displayed showing shoe products with visible names and prices', 'store_key': 'product_cards_shoes_with_names_and_prices_displayed', 'expected_value': 'true', 'stored_value': '{{product_cards_shoes_with_names_and_prices_displayed}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that product cards are displayed showing shoe products with names and prices.'})
    
    async with testmu.step('On the current screenshot, is the site header/nav bar showing visible navigation links labeled: Men, Women, Athletic, Casual, Dress, and Sale? Answer true or false only.'):
        set_var('header_nav_links_men_women_athletic_casual_dress_sale_visible', await testmu.vision_query(page, "On the current screenshot, is the site header/nav bar showing visible navigation links labeled: Men, Women, Athletic, Casual, Dress, and Sale? Answer true or false only.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Header shows navigation links: Men, Women, Athletic, Casual, Dress, and Sale', 'passed': True, 'operator': 'equals', 'transforms': ['strip', 'lowercase'], 'expected': 'true', 'extracted_value': '{{header_nav_links_men_women_athletic_casual_dress_sale_visible}}', 'store_key': 'header_nav_links_men_women_athletic_casual_dress_sale_visible', 'variable_refs': {'{{header_nav_links_men_women_athletic_casual_dress_sale_visible}}': 'true'}}], 'sub_checks': [{'description': 'Header shows navigation links: Men, Women, Athletic, Casual, Dress, and Sale', 'store_key': 'header_nav_links_men_women_athletic_casual_dress_sale_visible', 'expected_value': 'true', 'stored_value': '{{header_nav_links_men_women_athletic_casual_dress_sale_visible}}', 'operator': 'equals', 'transforms': ['strip', 'lowercase']}], 'composite_operator': 'and', 'claim': 'Assert that navigation links for Men, Women, Athletic, Casual, Dress, and Sale are visible in the header.'})
    
    async with testmu.step('Is a search input field visible in the top site header (e.g., an input box with placeholder text like "Search shoes...")? Answer true or false only.'):
        set_var('search_input_field_visible', await testmu.vision_query(page, "Is a search input field visible in the top site header (e.g., an input box with placeholder text like \"Search shoes...\")? Answer true or false only.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Search input field is visible', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{search_input_field_visible}}', 'store_key': 'search_input_field_visible', 'variable_refs': {'{{search_input_field_visible}}': 'true'}}], 'sub_checks': [{'description': 'Search input field is visible', 'store_key': 'search_input_field_visible', 'expected_value': 'true', 'stored_value': '{{search_input_field_visible}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that a search input field is visible.'})
    
    async with testmu.step('Is a shopping cart icon (cart/bag icon used to open the cart) visible in the top site header area on this screenshot (near the search field or top-right header)? Answer true or false only.'):
        set_var('header_shopping_cart_icon_visible', await testmu.vision_query(page, "Is a shopping cart icon (cart/bag icon used to open the cart) visible in the top site header area on this screenshot (near the search field or top-right header)? Answer true or false only.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Shopping cart icon is visible in the header', 'passed': False, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{header_shopping_cart_icon_visible}}', 'store_key': 'header_shopping_cart_icon_visible', 'variable_refs': {'{{header_shopping_cart_icon_visible}}': 'false'}}], 'sub_checks': [{'description': 'Shopping cart icon is visible in the header', 'store_key': 'header_shopping_cart_icon_visible', 'expected_value': 'true', 'stored_value': '{{header_shopping_cart_icon_visible}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that a shopping cart icon is visible in the header.'})


if __name__ == "__main__":
    testmu.run(test)