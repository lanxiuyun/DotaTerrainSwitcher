@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set "USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
set "DOWNLOAD_DIR=%~dp0"

echo Downloading Dota 2 Map Files...
echo.

:: Download dota_desert_741.7z
echo Downloading: dota_desert_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=6wb1zgw0vcgy&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/6wb1zgw0vcgy/dota_desert_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_desert_741.7z" --max-time 300 -C - 2>nul
    goto :next0
)
:next0
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_coloseum_741.7z
echo Downloading: dota_coloseum_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=ujt8q3waycv5&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/ujt8q3waycv5/dota_coloseum_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_coloseum_741.7z" --max-time 300 -C - 2>nul
    goto :next1
)
:next1
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_reef_741.7z
echo Downloading: dota_reef_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=i4gd5qicyq1s&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/i4gd5qicyq1s/dota_reef_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_reef_741.7z" --max-time 300 -C - 2>nul
    goto :next2
)
:next2
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_cavern_741.7z
echo Downloading: dota_cavern_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=4p593kcbvoow&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/4p593kcbvoow/dota_cavern_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_cavern_741.7z" --max-time 300 -C - 2>nul
    goto :next3
)
:next3
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_jungle_741.7z
echo Downloading: dota_jungle_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=jgh8clxgi7kl&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/jgh8clxgi7kl/dota_jungle_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_jungle_741.7z" --max-time 300 -C - 2>nul
    goto :next4
)
:next4
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_ti10_741.7z
echo Downloading: dota_ti10_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=tp8vsekecsa1&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/tp8vsekecsa1/dota_ti10_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_ti10_741.7z" --max-time 300 -C - 2>nul
    goto :next5
)
:next5
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download default_741.7z
echo Downloading: default_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=9n57hx2vukez&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/9n57hx2vukez/dota_crownfall_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_default_741.7z" --max-time 300 -C - 2>nul
    goto :next6
)
:next6
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_journey_741.7z
echo Downloading: dota_journey_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=tvpxlnpynzt7&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/tvpxlnpynzt7/dota_journey_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_journey_741.7z" --max-time 300 -C - 2>nul
    goto :next7
)
:next7
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_winter_741.7z
echo Downloading: dota_winter_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=1agg1q3wa7l6&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/1agg1q3wa7l6/dota_winter_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_winter_741.7z" --max-time 300 -C - 2>nul
    goto :next8
)
:next8
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_spring_741.7z
echo Downloading: dota_spring_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=xm0zga9k3gv7&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/xm0zga9k3gv7/dota_spring_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_spring_741.7z" --max-time 300 -C - 2>nul
    goto :next9
)
:next9
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_summer_741.7z
echo Downloading: dota_summer_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=cccsb05lz5l4&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/cccsb05lz5l4/dota_summer_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_summer_741.7z" --max-time 300 -C - 2>nul
    goto :next10
)
:next10
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul
timeout /t 3 /nobreak >nul

:: Download dota_autumn_741.7z
echo Downloading: dota_autumn_741.7z
curl -s -L -A "%USER_AGENT%" -X POST -d "op=download2&id=qhdk8dg9x9cc&rand=&referer=&method_free=&method_premium=" "https://sharemods.com/qhdk8dg9x9cc/dota_autumn_741.7z.html" -o "%DOWNLOAD_DIR%temp_step2.html" --max-time 30 2>nul
findstr /r "smdl.*r2.cloudflarestorage.com" "%DOWNLOAD_DIR%temp_step2.html" > "%DOWNLOAD_DIR%temp_link.txt" 2>nul
for /f tokens^=2^ delims^=^" %%a in (%DOWNLOAD_DIR%temp_link.txt) do (
    echo   Got download link, downloading file...
    curl -L -A "%USER_AGENT%" "%%a" -o "%DOWNLOAD_DIR%dota_autumn_741.7z" --max-time 300 -C - 2>nul
    goto :done
)
:done
del "%DOWNLOAD_DIR%temp_step2.html" 2>nul
del "%DOWNLOAD_DIR%temp_link.txt" 2>nul

echo.
echo All downloads completed!
