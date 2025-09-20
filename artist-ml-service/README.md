## **Setup Instructions**

Follow the steps below to set up and run the project locally:

### Create a Virtual Environment

Use Python’s built-in `venv` module to create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

- **Windows**

  ```bash
  venv\Scripts\activate
  ```

- **macOS/Linux**

  ```bash
  source venv/bin/activate
  ```

---

### Install `pip-tools`

Install `pip-tools` to manage dependencies effectively:

```bash
pip install pip-tools
```

---

### Install Project Dependencies

Install the required packages from `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

### Run the FastAPI Service

Start the server using Uvicorn with automatic reloading for development:

```bash
uvicorn app.main:app --reload
```

The service will be accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).
