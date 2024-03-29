# Desktop Application for a Gym Company

This desktop application was developed to manage the company's customers, income and expenses.

## Technologies:
- Vue.js 3
- Electron
- Django

![image](https://github.com/maisappreis/upfit-project/assets/113925909/93fb4995-d68e-4aee-a6ba-abe8e9b105ab)



## 🌱 On Frontend Development

### 🛠️ Installation
```
npm install
```

### 🛠️ Running just the Frontend

To run in the browser:
```
npm run serve
```

To run in the desktop:
```
npm run electron:serve
```

To run JSON server:
```
cd public
json-server --watch db_test.json --port 3001
```

## 🌱 On Backend Development

### 🛠️ Installation

Create a virtual environment
Activate the virtual environment:
```
cd backend
python -m venv venv
.\.venv\Scripts\Activate.ps1 (On Windows)
or
source venv/bin/activate (On macOS/Linux)
```

```
pip install -r requirements.txt
```

### 🛠️ Running just the backend
```
python manage.py runserver
```

To run migrations:
```
python manage.py makemigrations
python manage.py migrate
```

# 🛠️ Running both: Frontend and Backend
```
npm start
```

## 💻 On Production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
