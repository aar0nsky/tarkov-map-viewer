@echo off
REM this creates a release and publishes to github then builds binaries on github

set arg1=%1
@echo Make sure that you have changed the version in package.json before running this!!!!!!!

pause

if [arg1]==[] goto :noarg
goto :performrelease

:performrelease
@echo Performing release version v%arg1%
git commit -am v%arg1%
git tag v%arg1%
git push && git push --tags
goto :quit

:error
echo Failed with error #%errorlevel%.
exit /b %errorlevel%

:noarg
@echo No version specified

:quit
exit /B 1