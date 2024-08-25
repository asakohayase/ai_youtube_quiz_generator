import os
from dotenv import load_dotenv
from openai import OpenAI
import tiktoken
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import json
import re

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

from middleware import add_middleware

load_dotenv()

app = FastAPI()

add_middleware(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class QuizRequest(BaseModel):
    video_id: str
    num_questions: int


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    explanation: str


class QuizResponse(BaseModel):
    quiz: list[QuizQuestion]


def get_translated_transcript(video_id, target_language="en"):
    try:
        # List all available transcripts
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try to find a transcript in the target language
        transcript = None
        if target_language in transcript_list._manually_created_transcripts:
            transcript = transcript_list.find_manually_created_transcript(
                [target_language]
            )
        elif target_language in transcript_list._generated_transcripts:
            transcript = transcript_list.find_generated_transcript([target_language])
        else:
            # If the target language transcript is not found, find a translatable one
            for transcript_item in transcript_list:
                try:
                    transcript = transcript_item.translate(target_language)
                    break
                except Exception as e:
                    continue

        if transcript:
            # Fetch the actual transcript
            transcript_data = transcript.fetch()
            formatter = TextFormatter()
            formatted_transcript = formatter.format_transcript(transcript_data)
            return formatted_transcript
        else:
            print(
                f"No transcript available in the requested language: {target_language}"
            )
            return None

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def split_text(text, max_tokens=1500):
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)

    chunks = []
    current_chunk = []
    current_tokens = 0

    for token in tokens:
        current_tokens += 1
        if current_tokens > max_tokens:
            chunks.append(encoding.decode(current_chunk))
            current_chunk = [token]
            current_tokens = 1
        else:
            current_chunk.append(token)

    if current_chunk:
        chunks.append(encoding.decode(current_chunk))

    return chunks


def summarize_text(text):
    chunks = split_text(text)
    summaries = []

    for chunk in chunks:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes text.",
                },
                {
                    "role": "user",
                    "content": f"Summarize the following text in about 150 words:\n\n{chunk}",
                },
            ],
            max_tokens=200,
        )
        summaries.append(response.choices[0].message.content)

    return " ".join(summaries)


def generate_quiz(summary, num_questions):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that creates quiz questions.",
                },
                {
                    "role": "user",
                    "content": f"Based on the following summary, create {num_questions} quiz questions with answers and explanations. Each question should be multiple choice with 4 options. Format your response as JSON with keys 'question', 'options' (a list of 4 strings with numbered indices, e.g., ['1. Option A', '2. Option B', '3. Option C', '4. Option D']), 'correct_answer' (the full text of the correct answer including its number), and 'explanation' (an explanation of why the answer is correct).\n\nSummary: {summary}",
                },
            ],
            max_tokens=1000,
        )
        quiz_json = response.choices[0].message.content
        # Process the response to create a valid JSON array
        quiz_objects = re.findall(r"\{[^{}]*\}", quiz_json)
        processed_quiz_json = f"[{','.join(quiz_objects)}]"

        # Validate the processed JSON
        quiz_data = json.loads(processed_quiz_json)

        # Ensure all options are properly numbered
        for question in quiz_data:
            for i, option in enumerate(question["options"], start=1):
                if not option.startswith(f"{i}. "):
                    question["options"][i - 1] = f"{i}. {option}"

            # Ensure correct_answer starts with its number
            correct_index = question["options"].index(question["correct_answer"])
            if not question["correct_answer"].startswith(f"{correct_index + 1}. "):
                question["correct_answer"] = (
                    f"{correct_index + 1}. {question['correct_answer']}"
                )

        return json.dumps(quiz_data)
    except json.JSONDecodeError as e:
        print(f"Error processing quiz JSON: {str(e)}")
        raise
    except Exception as e:
        print(f"Error in generate_quiz: {str(e)}")
        raise


def get_num_questions():
    while True:
        try:
            num_questions = int(
                input("Enter the number of quiz questions you want (1-15): ")
            )
            if 1 <= num_questions <= 15:
                return num_questions
            else:
                print("Please enter a number between 1 and 30.")
        except ValueError:
            print("Please enter a valid number.")


@app.post("/generate-quiz", response_model=QuizResponse)
async def generate_quiz_endpoint(request: QuizRequest):
    try:
        transcript = get_translated_transcript(request.video_id)
        if not transcript:
            raise HTTPException(status_code=404, detail="Failed to retrieve transcript")

        summary = summarize_text(transcript)
        quiz_json = generate_quiz(summary, request.num_questions)

        # Parse the JSON string into a Python object
        quiz_data = json.loads(quiz_json)
        quiz_questions = [QuizQuestion(**q) for q in quiz_data]

        return QuizResponse(quiz=quiz_questions)
    except json.JSONDecodeError as e:  # New: Specific exception handling
        print(f"JSON decode error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error parsing quiz JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    # Use the PORT environment variable or default to 8000 if not set
    port = int(os.getenv("PORT", 8000))

    uvicorn.run(app, host="0.0.0.0", port=port)
