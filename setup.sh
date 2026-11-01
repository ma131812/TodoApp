#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# تنظیمات - مسیرها
# ============================================
PROJECT_DIR="WooToDo"          # پوشه‌ای که manage.py در آن است
REQ_FILE="req.txt"             # فایل نیازمندی‌ها
VENV_DIR="venv"                # پوشه محیط مجازی
HOST="127.0.0.1"
PORT="8000"

echo -e "${GREEN}=== راه‌اندازی پروژه Django ===${NC}"

# ============================================
# 1. بررسی وجود فایل‌ها
# ============================================
if [ ! -f "$REQ_FILE" ]; then
    echo -e "${RED}خطا: فایل $REQ_FILE پیدا نشد!${NC}"
    exit 1
fi

if [ ! -f "$PROJECT_DIR/manage.py" ]; then
    echo -e "${RED}خطا: فایل $PROJECT_DIR/manage.py پیدا نشد!${NC}"
    echo -e "${YELLOW}ساختار پروژه را بررسی کنید.${NC}"
    exit 1
fi

# ============================================
# 1.5. انتخاب میرور pip توسط کاربر
# ============================================
PIP_INDEX_ARGS=()

echo -e "${YELLOW}آیا می‌خواهید برای نصب پکیج‌ها از میرور (آینه) خاصی استفاده کنید؟${NC}"
echo -e "  ${GREEN}1)${NC} بله، از میرور پیش‌فرض (بدون تغییر) استفاده کن"
echo -e "  ${GREEN}2)${NC} بله، یک میرور دلخواه وارد می‌کنم"
read -r -p "انتخاب شما [1/2] (پیش‌فرض: 1): " mirror_choice
mirror_choice=${mirror_choice:-1}

case "$mirror_choice" in
    2)
        read -r -p "آدرس میرور را وارد کنید (مثال: https://mirror.example.com/simple): " mirror_url
        if [ -z "$mirror_url" ]; then
            echo -e "${RED}خطا: آدرس میرور خالی است. از میرور پیش‌فرض استفاده می‌شود.${NC}"
        else
            PIP_INDEX_ARGS=(--index-url "$mirror_url")
            echo -e "${GREEN}✓ میرور انتخاب شد: $mirror_url${NC}"
        fi
        ;;
    1)
        echo -e "${YELLOW}از میرور پیش‌فرض pip استفاده می‌شود.${NC}"
        ;;
    *)
        echo -e "${RED}انتخاب نامعتبر. از میرور پیش‌فرض pip استفاده می‌شود.${NC}"
        ;;
esac

# ============================================
# 2. ساخت venv در کنار پروژه
# ============================================
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}در حال ساخت محیط مجازی (venv)...${NC}"
    python3 -m venv "$VENV_DIR"
    echo -e "${GREEN}✓ محیط مجازی ساخته شد.${NC}"
else
    echo -e "${YELLOW}محیط مجازی از قبل وجود دارد.${NC}"
fi

# ============================================
# 3. فعال‌سازی venv
# ============================================
echo -e "${YELLOW}در حال فعال‌سازی محیط مجازی...${NC}"
source "$VENV_DIR/bin/activate"
echo -e "${GREEN}✓ فعال شد: $(which python)${NC}"

# ============================================
# 4. آپدیت pip
# ============================================
echo -e "${YELLOW}آپدیت pip...${NC}"
python -m pip install --upgrade pip --quiet "${PIP_INDEX_ARGS[@]}"

# ============================================
# 5. نصب پکیج‌ها
# ============================================
echo -e "${YELLOW}نصب پکیج‌ها از $REQ_FILE...${NC}"
pip install -r "$REQ_FILE" "${PIP_INDEX_ARGS[@]}"
echo -e "${GREEN}✓ نصب پکیج‌ها با موفقیت انجام شد.${NC}"

# ============================================
# 6. اجرای پروژه از مسیر صحیح
# ============================================
echo -e "${GREEN}=== اجرای پروژه Django در $HOST:$PORT ===${NC}"
cd "$PROJECT_DIR"
python manage.py runserver "$HOST:$PORT"
