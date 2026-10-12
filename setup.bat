@echo off
REM ============================================
REM راه اندازی پروژه Django - ویندوز
REM ============================================

set PROJECT_DIR=WooToDo
set REQ_FILE=req.txt
set VENV_DIR=venv
set HOST=127.0.0.1
set PORT=8000

echo === راه اندازی پروژه Django ===

REM 1. بررسی وجود فایل ها
if not exist "%REQ_FILE%" (
    echo خطا: فایل %REQ_FILE% پیدا نشد!
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%\manage.py" (
    echo خطا: فایل %PROJECT_DIR%\manage.py پیدا نشد!
    pause
    exit /b 1
)

REM 2. ساخت venv
if not exist "%VENV_DIR%" (
    echo در حال ساخت محیط مجازی venv...
    python -m venv %VENV_DIR%
    if errorlevel 1 (
        echo خطا در ساخت محیط مجازی!
        pause
        exit /b 1
    )
    echo محیط مجازی ساخته شد.
) else (
    echo محیط مجازی از قبل وجود دارد.
)

REM 3. فعال سازی
echo در حال فعال سازی محیط مجازی...
call %VENV_DIR%\Scripts\activate.bat

REM 4. آپدیت pip
echo آپدیت pip...
python -m pip install --upgrade pip --quiet

REM 5. نصب پکیج ها
echo نصب پکیج ها از %REQ_FILE%...
pip install -r %REQ_FILE%
if errorlevel 1 (
    echo خطا در نصب پکیج ها!
    pause
    exit /b 1
)
echo نصب پکیج ها با موفقیت انجام شد.

REM 6. اجرای پروژه
echo === اجرای پروژه Django در %HOST%:%PORT% ===
cd /d "%PROJECT_DIR%"
python manage.py runserver %HOST%:%PORT%

pause
