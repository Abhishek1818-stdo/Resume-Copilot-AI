import os
import json
import re
from dotenv import load_dotenv
from openai import OpenAI

# ----------------------------------------
# Load Environment Variables
# ----------------------------------------

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

MODEL = "meta-llama/llama-3.1-8b-instruct"


# ----------------------------------------
# Ask AI
# ----------------------------------------

def ask_ai(prompt):

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content


# ----------------------------------------
# Extract JSON
# ----------------------------------------

def extract_json(response_text):

    print("\n========== RAW AI RESPONSE ==========")
    print(response_text)
    print("=====================================\n")

    response_text = response_text.strip()

    response_text = re.sub(r"^```json", "", response_text)
    response_text = re.sub(r"^```", "", response_text)
    response_text = re.sub(r"```$", "", response_text)

    response_text = response_text.strip()

    start = response_text.find("{")
    end = response_text.rfind("}")

    if start != -1 and end != -1:
        response_text = response_text[start:end + 1]

    return json.loads(response_text)


# ----------------------------------------
# Resume Analysis
# ----------------------------------------

def analyze_resume(resume_text):

    prompt = f"""
You are an expert ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

DO NOT use markdown.

Return EXACTLY this format.

{{
  "summary":"",

  "strengths":[
    "",
    "",
    ""
  ],

  "weaknesses":[
    "",
    ""
  ],

  "missing_skills":[
    "",
    ""
  ],

  "career_suggestions":[
    "",
    ""
  ],

  "recommended_jobs":[
    "",
    "",
    ""
  ]
}}

Resume:

{resume_text}
"""

    try:

        result = ask_ai(prompt)

        return extract_json(result)

    except Exception as e:

        print("\nResume Analysis Error")
        print(e)

        return {
            "summary": "Unable to analyze resume.",
            "strengths": [],
            "weaknesses": [],
            "missing_skills": [],
            "career_suggestions": [],
            "recommended_jobs": [],
        }
        # ----------------------------------------
# Interview Questions
# ----------------------------------------

def generate_interview_questions(resume_text):

    prompt = f"""
You are a Senior Technical Interviewer.

Read the following resume carefully.

Generate interview questions.

Return ONLY valid JSON.

DO NOT use markdown.

Return EXACTLY this format.

{{
  "hr_questions":[
    "",
    "",
    "",
    "",
    ""
  ],

  "technical_questions":[
    "",
    "",
    "",
    "",
    ""
  ],

  "project_questions":[
    "",
    "",
    ""
  ]
}}

Resume:

{resume_text}
"""

    try:

        result = ask_ai(prompt)

        return extract_json(result)

    except Exception as e:

        print("\nInterview Question Error")
        print(e)

        return {
            "hr_questions": [],
            "technical_questions": [],
            "project_questions": [],
        }
        # ----------------------------------------
# AI Cover Letter Generator
# ----------------------------------------

def generate_cover_letter(resume_text, job_role, company_name):

    prompt = f"""
You are an expert HR professional.

Write a professional cover letter for the following job role.
Company:
{company_name}

Job Role:
{job_role}

Use the resume below to personalize the cover letter.

Resume:
{resume_text}

Rules:
- Keep it to 300-400 words.
- Make it professional.
- Start with "Dear Hiring Manager,".
- End with "Sincerely,".
- Return ONLY the cover letter text.
"""

    try:
        return ask_ai(prompt)

    except Exception as e:
        print("\nCover Letter Error")
        print(e)

        return "Unable to generate cover letter."