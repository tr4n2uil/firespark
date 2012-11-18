@echo off
echo Welcome to jQuery FireSpark SmartInterface build script
:jquery
echo Cleaning up ...
del jquery-firespark.js

echo Building init ...
cd ..
type ..\..\..\services\snowblozm\js\Snowblozm.class.js >> dev\jquery-firespark.js
type init.js >> dev\jquery-firespark.js

echo Building core ...
cd core
for /r %%f in (*.js) do (type "%%f") >> ..\dev\jquery-firespark.js

echo Building ui ...
cd ../ui
for /r %%f in (*.js) do (type "%%f") >> ..\dev\jquery-firespark.js

echo Building smart ...
cd ../smart
for /r %%f in (*.js) do (type "%%f") >> ..\dev\jquery-firespark.js

echo Building config ...
cd ..
type config.js >> dev\jquery-firespark.js

:end
echo Successfully completed ...
pause
