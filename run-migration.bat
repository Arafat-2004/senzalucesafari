@echo off
echo ========================================
echo SENZA LUCE SAFARIS - Database Migration
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
echo.

echo Step 2: Testing Setup...
node test-setup.js
echo.

echo Step 3: Running Migration...
node migrate-all-data.js
echo.

echo ========================================
echo Migration Complete!
echo ========================================
pause
