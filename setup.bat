@echo off
REM ============================================
REM راه اندازی پروژه Django - ویندوز
REM ============================================

set PROJECT_DIR=WooToDo
set REQ_FILE=req.txt
set VENV_DIR=venv
set HOST=127.0.0.1
set PORT=8000
set PIP_INDEX_ARGS=

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

REM 1.5. انتخاب میرور pip توسط کاربر
echo.
echo آیا می خواهید برای نصب پکیج ها از میرور خاصی استفاده کنید؟
echo   1^) خیر، از میرور پیش فرض pip استفاده کن
echo   2^) بله، یک میرور دلخواه وارد می کنم
set /p MIRROR_CHOICE=انتخاب شما [1/2] (پیش فرض: 1): 
if "%MIRROR_CHOICE%"=="" set MIRROR_CHOICE=1

if "%MIRROR_CHOICE%"=="2" (
    set /p MIRROR_URL=آدرس میرور را وارد کنید (مثال: https://mirror.example.com/simple): 
    if "%MIRROR_URL%"=="" (
        echo خطا: آدرس میرور خالی است. از میرور پیش فرض استفاده می شود.
    ) else (
        set PIP_INDEX_ARGS=--index-url "%MIRROR_URL%"
        echo میرور انتخاب شد: %MIRROR_URL%
    )
) else (
    if "%MIRROR_CHOICE%"=="1" (
        echo از میرور پیش فرض pip استفاده می شود.
    ) else (
        echo انتخاب نامعتبر. از میرور پیش فرض pip استفاده می شود.
    )
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
python -m pip install --upgrade pip --quiet %PIP_INDEX_ARGS%
if errorlevel 1 (
    echo خطا در آپدیت pip!
    pause
    exit /b 1
)

REM 5. نصب پکیج ها
echo نصب پکیج ها از %REQ_FILE%...
pip install -r %REQ_FILE% %PIP_INDEX_ARGS%
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
