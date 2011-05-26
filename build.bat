choice /N /C 12 /M "Choose the library to build (1:extjs, 2:mootools)"
if errorlevel == 1 goto extjs
goto end
:extjs
type ServiceClient.js extjs\init.js extjs\views\*.js extjs\renderers\*.js extjs\modules\*.js > dist\extjs-serviceclient.js
:end
pause
