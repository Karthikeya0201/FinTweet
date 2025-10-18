from fastapi import APIRouter, HTTPException
from app.services.analyzeStock import analyze_company
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from datetime import datetime
import base64

router = APIRouter()

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

@router.get("/analyze/{ticker}")
async def analyze(ticker: str, future_days: int = 90):
    """
    Returns stock + tweet analysis for a given company ticker.
    Automatically generates a downloadable PDF report.
    """
    ticker = ticker.upper()

    # ✅ Check if ticker exists
    company = await db.companies.find_one({"ticker": ticker})
    if not company:
        raise HTTPException(status_code=404, detail="Company not supported")

    try:
        # ✅ Run AI + Stock analysis
        result = await analyze_company(ticker, future_days=future_days)

        # ✅ Generate PDF automatically
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=40, bottomMargin=40)
        elements = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "title",
            parent=styles["Heading1"],
            fontSize=20,
            textColor=colors.HexColor("#4F46E5"),
            alignment=1,
            spaceAfter=20,
        )
        subtitle_style = ParagraphStyle(
            "subtitle",
            parent=styles["Normal"],
            fontSize=12,
            textColor=colors.HexColor("#6B7280"),
            alignment=1,
        )
        section_header = ParagraphStyle(
            "section",
            parent=styles["Heading2"],
            textColor=colors.HexColor("#4338CA"),
            spaceAfter=10,
            spaceBefore=20,
        )
        normal_text = ParagraphStyle(
            "normal",
            parent=styles["Normal"],
            fontSize=11,
            leading=16,
        )

        # Header
        elements.append(Paragraph("📈 Company Analysis Report", title_style))
        elements.append(Paragraph("AI-Powered Market Intelligence & Predictions", subtitle_style))
        elements.append(Spacer(1, 0.3 * inch))

        # Company Info
        elements.append(Paragraph(f"<b>Company:</b> {company['name']} ({ticker})", normal_text))
        elements.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", normal_text))
        elements.append(Spacer(1, 0.2 * inch))

        # Key Metrics
        elements.append(Paragraph("💵 Key Metrics", section_header))
        data = [
            ["Metric", "Value"],
            ["Last Price (Today)", f"${result['last_price']:.2f}"],
            ["Predicted Price (90 Days)", f"${result['predicted_price']:.2f}"],
            ["Percentage Change", f"{result['pct_change']:+.2f}%"],
            ["Stock Score", f"{result['stock_score']:.4f}"],
            ["Tweet Score", f"{result['tweet_score']:.4f}"],
            ["Final Score", f"{result['final_score']}"],
            ["Recommendation", result['recommendation']],
            ["Risk", result['risk']],
        ]
        table = Table(data, colWidths=[2.5 * inch, 3.5 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E0E7FF")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ]))
        elements.append(table)

        # AI Summary
        elements.append(Paragraph("💡 AI Analysis Summary", section_header))
        elements.append(Paragraph(result["explanation"].replace("\n", "<br/>"), normal_text))

        elements.append(Spacer(1, 0.4 * inch))
        elements.append(Paragraph(
            "Generated automatically using AI-driven analysis tools.",
            ParagraphStyle("footer", parent=styles["Normal"], alignment=1, textColor=colors.HexColor("#6B7280"))
        ))

        # ✅ Build PDF
        doc.build(elements)
        buffer.seek(0)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        # ✅ Encode to base64 to send in JSON
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

        # ✅ Return analysis + PDF
        return {
            **result,
            "pdf_report": pdf_base64,
            "pdf_filename": f"{ticker}_report.pdf"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
