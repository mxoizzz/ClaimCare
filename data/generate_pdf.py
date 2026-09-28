from fpdf import FPDF
import os

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

content = """
HEALTH INSURANCE POLICY SCHEDULE
--------------------------------------------------

Policyholder Name: John Doe
Policy Number: HM-2026-991823

1. SUM INSURED
The total sum insured under this policy is $500,000 per policy year.

2. DEDUCTIBLES & COPAY
A mandatory deductible of $1,000 applies per claim. 
A co-payment of 10% is applicable on all approved hospital claims after the deductible.

3. WAITING PERIODS
- Initial Waiting Period: 30 days from policy start date for any illness (except accidents).
- Pre-existing Diseases: A 24-month waiting period applies for all declared pre-existing conditions.
- Specific Illnesses (Cataract, Hernia, Joint replacement): 12 months.

4. ROOM RENT LIMITS
Room rent is capped at a Single Private Room up to $5,000 per day. ICU charges are fully covered up to the sum insured.

5. EXCLUSIONS
This policy explicitly does not cover:
- Dental treatments and surgery unless necessitated by an accident.
- Maternity and childbirth-related expenses.
- Cosmetic or aesthetic surgeries.
- Experimental treatments not approved by the Medical Council.

Signed,
ClaimClear Mock Underwriters
"""

for line in content.split("\n"):
    pdf.cell(200, 10, line.encode('latin-1', 'replace').decode('latin-1'), 0, 1)

output_path = os.path.join(os.path.dirname(__file__), "mock_insurance_policy.pdf")
pdf.output(output_path)
print(f"Created mocked PDF at {output_path}")
