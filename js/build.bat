@echo off
echo Choose library to build
echo 1 extjs
echo 2 jquery
choice /N /C 12 
if errorlevel == 2 goto jquery
if errorlevel == 1 goto extjs
goto end
:extjs
type core\init.js core\services\*.js core\workflows\*.js core\helpers\*.js extjs\init.js extjs\services\*.js extjs\workflows\*.js extjs\helpers\*.js > dist\extjs-firespark.js
goto end
:jquery
type core\init.js core\services\*.js core\workflows\*.js core\helpers\*.js jquery\init.js jquery\services\*.js jquery\workflows\*.js jquery\helpers\*.js jquery\templates\*.js > dist\jquery-firespark.js
goto end
:end
pause
