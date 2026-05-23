import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="4156add9-27e3-4346-b7bf-97f266b43a63",
    name="Web || shantanuw || TC-41204",
    tc_id="TC-41204",
    network=True,
    variables={"product_name_nike_air_max_pro_visible": "true", "price_129_99_visible": "false"},
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Navigate to http://localhost:5000/product/nike-air-max-pro'):
        await page.goto("http://localhost:5000/product/nike-air-max-pro")
    
    async with testmu.step("Is the product name text 'Nike Air Max Pro' visible on the page in the current screenshot (e.g., in the breadcrumb or product title)? Answer true or false only."):
        set_var('product_name_nike_air_max_pro_visible', await testmu.vision_query(page, "Is the product name text 'Nike Air Max Pro' visible on the page in the current screenshot (e.g., in the breadcrumb or product title)? Answer true or false only.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': "Product name 'Nike Air Max Pro' is visible on the page", 'passed': True, 'operator': 'equals', 'transforms': ['strip', 'lowercase'], 'expected': 'true', 'extracted_value': '{{product_name_nike_air_max_pro_visible}}', 'store_key': 'product_name_nike_air_max_pro_visible', 'variable_refs': {'{{product_name_nike_air_max_pro_visible}}': 'true'}}], 'sub_checks': [{'description': "Product name 'Nike Air Max Pro' is visible on the page", 'store_key': 'product_name_nike_air_max_pro_visible', 'expected_value': 'true', 'stored_value': '{{product_name_nike_air_max_pro_visible}}', 'operator': 'equals', 'transforms': ['strip', 'lowercase']}], 'composite_operator': 'and', 'claim': "Assert that the product name 'Nike Air Max Pro' is visible."})
    
    async with testmu.step("Is the price '$129.99' visible anywhere in the current screenshot of the Nike Air Max Pro product detail page? Answer true or false only."):
        set_var('price_129_99_visible', await testmu.vision_query(page, "Is the price '$129.99' visible anywhere in the current screenshot of the Nike Air Max Pro product detail page? Answer true or false only.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': "Price '$129.99' is visible on the page", 'passed': False, 'operator': 'equals', 'transforms': ['strip', 'lowercase'], 'expected': 'true', 'extracted_value': '{{price_129_99_visible}}', 'store_key': 'price_129_99_visible', 'variable_refs': {'{{price_129_99_visible}}': 'false'}}], 'sub_checks': [{'description': "Price '$129.99' is visible on the page", 'store_key': 'price_129_99_visible', 'expected_value': 'true', 'stored_value': '{{price_129_99_visible}}', 'operator': 'equals', 'transforms': ['strip', 'lowercase']}], 'composite_operator': 'and', 'claim': "Assert that the price '$129.99' is visible."})


if __name__ == "__main__":
    testmu.run(test)