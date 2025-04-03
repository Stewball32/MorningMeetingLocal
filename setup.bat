@echo off
setlocal enabledelayedexpansion

REM Load variables from setup.env
for /f "tokens=1,* delims==" %%A in (setup.env) do (
	set "%%A=%%B"
)

REM Set defaults if not set
if not defined POCKETBASE_VERSION set POCKETBASE_VERSION=0.26.6
if not defined PB_DIR set PB_DIR=pocketbase
if not defined SAMPLE_DATA_DIR set SAMPLE_DATA_DIR=sample_pb_data
if not defined PB_DATA_DIR set PB_DATA_DIR=pb_data
if not defined ANIMOTION_DIR set ANIMOTION_DIR=animotion

REM Detect architecture
set ARCH=amd64
REM You could optionally add logic for 32-bit or ARM if needed

set FILENAME=pocketbase_%POCKETBASE_VERSION%_windows_%ARCH%.zip
set URL=https://github.com/pocketbase/pocketbase/releases/download/v%POCKETBASE_VERSION%/%FILENAME%

REM Create PocketBase directory
if not exist "%PB_DIR%" mkdir "%PB_DIR%"

echo Downloading PocketBase from %URL%...
curl -L -o "%PB_DIR%\pb.zip" "%URL%"

echo Unzipping...
powershell -Command "Expand-Archive -Force '%PB_DIR%\pb.zip' '%PB_DIR%'"
del "%PB_DIR%\pb.zip"
echo PocketBase extracted to %PB_DIR%

REM Create animotion\.env from .env.example if it doesn't exist
if not exist "%ANIMOTION_DIR%\.env" (
	if exist "%ANIMOTION_DIR%\.env.example" (
		echo Creating .env from .env.example...
		copy "%ANIMOTION_DIR%\.env.example" "%ANIMOTION_DIR%\.env" >nul
		echo .env created.
	) else (
		echo .env.example not found. Skipping .env creation.
	)
) else (
	echo .env already exists. Skipping.
)

REM Prompt to copy sample_pb_data to pb_data
set /p COPYDATA=Copy %PB_DIR%\%SAMPLE_DATA_DIR%\ to %PB_DIR%\%PB_DATA_DIR%\? This will back up existing data. (y/N): 
if /i "%COPYDATA%"=="y" (
	if exist "%PB_DIR%\%SAMPLE_DATA_DIR%" (
		if exist "%PB_DIR%\%PB_DATA_DIR%" (
			set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
			set "TIMESTAMP=!TIMESTAMP: =0!"
			set BACKUP_PATH=%PB_DIR%\.backups\pb_data_!TIMESTAMP!
			mkdir "%PB_DIR%\.backups"
			move "%PB_DIR%\%PB_DATA_DIR%" "!BACKUP_PATH!"
			echo Existing data backed up to !BACKUP_PATH!
		)
		xcopy /E /I /Y "%PB_DIR%\%SAMPLE_DATA_DIR%" "%PB_DIR%\%PB_DATA_DIR%\"
		echo sample_pb_data copied to pb_data
	) else (
		echo Folder not found: %PB_DIR%\%SAMPLE_DATA_DIR%
	)
)

REM Install npm packages
if exist "%ANIMOTION_DIR%\package.json" (
	echo Installing npm packages in %ANIMOTION_DIR%...
	pushd "%ANIMOTION_DIR%"
	npm install
	popd
) else (
	echo %ANIMOTION_DIR%\package.json not found. Skipping npm install.
)

echo Dev setup complete.
pause
