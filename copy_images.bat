@echo off
set SRC=C:\Users\chait\.gemini\antigravity\brain\f73fdf03-6a13-4fb0-a555-3d02b1fa51b7
set DEST=d:\Ck\Programming\Cubic-Technologies-Showcase\client\public\images

echo Checking source directory...
dir "%SRC%\*.png"

echo Copying images...
copy /Y /B "%SRC%\web_development_hero_1772444020033.png" "%DEST%\web_development.png"
copy /Y /B "%SRC%\ui_ux_design_hero_1772444034290.png" "%DEST%\ui_ux_design.png"
copy /Y /B "%SRC%\ai_solutions_hero_1772444049313.png" "%DEST%\ai_solutions.png"
copy /Y /B "%SRC%\digital_marketing_hero_1772444063530.png" "%DEST%\digital_marketing.png"
copy /Y /B "%SRC%\web_applications_hero_1772444079867.png" "%DEST%\web_applications.png"
copy /Y /B "%SRC%\maintenance_support_hero_1772444097460.png" "%DEST%\maintenance.png"
copy /Y /B "%SRC%\team_culture_lifestyle_1772444113953.png" "%DEST%\team.png"

echo Checking destination directory...
dir "%DEST%"
