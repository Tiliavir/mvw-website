#!/usr/bin/env python3
"""
Generate an editable PDF/A-2U Beitrittserklärung (membership declaration form)
for Musikverein Wollbach 1866 e.V.

Requirements:
    pip install fpdf2 pymupdf

Usage:
    python3 generate_beitrittserklaerung.py
    python3 generate_beitrittserklaerung.py --output /path/to/output.pdf
"""
import argparse
import os
import sys

try:
    from fpdf import FPDF
    from fpdf.enums import DocumentCompliance, OutputIntentSubType
    from fpdf.output import PDFICCProfile
except ImportError:
    sys.exit("fpdf2 is required. Install with: pip install fpdf2")

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install with: pip install pymupdf")


# sRGB ICC profile bundled with fpdf2
import fpdf as _fpdf_pkg
ICC_PROFILE_PATH = os.path.join(
    os.path.dirname(_fpdf_pkg.__file__), "data", "color_profiles", "sRGB2014.icc"
)


def _find_font(candidates):
    """Return the first existing font path from the candidates list."""
    for path in candidates:
        if os.path.exists(path):
            return path
    sys.exit(f"No suitable font found. Tried: {candidates}")


ARIAL_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/liberation/LiberationSans-Regular.ttf",
]
ARIAL_BOLD_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/liberation/LiberationSans-Bold.ttf",
]


def build_base_pdf(icc_data: bytes) -> bytes:
    """Create a PDF/A-2U document with all static text content."""
    srgb_profile = PDFICCProfile(icc_data, n=3, alternate="/DeviceRGB")

    pdf = FPDF(format="A4", unit="pt", enforce_compliance=DocumentCompliance.PDFA_2U)
    pdf.set_lang("de")
    pdf.set_title("Beitrittserklärung")
    pdf.set_author("Musikverein Wollbach 1866 e.V.")
    pdf.set_keywords(
        "Beitrittserklärung;Musikverein;Wollbach;Musikverein Wollbach 1866 e.V."
    )
    pdf.add_output_intent(
        subtype=OutputIntentSubType.PDFA,
        output_condition_identifier="sRGB",
        dest_output_profile=srgb_profile,
    )

    arial_path = _find_font(ARIAL_CANDIDATES)
    arial_bold_path = _find_font(ARIAL_BOLD_CANDIDATES)
    pdf.add_font("Arial", fname=arial_path)
    pdf.add_font("Arial", style="B", fname=arial_bold_path)

    pdf.add_page()
    pdf.set_auto_page_break(False)

    # Title
    pdf.set_font("Arial", style="B", size=16)
    pdf.set_xy(70.8, 28.9)
    pdf.cell(text="Beitrittserklärung")

    # Introduction paragraph
    pdf.set_font("Arial", size=11)
    pdf.set_xy(70.8, 58.3)
    pdf.write(text="Hiermit beantrage ich die passive Mitgliedschaft beim ")
    pdf.set_font("Arial", style="B", size=12)
    pdf.write(text="Musikverein Wollbach 1866 e.V.")

    # Contribution amount section
    pdf.set_font("Arial", size=11)
    pdf.set_xy(70.8, 80.3)
    pdf.cell(text="Mit einem freiwilligen Jahresbeitrag in Höhe von")

    # Fixed amount label (checkbox widget placed at x=139)
    pdf.set_xy(155, 105.7)
    pdf.cell(text="15,— EURO")
    # Custom amount suffix (text field widget placed at x=293–353)
    pdf.set_xy(355, 105.7)
    pdf.cell(text=",-- EURO")

    # Helper note below amount row
    pdf.set_font("Arial", size=10)
    pdf.set_xy(141.6, 124.2)
    pdf.cell(text="(Zutreffendes bitte ankreuzen oder eintragen)")

    # Personal data labels
    pdf.set_font("Arial", size=11)
    for x, y, label in [
        (70.8, 144.7, "Vorname / Name:"),
        (70.8, 166.7, "Straße:"),
        (70.8, 188.5, "PLZ / Ort:"),
        (70.8, 210.3, "Email-Adresse:"),
        (70.8, 232.1, "Geburtsdatum:"),
        (70.8, 254.1, "Hochzeitsdatum:"),
        (70.8, 275.9, "Eintritt ab:"),
    ]:
        pdf.set_xy(x, y)
        pdf.cell(text=label)

    # Declaration text
    for y, text in [
        (306.9, "Ja, ich werde Mitglied im Musikverein Wollbach und erkenne durch meine Unterschrift die"),
        (319.5, "Satzung des Musikvereins Wollbach 1866 e.V. als verbindlich an, insbesondere von den"),
        (332.3, "Datenschutzregelungen gemäß § 5 der Vereinssatzung und der dazugehörigen"),
        (344.9, "Datenschutzordnung als Anlage zur Satzung habe ich Kenntnis genommen."),
        (370.1, "Die Satzung kann beim Verein auf Wunsch angefordert werden. Die für einen Vereinseintritt"),
        (382.9, "notwendigen Daten, die zur Verfolgung der Vereinsziele und für die die Betreuung und"),
        (395.5, "Verwaltung der Mitglieder erforderlich sind, dürfen hier in dieser Beitrittserklärung erhoben"),
        (408.1, "werden. Die Erhebung, Verarbeitung und Nutzung von personenbezogenen Daten erfolgt im"),
        (420.7, "Verein nach den Richtlinien der EU-weiten Datenschutz-Grundverordnung (DSGVO) sowie"),
        (433.5, "des gültigen Bundesdatenschutzgesetzes (BDSG)."),
    ]:
        pdf.set_xy(70.8, y)
        pdf.cell(text=text)

    # First signature row
    pdf.set_xy(70.8, 473.9)
    pdf.cell(text="Ort, Datum")
    pdf.set_xy(231.4, 473.9)
    pdf.cell(text="Unterschrift:")

    # Divider line before SEPA section
    pdf.set_line_width(0.5)
    pdf.set_draw_color(0, 0, 0)
    pdf.line(70.8, 507, 524, 507)

    # SEPA section header
    pdf.set_font("Arial", style="B", size=16)
    pdf.set_xy(70.8, 519.1)
    pdf.cell(text="SEPA-Lastschriftsmandat:")

    # SEPA static info
    pdf.set_font("Arial", size=11)
    for y, text in [
        (546.4, "Unsere Gläubiger-Identifikationsnummer: DE59ZZZ00000238206"),
        (559.0, "Ihre Mandatsreferenz: - wird nachgereicht -"),
    ]:
        pdf.set_xy(70.8, y)
        pdf.cell(text=text)

    # SEPA explanation text
    for y, text in [
        (581.0, "Hiermit ermächtige ich den Musikverein Wollbach 1866 e.V., den von mir angegebenen"),
        (593.6, "Jahresbeitrag von meinem Konto einzuziehen."),
        (606.2, "Zugleich weise ich mein Kreditinstitut an, die vom Musikverein Wollbach 1866 e.V. auf mein"),
        (618.8, "Konto gezogenen Lastschriften einzulösen."),
        (640.6, "Der Mitgliedsbeitrag wird jedes Jahr zum 01.07. mittels SEPA-Basislastschrift von Ihrem"),
        (653.4, "Konto eingezogen, ohne dass Sie hierfür vorab eine neue Information erhalten. Sollte es sich"),
        (666.0, "bei dem oben genannten Termin um keinen Bankarbeitstag handeln, erfolgt die Abbuchung"),
        (678.6, "am nächstmöglichen Buchungstag."),
    ]:
        pdf.set_xy(70.8, y)
        pdf.cell(text=text)

    # SEPA form labels
    for x, y, label in [
        (70.8, 709.6, "Kontoinhaber:"),
        (70.8, 735.0, "Kreditinstitut (Name und BIC):"),
        (70.8, 760.2, "IBAN:"),
    ]:
        pdf.set_xy(x, y)
        pdf.cell(text=label)

    # SEPA signature row
    pdf.set_xy(70.8, 798.2)
    pdf.cell(text="Ort, Datum")
    pdf.set_xy(292.9, 798.2)
    pdf.cell(text="Unterschrift:")

    return bytes(pdf.output())


def add_form_fields(pdf_bytes: bytes) -> bytes:
    """Add interactive AcroForm widgets to an existing PDF."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = doc[0]

    def text_field(name, rect, date_fmt=False):
        w = fitz.Widget()
        w.field_type = fitz.PDF_WIDGET_TYPE_TEXT
        w.field_name = name
        w.rect = fitz.Rect(*rect)
        w.field_value = ""
        w.text_fontsize = 11
        w.text_font = "Helv"
        w.text_color = (0, 0, 0)
        w.border_color = (0.5, 0.5, 0.5)
        w.border_width = 0.5
        w.fill_color = (0.97, 0.97, 0.97)
        if date_fmt:
            w.text_format = fitz.PDF_WIDGET_TX_FORMAT_DATE
            w.script_format = 'AFDate_FormatEx("d.m.yyyy");'
        page.add_widget(w)

    def checkbox(name, rect):
        w = fitz.Widget()
        w.field_type = fitz.PDF_WIDGET_TYPE_CHECKBOX
        w.field_name = name
        w.rect = fitz.Rect(*rect)
        w.field_value = "Off"
        w.text_fontsize = 0
        w.border_color = (0.5, 0.5, 0.5)
        w.border_width = 0.5
        w.fill_color = (0.97, 0.97, 0.97)
        page.add_widget(w)

    # Amount selection
    checkbox("betrag_15_euro", (139, 103, 153, 117))
    checkbox("betrag_freiwillig", (279, 103, 293, 117))
    text_field("betrag_freiwillig_wert", (293, 103, 353, 117))

    # Personal data
    text_field("vorname_name", (158, 144, 524, 157))
    text_field("strasse", (158, 166, 524, 179))
    text_field("plz_ort", (141, 188, 524, 201))
    text_field("email", (158, 210, 524, 223))
    text_field("geburtsdatum", (158, 232, 524, 245), date_fmt=True)
    text_field("hochzeitsdatum", (158, 254, 524, 267), date_fmt=True)
    text_field("eintritt_ab", (158, 276, 524, 289), date_fmt=True)

    # First signature section
    text_field("ort_datum_1", (127, 474, 228, 487))
    text_field("unterschrift_1", (292, 474, 524, 505))

    # SEPA banking data
    text_field("kontoinhaber", (141, 710, 524, 723))
    text_field("kreditinstitut", (219, 735, 524, 748))
    text_field("iban", (101, 760, 524, 773))

    # SEPA signature section
    text_field("ort_datum_2", (127, 798, 290, 811))
    text_field("unterschrift_2", (354, 798, 524, 820))

    return doc.tobytes()


def generate(output_path: str) -> None:
    """Generate the complete editable PDF/A-2U and write it to output_path."""
    with open(ICC_PROFILE_PATH, "rb") as f:
        icc_data = f.read()

    pdf_bytes = build_base_pdf(icc_data)
    pdf_bytes = add_form_fields(pdf_bytes)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(pdf_bytes)
    print(f"Generated: {output_path} ({len(pdf_bytes) / 1024:.1f} KB)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    default_output = os.path.join(
        repo_root, "static", "files", "pdf", "beitrittserklaerung.pdf"
    )
    parser.add_argument(
        "--output",
        default=default_output,
        help=f"Output path (default: {default_output})",
    )
    args = parser.parse_args()
    generate(args.output)
