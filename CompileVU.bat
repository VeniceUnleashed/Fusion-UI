@echo off
rmdir dist /s /q
mkdir dist
mkdir dist\static
mkdir dist\assets
xcopy static dist\static /s /e
xcopy assets dist\assets /s /e
rmdir dist\assets\scss /s /q
copy index.html dist\index.html
cd tools
vuicc.exe ..\dist ..\dist\ui.vuic
cd "%~dp0"