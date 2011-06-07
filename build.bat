@echo off
echo Choose library to build
echo 1 extjs
echo 2 jquery
choice /N /C 12 
if errorlevel == 2 goto jquery
if errorlevel == 1 goto extjs
goto end
:extjs
type ServiceClient.js extjs\init.js extjs\views\*.js extjs\requestors\*.js extjs\loaders\*.js extjs\renderers\*.js extjs\modules\*.js extjs\navigators\*.js > dist\extjs-serviceclient.js
goto end
:jquery
type ServiceClient.js jquery\init.js jquery\views\*.js jquery\requestors\*.js jquery\renderers\*.js jquery\loaders\*.js jquery\modules\*.js jquery\navigators\*.js > dist\jquery-serviceclient.js
goto end
:end
pause
