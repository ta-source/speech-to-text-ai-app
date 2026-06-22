from flask import (
    Flask,
    jsonify,
    request,
    send_file
)
from flask_socketio import (
    SocketIO,
    emit
)
from dotenv import load_dotenv

load_dotenv()

import os
import io

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)
from services.ai_services import (
    correct_transcript,
    summarize_transcript,
    translate_text,
    generate_email
)
from config import Config
from database.db import db
from models.transcript import Transcript
from services.speech_service import (
    transcribe_audio
)

from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True
)

socketio = SocketIO(
    app,
    cors_allowed_origins="*"
)
# Database Configuration
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = "uploads"

if not os.path.exists(
    UPLOAD_FOLDER
):
    os.makedirs(
        UPLOAD_FOLDER
    )


@app.route("/")
def home():

    return jsonify({
        "message":
            "Speech To Text API Running"
    })


@app.route("/transcribe", methods=["POST"])
def transcribe():

    try:

        file = request.files.get("file")

        if not file:
            return jsonify({
                "error": "No file uploaded"
            }), 400

        filepath = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        file.save(filepath)

        text = transcribe_audio(filepath)

        # TEMPORARY
        corrected_text = text

        new_transcript = Transcript(
            text=corrected_text
        )

        db.session.add(new_transcript)
        db.session.commit()

        return jsonify({
            "status": "success",
            "original": text,
            "transcript": corrected_text
        })

    except Exception as e:

        print("TRANSCRIBE ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/history")
def history():

    transcripts = (
        Transcript.query
        .order_by(
            Transcript.created_at.desc()
        )
        .all()
    )

    return jsonify([
        {
            "id":
                transcript.id,

            "text":
                transcript.text,

            "created_at":
                transcript.created_at.strftime(
                    "%d-%m-%Y %H:%M:%S"
                )
        }

        for transcript
        in transcripts
    ])


@app.route(
    "/transcript/<int:id>",
    methods=["DELETE"]
)
def delete_transcript(id):

    transcript = (
        Transcript.query.get(id)
    )

    if not transcript:

        return jsonify({
            "error":
                "Transcript not found"
        }), 404

    db.session.delete(
        transcript
    )

    db.session.commit()

    return jsonify({
        "message":
            "Transcript deleted successfully"
    })


@app.route(
    "/export-pdf",
    methods=["GET"]
)
def export_pdf():

    transcripts = (
        Transcript.query
        .order_by(
            Transcript.id.desc()
        )
        .all()
    )

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer
    )

    styles = (
        getSampleStyleSheet()
    )

    elements = []

    title = Paragraph(
        "Transcript History",
        styles["Title"]
    )

    elements.append(title)
    elements.append(
        Spacer(1, 20)
    )

    for item in transcripts:

        text = Paragraph(
            f"<b>{item.created_at}</b><br/>{item.text}",
            styles["BodyText"]
        )

        elements.append(text)
        elements.append(
            Spacer(1, 12)
        )

    doc.build(elements)

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="history.pdf",
        mimetype="application/pdf"
    )
@app.route(
    "/email",
    methods=["POST"]
)
def email_generator():

    data = request.json

    transcript = data.get(
        "transcript",
        ""
    )

    email = generate_email(
        transcript
    )

    return jsonify({
        "email": email
    })


# ====================================
# Real-Time Transcription Events
# ====================================

@socketio.on("connect")
def handle_connect():

    print("Client Connected")


@socketio.on("disconnect")
def handle_disconnect():

    print(
        "Client Disconnected"
    )


@socketio.on("audio_chunk")
def handle_audio_chunk(data):

    try:

        print("Audio chunk received")

        audio_bytes = bytes(
            data["audio"]
        )

        temp_file = os.path.join(
            UPLOAD_FOLDER,
            "live_chunk.webm"
        )

        with open(
            temp_file,
            "wb"
        ) as f:

            f.write(
                audio_bytes
            )

        text = transcribe_audio(
            temp_file
        )

        print(
            "LIVE TRANSCRIPT:",
            text
        )

        emit(
            "transcript_update",
            {
                "text": text
            }
        )

    except Exception as e:

        print(
            "LIVE ERROR:",
            str(e)
        )

        print("LIVE ERROR:", str(e))
@app.route(
    "/summary",
    methods=["POST"]
)
def generate_summary():

    data = request.json

    transcript = data.get(
        "transcript",
        ""
    )

    summary = summarize_transcript(
        transcript
    )

    return jsonify({
        "summary": summary
    })
@app.route(
    "/translate",
    methods=["POST"]
)
def translate():

    data = request.json

    transcript = data.get(
        "transcript",
        ""
    )

    language = data.get(
        "language",
        "Bengali"
    )

    translated_text = translate_text(
        transcript,
        language
    )

    return jsonify({
        "translation":
            translated_text
    })
@app.after_request
def after_request(response):
    response.headers.add(
        "Access-Control-Allow-Origin",
        "*"
    )
    response.headers.add(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
    )
    response.headers.add(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,OPTIONS"
    )
    return response
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    socketio.run(
        app,
        host="0.0.0.0",
        port=port
    )
