#!/usr/bin/env python3
"""
Generate an editable PDF/A-2U Beitrittserklärung (membership declaration form)
for Musikverein Wollbach 1866 e.V.

Requirements:
    pip install fpdf2 pypdf

Usage:
    python3 generate_beitrittserklaerung.py
    python3 generate_beitrittserklaerung.py --output /path/to/output.pdf
"""
import argparse
import io
import os
import sys

try:
    from fpdf import FPDF  # noqa: F401
    from fpdf.enums import DocumentCompliance, OutputIntentSubType  # noqa: F401
    from fpdf.output import PDFICCProfile  # noqa: F401
except ImportError as e:
    sys.exit("fpdf2 is required. Install with: pip install fpdf2")

try:
    from pypdf import PdfReader, PdfWriter  # noqa: F401
    from pypdf.generic import NameObject, DictionaryObject, ArrayObject, NumberObject, TextStringObject  # noqa: F401
except ImportError as e:
    sys.exit("pypdf is required. Install with: pip install pypdf")

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
ARIAL_ITALIC_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf",
    "/usr/share/fonts/liberation/LiberationSans-Italic.ttf", ]


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
    arial_italic_path = _find_font(ARIAL_ITALIC_CANDIDATES)
    pdf.add_font("Arial", fname=arial_path)
    pdf.add_font("Arial", style="B", fname=arial_bold_path)
    pdf.add_font("Arial", style="I", fname=arial_italic_path)

    pdf.add_page()
    pdf.set_auto_page_break(False)

    # Title
    pdf.set_font("Arial", style="B", size=16)
    pdf.set_xy(70.8, 28.9)
    pdf.cell(0, 0, "Beitrittserklärung")  # type: ignore[call-arg]

    # Introduction paragraph
    pdf.set_font("Arial", size=11)
    pdf.set_xy(70.8, 58.3)
    pdf.write(0, "Hiermit beantrage ich die passive Mitgliedschaft beim ")  # type: ignore[call-arg]
    pdf.set_font("Arial", style="B", size=12)
    pdf.write(0, "Musikverein Wollbach 1866 e.V.")  # type: ignore[call-arg]

    # Contribution amount section
    pdf.set_font("Arial", size=11)
    pdf.set_xy(70.8, 80.3)
    pdf.cell(0, 0, "Mit einem freiwilligen Jahresbeitrag in Höhe von")  # type: ignore[call-arg]

    # Fixed amount label
    pdf.set_xy(90.8, 105.7)
    pdf.cell(0, 0, "15,— €")  # type: ignore[call-arg]
    # Custom amount suffix
    pdf.set_xy(220, 105.7)
    pdf.cell(0, 0, ",— €")  # type: ignore[call-arg]

    # Helper note below amount row
    pdf.set_font("Arial", style="I", size=9)
    pdf.set_xy(71.8, 124.2)
    pdf.cell(0, 0, "(Zutreffendes bitte ankreuzen oder eintragen)")  # type: ignore[call-arg]

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
        pdf.cell(0, 0, label)  # type: ignore[call-arg]

    # Declaration text
    for y, text_content in [
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
        pdf.cell(0, 0, text_content)  # type: ignore[call-arg]

    # First signature row
    pdf.set_xy(70.8, 473.9)
    pdf.cell(0, 0, "Ort, Datum:")  # type: ignore[call-arg]
    pdf.set_xy(292.9, 473.9)
    pdf.cell(0, 0, "Unterschrift:")  # type: ignore[call-arg]

    # Draw signature line (non-editable visual area)
    pdf.set_line_width(0.5)
    pdf.set_draw_color(0, 0, 0)
    pdf.line(360, 487, 524, 487)  # Signature line

    # Divider line before SEPA section
    pdf.set_line_width(0.5)
    pdf.set_draw_color(0, 0, 0)
    pdf.line(70.8, 507, 524, 507)

    # SEPA section header
    pdf.set_font("Arial", style="B", size=16)
    pdf.set_xy(70.8, 519.1)
    pdf.cell(0, 0, "SEPA-Lastschriftsmandat:")  # type: ignore[call-arg]

    # SEPA static info
    pdf.set_font("Arial", size=11)
    for y, text_content in [
        (546.4, "Unsere Gläubiger-Identifikationsnummer: DE59ZZZ00000238206"),
        (559.0, "Ihre Mandatsreferenz: - wird nachgereicht -"),
    ]:
        pdf.set_xy(70.8, y)
        pdf.cell(0, 0, text_content)  # type: ignore[call-arg]

    # SEPA explanation text
    for y, text_content in [
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
        pdf.cell(0, 0, text_content)  # type: ignore[call-arg]

    # SEPA form labels
    for x, y, label in [
        (70.8, 709.6, "Kontoinhaber:"),
        (70.8, 735.0, "Kreditinstitut (Name und BIC):"),
        (70.8, 760.2, "IBAN:"),
    ]:
        pdf.set_xy(x, y)
        pdf.cell(0, 0, label)  # type: ignore[call-arg]

    # SEPA signature row
    pdf.set_xy(70.8, 798.2)
    pdf.cell(0, 0, "Ort, Datum:")  # type: ignore[call-arg]
    pdf.set_xy(292.9, 798.2)
    pdf.cell(0, 0, "Unterschrift:")  # type: ignore[call-arg]

    # Draw SEPA signature line (non-editable visual area)
    pdf.set_line_width(0.5)
    pdf.set_draw_color(0, 0, 0)
    pdf.line(360, 812, 524, 812)  # SEPA signature line

    return bytes(pdf.output())


def add_form_fields(pdf_bytes: bytes) -> bytes:
    """Add interactive AcroForm widgets to an existing PDF while preserving PDF/A compliance."""
    reader = PdfReader(stream=io.BytesIO(pdf_bytes))
    writer = PdfWriter()

    # Copy all pages to preserve content
    for page in reader.pages:
        writer.add_page(page)

    # Preserve critical PDF/A metadata
    catalog = reader.root_object
    writer_catalog = writer._root_object

    # Copy Metadata stream (contains XMP with PDF/A compliance info)
    if '/Metadata' in catalog:
        writer_catalog[NameObject('/Metadata')] = catalog['/Metadata']

    # Copy OutputIntents (color profile for PDF/A)
    if '/OutputIntents' in catalog:
        writer_catalog[NameObject('/OutputIntents')] = catalog['/OutputIntents']

    # Preserve language
    if '/Lang' in catalog:
        writer_catalog[NameObject('/Lang')] = catalog['/Lang']

    # Add form fields using pypdf
    # Note: pypdf's form field API is limited, so we work with the AcroForm dictionary directly
    page = writer.pages[0]
    page_height = float(page.mediabox.height)
    field_height = 12.8
    checkbox_height = 14.0

    def rect_from_top(x1, y_top, x2, height):
        """Convert top-based coordinates to PDF user space (origin at bottom-left)."""
        y2 = page_height - y_top
        y1 = y2 - height
        return (x1, y1, x2, y2)

    def create_text_field(name, rect, date_fmt=False, align="left"):
        """Create a text form field widget and annotation."""
        # Widget dictionary
        widget = DictionaryObject()
        widget[NameObject('/Type')] = NameObject('/Annot')
        widget[NameObject('/Subtype')] = NameObject('/Widget')
        widget[NameObject('/Rect')] = ArrayObject([
            NumberObject(rect[0]), NumberObject(rect[1]),
            NumberObject(rect[2]), NumberObject(rect[3])
        ])
        widget[NameObject('/F')] = NumberObject(4)  # Print flag
        widget[NameObject('/BS')] = DictionaryObject({
            NameObject('/W'): NumberObject(0.5),
            NameObject('/S'): NameObject('/S')
        })
        widget[NameObject('/DA')] = TextStringObject('(0,0,0) Tf')
        widget[NameObject('/C')] = ArrayObject([NumberObject(0.97), NumberObject(0.97), NumberObject(0.97)])

        # Field dictionary (references the widget)
        field = DictionaryObject()
        field[NameObject('/FT')] = NameObject('/Tx')
        field[NameObject('/Ff')] = NumberObject(0)
        field[NameObject('/T')] = TextStringObject(name)
        field[NameObject('/V')] = TextStringObject('')
        field[NameObject('/DV')] = TextStringObject('')
        field[NameObject('/AP')] = DictionaryObject()
        if align:
            align_map = {"left": 0, "center": 1, "right": 2}
            field[NameObject('/Q')] = NumberObject(align_map.get(align, 0))
        if date_fmt:
            field[NameObject('/AA')] = DictionaryObject({
                NameObject('/F'): DictionaryObject({
                    NameObject('/S'): NameObject('/JavaScript'),
                    NameObject('/JS'): TextStringObject('AFDate_FormatEx("d.m.yyyy");')
                })
            })

        # Link widget to field
        widget[NameObject('/Parent')] = field

        return field, widget

    # Create AcroForm if it doesn't exist
    if '/AcroForm' not in writer_catalog:
        acroform = DictionaryObject()
        acroform[NameObject('/SigFlags')] = NumberObject(0)
        acroform[NameObject('/Fields')] = ArrayObject()
        writer_catalog[NameObject('/AcroForm')] = acroform
    else:
        acroform = writer_catalog['/AcroForm']

    fields_array = acroform['/Fields']
    if fields_array is None:
        fields_array = ArrayObject()
        acroform[NameObject('/Fields')] = fields_array

    # Helper to add field
    def add_field(name, rect, date_fmt=False, align="left"):
        field, widget = create_text_field(name, rect, date_fmt, align)
        fields_array.append(field)
        # Add annotation to page
        if '/Annots' not in page:
            page[NameObject('/Annots')] = ArrayObject()
        annots = page['/Annots']
        if isinstance(annots, ArrayObject):
            annots.append(widget)

    def create_checkbox(name, rect):
        """Create a checkbox form field."""
        widget = DictionaryObject()
        widget[NameObject('/Type')] = NameObject('/Annot')
        widget[NameObject('/Subtype')] = NameObject('/Widget')
        widget[NameObject('/Rect')] = ArrayObject([
            NumberObject(rect[0]), NumberObject(rect[1]),
            NumberObject(rect[2]), NumberObject(rect[3])
        ])
        widget[NameObject('/F')] = NumberObject(4)
        widget[NameObject('/BS')] = DictionaryObject({
            NameObject('/W'): NumberObject(0.5),
            NameObject('/S'): NameObject('/S')
        })
        widget[NameObject('/C')] = ArrayObject([NumberObject(0.97), NumberObject(0.97), NumberObject(0.97)])

        field = DictionaryObject()
        field[NameObject('/FT')] = NameObject('/Btn')
        field[NameObject('/T')] = TextStringObject(name)
        field[NameObject('/V')] = NameObject('/Off')
        field[NameObject('/AS')] = NameObject('/Off')

        widget[NameObject('/Parent')] = field
        return field, widget

    def add_checkbox_field(name, rect):
        field, widget = create_checkbox(name, rect)
        fields_array.append(field)
        if '/Annots' not in page:
            page[NameObject('/Annots')] = ArrayObject()
        annots = page['/Annots']
        if isinstance(annots, ArrayObject):
            annots.append(widget)

    # Amount selection (top-based coordinates)
    add_checkbox_field("betrag_15_euro", rect_from_top(75, 103, 89, checkbox_height))
    add_checkbox_field("betrag_freiwillig", rect_from_top(160, 103, 174, checkbox_height))
    add_field("betrag_freiwillig_wert", rect_from_top(174, 103, 220, checkbox_height), align="right")

    # Personal data (top-based coordinates, aligned under labels)
    add_field("vorname_name", rect_from_top(180, 144.7, 520, field_height))
    add_field("strasse", rect_from_top(180, 166.7, 520, field_height))
    add_field("plz_ort", rect_from_top(180, 188.5, 520, field_height))
    add_field("email", rect_from_top(180, 210.3, 520, field_height))
    add_field("geburtsdatum", rect_from_top(180, 232.1, 520, field_height), date_fmt=True)
    add_field("hochzeitsdatum", rect_from_top(180, 254.1, 520, field_height), date_fmt=True)
    add_field("eintritt_ab", rect_from_top(180, 275.9, 520, field_height), date_fmt=True)

    # First signature section (non-editable - signature support limited in PDF/A-2U)
    add_field("ort_datum_1", rect_from_top(135, 471.9, 290, field_height))
    # Note: Signature fields are not editable in PDF/A-2U for compliance
    # Users should print and sign physically

    # SEPA banking data (top-based coordinates)
    add_field("kontoinhaber", rect_from_top(240, 709.6, 520, field_height))
    add_field("kreditinstitut", rect_from_top(240, 735.0, 520, field_height))
    add_field("iban", rect_from_top(240, 760.2, 520, field_height))

    # SEPA signature section (non-editable for compliance)
    add_field("ort_datum_2", rect_from_top(135, 796.2, 290, field_height))
    # Note: Signature field not editable in PDF/A-2U

    # Write to bytes
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


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
