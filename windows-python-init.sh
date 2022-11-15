cd python
python -m venv .venv
.venv/Scripts/activate.bat
pip install -r requirements.txt
uvicorn main:app --reload