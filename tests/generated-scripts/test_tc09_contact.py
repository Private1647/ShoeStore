import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="8cf23715-adbc-427f-9893-69295824d061",
    name="Web || shantanuw || TC-41208",
    tc_id="TC-41208",
    network=True,
    variables={"contact_info_phone_and_email_visible": "false"},
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Navigate to http://localhost:5000/contact'):
        await page.goto("http://localhost:5000/contact")
    
    async with testmu.step('Is contact information including both a phone number and an email address visible on the Contact Us page in the current screenshot? Answer true or false only.'):
        set_var('contact_info_phone_and_email_visible', await testmu.vision_query(page, "Is contact information including both a phone number and an email address visible on the Contact Us page in the current screenshot? Answer true or false only.", ""))
    
    async with testmu.step('Assertion check'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Contact page shows contact information including a phone number and an email address', 'passed': False, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{contact_info_phone_and_email_visible}}', 'store_key': 'contact_info_phone_and_email_visible', 'variable_refs': {'{{contact_info_phone_and_email_visible}}': 'false'}}], 'sub_checks': [{'description': 'Contact page shows contact information including a phone number and an email address', 'store_key': 'contact_info_phone_and_email_visible', 'expected_value': 'true', 'stored_value': '{{contact_info_phone_and_email_visible}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Assert that the Contact page loads with contact information visible including a phone number and email address.'})


if __name__ == "__main__":
    testmu.run(test)