from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import fitz

from app.database import db
from app.services.gemini_service import (
    analyze_resume,
    generate_interview_questions,
    generate_cover_letter,
)
from app.routes.auth import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to Resume Copilot AI 🚀"}


@app.post("/upload")
async def upload_resume(resume: UploadFile = File(...)):

    pdf_bytes = await resume.read()

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    text = ""

    for page in doc:
        text += page.get_text()

    skills = [
        "Python",
        "Java",
        "SQL",
        "Git",
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node",
        "MongoDB",
    ]

    found_skills = []

    for skill in skills:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    missing_skills = []

    for skill in skills:
        if skill not in found_skills:
            missing_skills.append(skill)

    ats_score = min(50 + len(found_skills) * 5, 100)

    suggestions = []

    if "React" in missing_skills:
        suggestions.append("Learn React.js and build at least one frontend project.")

    if "Node" in missing_skills:
        suggestions.append("Learn Node.js and Express.js.")

    if "MongoDB" in missing_skills:
        suggestions.append("Gain hands-on experience with MongoDB.")

    if "Git" in missing_skills:
        suggestions.append("Learn Git and GitHub.")

    if ats_score < 90:
        suggestions.append("Add more technical skills.")

    suggestions.append("Include your GitHub profile.")
    suggestions.append("Tailor your resume for every job application.")

    ai_analysis = analyze_resume(text)

    interview_questions = generate_interview_questions(text)

    resume_document = {
        "filename": resume.filename,
        "resume_text": text,
        "ats_score": ats_score,
        "skills_found": found_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "summary": ai_analysis.get("summary", ""),
        "strengths": ai_analysis.get("strengths", []),
        "weaknesses": ai_analysis.get("weaknesses", []),
        "missing_ai_skills": ai_analysis.get("missing_skills", []),
        "career_suggestions": ai_analysis.get("career_suggestions", []),
        "recommended_jobs": ai_analysis.get("recommended_jobs", []),
        "hr_questions": interview_questions.get("hr_questions", []),
        "technical_questions": interview_questions.get("technical_questions", []),
        "project_questions": interview_questions.get("project_questions", []),
    }

    await db.resumes.insert_one(resume_document)

    return {
        "filename": resume.filename,
        "ats_score": ats_score,
        "skills_found": found_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "summary": ai_analysis.get("summary", ""),
        "strengths": ai_analysis.get("strengths", []),
        "weaknesses": ai_analysis.get("weaknesses", []),
        "career_suggestions": ai_analysis.get("career_suggestions", []),
        "recommended_jobs": ai_analysis.get("recommended_jobs", []),
        "hr_questions": interview_questions.get("hr_questions", []),
        "technical_questions": interview_questions.get("technical_questions", []),
        "project_questions": interview_questions.get("project_questions", []),
        "text": text,
    }


@app.get("/dashboard")
async def dashboard():

    total_resumes = await db.resumes.count_documents({})

    highest_resume = await db.resumes.find_one(
        sort=[("ats_score", -1)]
    )

    latest_resume = await db.resumes.find_one(
        sort=[("_id", -1)]
    )

    return {
    "total_resumes": total_resumes,
    "highest_ats": highest_resume["ats_score"] if highest_resume else 0,
    "latest_resume": latest_resume["filename"] if latest_resume else "None",
    "average_ats": round(
        (
            sum(
                [
                    r.get("ats_score", 0)
                    async for r in db.resumes.find()
                ]
            )
            / total_resumes
        ),
        2,
    )
    if total_resumes > 0
    else 0,
}

# -----------------------------
# Resume History API
# -----------------------------
@app.get("/resumes")
async def get_resumes():

    resumes = []

    async for resume in db.resumes.find().sort("_id", -1):
        resumes.append({
            "id": str(resume["_id"]),
            "filename": resume.get("filename", ""),
            "ats_score": resume.get("ats_score", 0),
        })

    return resumes
@app.get("/resume/{resume_id}")
async def get_resume(resume_id: str):

    resume = await db.resumes.find_one(
        {"_id": ObjectId(resume_id)}
    )

    if not resume:
        return {
            "message": "Resume not found"
        }

    return {
        "id": str(resume["_id"]),
        "filename": resume.get("filename", ""),
        "ats_score": resume.get("ats_score", 0),
        "summary": resume.get("summary", ""),
        "strengths": resume.get("strengths", []),
        "weaknesses": resume.get("weaknesses", []),
        "missing_ai_skills": resume.get("missing_ai_skills", []),
        "career_suggestions": resume.get("career_suggestions", []),
        "recommended_jobs": resume.get("recommended_jobs", []),
        "hr_questions": resume.get("hr_questions", []),
        "technical_questions": resume.get("technical_questions", []),
        "project_questions": resume.get("project_questions", [])
    }

# -----------------------------
# Delete Resume API
# -----------------------------
@app.delete("/resume/{resume_id}")
async def delete_resume(resume_id: str):

    await db.resumes.delete_one(
        {"_id": ObjectId(resume_id)}
    )

    return {
        "message": "Resume deleted successfully"
    }
class CoverLetterRequest(BaseModel):
    resume_text: str
    job_role: str
    company_name: str
@app.post("/cover-letter")
async def create_cover_letter(data: CoverLetterRequest):

    cover_letter = generate_cover_letter(
        data.resume_text,
        data.job_role,
        data.company_name,
    )

    return {
        "cover_letter": cover_letter
    }
@app.get("/latest-resume")
async def get_latest_resume():

    latest_resume = await db.resumes.find_one(
        sort=[("_id", -1)]
    )

    if not latest_resume:
        return {
            "message": "No resumes found"
        }

    return {
        "filename": latest_resume.get("filename", ""),
        "resume_text": latest_resume.get("resume_text", "")
    }
app.include_router(auth_router)