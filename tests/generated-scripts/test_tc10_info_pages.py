import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="9bedae02-c6fb-4f96-8b54-02be757d83ef",
    name="Web || shantanuw || TC-41209",
    tc_id="TC-41209",
    network=True,
    variables={"about_page_company_info_visible": "true", "__cp_final": "true", "size_chart_content_visible": "true", "return_policy_info_visible": "true"},
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Navigate to http://localhost:5000/about'):
        await page.goto("http://localhost:5000/about")
    _condition_met = False
    _until_retries = 0
    while _until_retries < 10:
        print(f"[until-loop] iteration {_until_retries + 1}/10")
        async with testmu.step("Wait briefly while confirming the About page heading 'About SoleStyle' is visible."):
            await page.wait_for_timeout(500)
        await page.wait_for_timeout(500)
        if await testmu.check_until_condition(page, "the heading 'About SoleStyle' is visible"):
            _condition_met = True
            break
        _until_retries += 1
    set_var("__result__", {"condition_met": _condition_met, "retries": _until_retries + 1})
    
    async with testmu.step("Is company information visible on the About page in the main content area? Consider the 'About SoleStyle' heading and the descriptive paragraph about the company (e.g., 'Founded in 2018...'). Answer true or false."):
        set_var('about_page_company_info_visible', await testmu.vision_query(page, "Is company information visible on the About page in the main content area? Consider the 'About SoleStyle' heading and the descriptive paragraph about the company (e.g., 'Founded in 2018...'). Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Company information is visible on the About page', 'passed': True, 'operator': 'equals', 'transforms': ['strip', 'lowercase'], 'expected': 'true', 'extracted_value': '{{about_page_company_info_visible}}', 'store_key': 'about_page_company_info_visible', 'variable_refs': {'{{about_page_company_info_visible}}': 'true'}}], 'sub_checks': [{'description': 'Company information is visible on the About page', 'store_key': 'about_page_company_info_visible', 'expected_value': 'true', 'stored_value': '{{about_page_company_info_visible}}', 'operator': 'equals', 'transforms': ['strip', 'lowercase']}], 'composite_operator': 'and', 'claim': 'Assert that the About page loads with company information visible.'})
    
    async with testmu.step("Is the objective fully achieved on screen right now (we are on the About page at http://localhost:5000/about and company information is visible, such as the 'About SoleStyle' heading with descriptive text about the company)? Answer true or false."):
        set_var('__cp_final', await testmu.vision_query(page, "Is the objective fully achieved on screen right now (we are on the About page at http://localhost:5000/about and company information is visible, such as the 'About SoleStyle' heading with descriptive text about the company)? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Final verification — confirm the objective is fully achieved', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{__cp_final}}', 'store_key': '__cp_final', 'variable_refs': {'{{__cp_final}}': 'true'}}], 'sub_checks': [{'description': 'Final verification — confirm the objective is fully achieved', 'store_key': '__cp_final', 'expected_value': 'true', 'stored_value': '{{__cp_final}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Go to http://localhost:5000/about'})
    
    async with testmu.step('Navigate to http://localhost:5000/size-guide'):
        await page.goto("http://localhost:5000/size-guide")
    
    async with testmu.step('Waiting briefly on the Size Guide page'):
        await page.wait_for_timeout(500)
    
    async with testmu.step('On the /size-guide page screenshot, is any size chart content visible (for example the section heading "Men\'s Shoe Sizes" or a size chart table) in the main content area? Answer true or false.'):
        set_var('size_chart_content_visible', await testmu.vision_query(page, "On the /size-guide page screenshot, is any size chart content visible (for example the section heading \"Men's Shoe Sizes\" or a size chart table) in the main content area? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Size chart content is visible on the size guide page', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{size_chart_content_visible}}', 'store_key': 'size_chart_content_visible', 'variable_refs': {'{{size_chart_content_visible}}': 'true'}}], 'sub_checks': [{'description': 'Size chart content is visible on the size guide page', 'store_key': 'size_chart_content_visible', 'expected_value': 'true', 'stored_value': '{{size_chart_content_visible}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that size chart content is visible.'})
    
    async with testmu.step('On the current /size-guide page screenshot, is size chart content visible in the main content area (e.g., the "Men\'s Shoe Sizes" section heading and/or a size chart table)? Answer true or false.'):
        set_var('__cp_final', await testmu.vision_query(page, "On the current /size-guide page screenshot, is size chart content visible in the main content area (e.g., the \"Men's Shoe Sizes\" section heading and/or a size chart table)? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Final verification — confirm the objective is fully achieved', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{__cp_final}}', 'store_key': '__cp_final', 'variable_refs': {'{{__cp_final}}': 'true'}}], 'sub_checks': [{'description': 'Final verification — confirm the objective is fully achieved', 'store_key': '__cp_final', 'expected_value': 'true', 'stored_value': '{{__cp_final}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Then go to http://localhost:5000/size-guide'})
    
    async with testmu.step('Navigate to http://localhost:5000/returns'):
        await page.goto("http://localhost:5000/returns")
    
    async with testmu.step("Is return policy information visible on the page (such as the 'Returns & Exchanges' title and policy details/cards like 'Free Returns' or '30-Day Window')? Answer true or false."):
        set_var('return_policy_info_visible', await testmu.vision_query(page, "Is return policy information visible on the page (such as the 'Returns & Exchanges' title and policy details/cards like 'Free Returns' or '30-Day Window')? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Return policy information is visible on the page', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{return_policy_info_visible}}', 'store_key': 'return_policy_info_visible', 'variable_refs': {'{{return_policy_info_visible}}': 'true'}}], 'sub_checks': [{'description': 'Return policy information is visible on the page', 'store_key': 'return_policy_info_visible', 'expected_value': 'true', 'stored_value': '{{return_policy_info_visible}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that return policy information is visible.'})
    
    async with testmu.step("Is the return policy information visible on the SoleStyle Returns page (e.g., the 'Returns & Exchanges' heading and policy details/cards) in the main content area? Answer true or false."):
        set_var('__cp_final', await testmu.vision_query(page, "Is the return policy information visible on the SoleStyle Returns page (e.g., the 'Returns & Exchanges' heading and policy details/cards) in the main content area? Answer true or false.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Final verification — confirm the objective is fully achieved', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{__cp_final}}', 'store_key': '__cp_final', 'variable_refs': {'{{__cp_final}}': 'true'}}], 'sub_checks': [{'description': 'Final verification — confirm the objective is fully achieved', 'store_key': '__cp_final', 'expected_value': 'true', 'stored_value': '{{__cp_final}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Then go to http://localhost:5000/returns'})


if __name__ == "__main__":
    testmu.run(test)