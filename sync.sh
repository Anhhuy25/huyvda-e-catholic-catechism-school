#!/usr/bin/env bash
# Sync main với nhánh main của nguyenphucthanh/e-catholic-catechism-school.
# Khi có conflict, mặc định lấy code của họ (theirs).
set -euo pipefail

cd "$(dirname "$0")"

REMOTE_NAME="thanh"
REMOTE_URL="https://github.com/nguyenphucthanh/e-catholic-catechism-school.git"
BRANCH="main"

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  echo "==> Thêm remote '$REMOTE_NAME'"
  git remote add "$REMOTE_NAME" "$REMOTE_URL"
fi

echo "==> Fetch $REMOTE_NAME/$BRANCH"
git fetch "$REMOTE_NAME" "$BRANCH"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "!! Working tree đang có thay đổi chưa commit. Hãy commit hoặc stash trước khi sync."
  exit 1
fi

echo "==> Merge $REMOTE_NAME/$BRANCH vào $BRANCH (conflict -> lấy code của họ)"
if git merge --allow-unrelated-histories -X theirs "$REMOTE_NAME/$BRANCH" -m "Sync with $REMOTE_NAME/$BRANCH"; then
  echo "==> Merge xong. Kiểm tra khác biệt còn lại với $REMOTE_NAME/$BRANCH:"
  if git diff "$REMOTE_NAME/$BRANCH" --quiet; then
    echo "    Không còn khác biệt — source đã khớp 100%."
  else
    echo "    Vẫn còn khác biệt (thường do file trùng tên khác nhau), kiểm tra thủ công:"
    git diff "$REMOTE_NAME/$BRANCH" --stat
  fi
else
  echo "!! Merge có conflict chưa tự giải quyết được (thường là file bị xoá/đổi tên 2 phía)."
  echo "   Xem 'git status' để xử lý tay, rồi 'git add' + 'git commit' để hoàn tất."
  exit 1
fi

read -r -p "Push lên origin/$BRANCH luôn không? (y/N) " ans
if [[ "$ans" == "y" || "$ans" == "Y" ]]; then
  git push origin "$BRANCH"
else
  echo "Bỏ qua push. Chạy 'git push origin $BRANCH' khi bạn sẵn sàng."
fi
